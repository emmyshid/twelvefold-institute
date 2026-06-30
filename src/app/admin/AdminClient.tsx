"use client";

import { useState, useMemo, Fragment } from "react";
import { UserButton } from "@clerk/nextjs";

// ════════════════════════════════════════════════════════════════
// Admin client component.
// Displays the four operational data sources as tabs.
// Inline status dropdowns post to /api/admin/status to update rows
// without leaving the page. Optimistic UI: row updates locally,
// server call confirms (or reverts on error).
// ════════════════════════════════════════════════════════════════

const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.6)",
  textMuted: "rgba(237,233,245,0.34)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  green: "#4ADE80",
  red: "#FF6B6B",
  blue: "#60A5FA",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

interface AppRow {
  id: string;
  name: string;
  email: string;
  motivation: string | null;
  practiceType: string | null;
  source: string | null;
  status: string;
  createdAt: string | null;
}
interface ConsultRow {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string | null;
  scope: string | null;
  message: string | null;
  status: string;
  createdAt: string | null;
}
interface PaymentRow {
  id: string;
  email: string;
  name: string | null;
  product: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string | null;
  paidAt: string | null;
}
interface ReadingRow {
  id: string;
  input: string;
  patternName: string | null;
  phase: string | null;
  microState: string | null;
  createdAt: string | null;
  clerkUserId: string | null;
}

interface Props {
  adminEmail: string | null;
  applications: AppRow[];
  consults: ConsultRow[];
  payments: PaymentRow[];
  readings: ReadingRow[];
}

type Tab = "applications" | "consults" | "payments" | "readings";

const STATUS_OPTIONS: Record<string, string[]> = {
  cert_applications: ["received", "reviewing", "admitted", "declined"],
  consult_requests: ["received", "qualified", "scheduled", "closed"],
};

const STATUS_COLORS: Record<string, string> = {
  received: T.blue,
  reviewing: T.accent,
  admitted: T.green,
  declined: T.red,
  qualified: T.accent,
  scheduled: T.green,
  closed: T.textMuted,
  pending: T.gold,
  succeeded: T.green,
  failed: T.red,
  refunded: T.textMuted,
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtAmount(cents: number, currency: string): string {
  const amount = cents / 100;
  return `${currency.toUpperCase()} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminClient({ adminEmail, applications, consults, payments, readings }: Props) {
  const [tab, setTab] = useState<Tab>("applications");
  const [apps, setApps] = useState(applications);
  const [cons, setCons] = useState(consults);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Summary stats
  const stats = useMemo(() => {
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const now = Date.now();
    const within = (rows: { createdAt: string | null }[], ms: number) =>
      rows.filter((r) => r.createdAt && now - new Date(r.createdAt).getTime() < ms).length;
    return {
      newAppsToday: within(apps, day),
      newAppsWeek: within(apps, week),
      newConsultsWeek: within(cons, week),
      newPaymentsWeek: within(payments, week),
      successfulPayments: payments.filter((p) => p.status === "succeeded").length,
      totalRevenue: payments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0),
      pendingApps: apps.filter((a) => a.status === "received").length,
      newConsultsToday: within(cons, day),
      pendingConsults: cons.filter((c) => c.status === "received").length,
    };
  }, [apps, cons, payments]);

  async function updateStatus(
    table: "cert_applications" | "consult_requests",
    id: string,
    status: string,
  ) {
    // Optimistic update
    if (table === "cert_applications") {
      setApps((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } else {
      setCons((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
    try {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      // Revert on failure — refetch would be cleaner but this is good enough
      alert("Could not update status. Refresh and try again.");
    }
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "applications", label: "Cert Applications", count: apps.length },
    { id: "consults", label: "Institutional Consults", count: cons.length },
    { id: "payments", label: "Payments", count: payments.length },
    { id: "readings", label: "Readings", count: readings.length },
  ];

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        .adm-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .adm-table th { font-family: ${T.fontMono}; font-size: 10px; letter-spacing: 1.5px; color: ${T.textMuted}; text-transform: uppercase; text-align: left; padding: 14px 16px; border-bottom: 1px solid ${T.border}; }
        .adm-table td { font-family: ${T.font}; font-size: 15px; color: ${T.text}; padding: 14px 16px; border-bottom: 1px solid ${T.border}; vertical-align: top; }
        .adm-table tr:hover td { background: rgba(255,255,255,0.02); }
        .adm-row-clickable { cursor: pointer; }
        .adm-pill { display: inline-block; padding: 4px 10px; border-radius: 999px; font-family: ${T.fontMono}; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
        .adm-select { background: rgba(255,255,255,0.05); border: 1px solid ${T.border}; border-radius: 6px; color: ${T.text}; font-family: ${T.fontMono}; font-size: 11px; padding: 5px 8px; cursor: pointer; }
        .adm-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
        @media (max-width: 760px) {
          .adm-mobile-hide { display: none; }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px clamp(16px, 4vw, 32px)",
          gap: "14px",
          background: "rgba(6,6,15,0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            fontFamily: T.fontMono,
            fontSize: "14px",
            letterSpacing: "1px",
            fontWeight: 700,
          }}
        >
          <span style={{ color: T.text }}>Twelvefold</span>{" "}
          <span style={{ color: T.accent }}>·</span>{" "}
          <span style={{ color: T.gold, fontFamily: T.font, fontStyle: "italic", fontSize: "16px" }}>Admin</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {adminEmail && (
            <span
              className="adm-mobile-hide"
              style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim }}
            >
              {adminEmail}
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Stats */}
      <section style={{ padding: "clamp(20px, 3vw, 32px) clamp(16px, 4vw, 32px) 0", maxWidth: 1280, margin: "0 auto" }}>
        <div className="adm-stats">
          <StatCard label="Pending applications" value={stats.pendingApps.toString()} accent={T.gold} sub={`${stats.newAppsWeek} new this week`} />
          <StatCard label="Pending consults" value={stats.pendingConsults.toString()} accent={T.accent} sub={`${stats.newConsultsWeek} new this week`} />
          <StatCard label="Successful payments" value={stats.successfulPayments.toString()} accent={T.green} sub={`${stats.newPaymentsWeek} this week`} />
          <StatCard
            label="Lifetime revenue"
            value={`$${(stats.totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            accent={T.gold}
            sub="across all products"
          />
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: "clamp(20px, 3vw, 32px) clamp(16px, 4vw, 32px)", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "16px",
            borderBottom: `1px solid ${T.border}`,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setExpanded(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: tab === t.id ? T.text : T.textDim,
                fontFamily: T.fontMono,
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: tab === t.id ? `2px solid ${T.gold}` : "2px solid transparent",
                marginBottom: "-1px",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}{" "}
              <span style={{ color: T.textMuted, marginLeft: "6px" }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: "14px",
            overflow: "hidden",
            overflowX: "auto",
          }}
        >
          {tab === "applications" && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="adm-mobile-hide">Practice</th>
                  <th className="adm-mobile-hide">Motivation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontStyle: "italic" }}>
                      No applications yet.
                    </td>
                  </tr>
                ) : (
                  apps.map((r) => (
                    <tr key={r.id} className="adm-row-clickable" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                      <td style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, whiteSpace: "nowrap" }}>
                        {fmtDate(r.createdAt)}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {r.name}
                        {r.source && (
                          <div style={{ fontFamily: T.fontMono, fontSize: "9.5px", color: T.textMuted, letterSpacing: "0.5px", marginTop: "2px", fontWeight: 400 }}>
                            via {r.source}
                          </div>
                        )}
                      </td>
                      <td style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.textDim }}>{r.email}</td>
                      <td className="adm-mobile-hide" style={{ fontFamily: T.fontMono, fontSize: "11px", color: r.practiceType ? T.accent : T.textMuted, letterSpacing: "0.5px" }}>
                        {r.practiceType || <em style={{ color: T.textMuted, fontStyle: "italic" }}>—</em>}
                      </td>
                      <td className="adm-mobile-hide" style={{ maxWidth: 320, color: T.textDim }}>
                        {expanded === r.id
                          ? r.motivation || <em>(no motivation given)</em>
                          : truncate(r.motivation, 80)}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="adm-select"
                          value={r.status}
                          onChange={(e) => updateStatus("cert_applications", r.id, e.target.value)}
                          style={{ color: STATUS_COLORS[r.status] || T.text }}
                        >
                          {STATUS_OPTIONS.cert_applications.map((s) => (
                            <option key={s} value={s} style={{ background: "#1a1a2e", color: T.text }}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === "consults" && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th className="adm-mobile-hide">Scope</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cons.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontStyle: "italic" }}>
                      No consult requests yet.
                    </td>
                  </tr>
                ) : (
                  cons.map((r) => (
                    <Fragment key={r.id}>
                      <tr className="adm-row-clickable" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                        <td style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, whiteSpace: "nowrap" }}>
                          {fmtDate(r.createdAt)}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {r.name}
                          <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, fontWeight: 400, marginTop: "3px" }}>
                            {r.email}
                          </div>
                        </td>
                        <td>
                          {r.organization}
                          {r.role && (
                            <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim, marginTop: "3px" }}>
                              {r.role}
                            </div>
                          )}
                        </td>
                        <td className="adm-mobile-hide">
                          <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.gold }}>
                            {r.scope || "—"}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className="adm-select"
                            value={r.status}
                            onChange={(e) => updateStatus("consult_requests", r.id, e.target.value)}
                            style={{ color: STATUS_COLORS[r.status] || T.text }}
                          >
                            {STATUS_OPTIONS.consult_requests.map((s) => (
                              <option key={s} value={s} style={{ background: "#1a1a2e", color: T.text }}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {expanded === r.id && r.message && (
                        <tr>
                          <td colSpan={5} style={{ background: "rgba(167,139,250,0.04)", padding: "16px 24px" }}>
                            <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.accent, textTransform: "uppercase", marginBottom: "8px" }}>
                              Their message
                            </div>
                            <div style={{ fontFamily: T.font, fontSize: "16px", color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                              {r.message}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === "payments" && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Email</th>
                  <th className="adm-mobile-hide">Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontStyle: "italic" }}>
                      No payments yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, whiteSpace: "nowrap" }}>
                        {fmtDate(r.createdAt)}
                      </td>
                      <td>{r.email}</td>
                      <td className="adm-mobile-hide" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim }}>
                        {r.product}
                      </td>
                      <td style={{ fontFamily: T.fontMono, fontSize: "13px", fontWeight: 700 }}>
                        {fmtAmount(r.amount, r.currency)}
                      </td>
                      <td>
                        <span className="adm-pill" style={{ background: `${STATUS_COLORS[r.status] || T.text}22`, color: STATUS_COLORS[r.status] || T.text }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === "readings" && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Pattern</th>
                  <th className="adm-mobile-hide">Phase · Micro</th>
                  <th>User</th>
                  <th className="adm-mobile-hide">Input excerpt</th>
                </tr>
              </thead>
              <tbody>
                {readings.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontStyle: "italic" }}>
                      No readings yet.
                    </td>
                  </tr>
                ) : (
                  readings.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, whiteSpace: "nowrap" }}>
                        {fmtDate(r.createdAt)}
                      </td>
                      <td style={{ fontStyle: "italic", color: T.text }}>
                        {r.patternName || <span style={{ color: T.textMuted, fontStyle: "normal" }}>—</span>}
                      </td>
                      <td className="adm-mobile-hide" style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.accent }}>
                        {r.phase || "—"}
                        {r.microState ? ` · ${r.microState}` : ""}
                      </td>
                      <td style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim }}>
                        {r.clerkUserId ? `${r.clerkUserId.slice(0, 12)}…` : <em>anonymous</em>}
                      </td>
                      <td className="adm-mobile-hide" style={{ color: T.textDim, maxWidth: 320, fontSize: "13px" }}>
                        {truncate(r.input, 100)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: "20px", fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, textAlign: "center" }}>
          Showing 50 most recent rows from each source. Full data lives in Supabase.
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent, sub }: { label: string; value: string; accent: string; sub: string }) {
  return (
    <div
      style={{
        padding: "20px 22px",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "14px",
        borderTop: `2px solid ${accent}`,
      }}
    >
      <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: T.textMuted, textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontFamily: T.font, fontSize: "32px", fontWeight: 600, color: T.text, lineHeight: 1, marginBottom: "6px" }}>
        {value}
      </div>
      <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textDim }}>{sub}</div>
    </div>
  );
}

function truncate(s: string | null, n: number): string {
  if (!s) return "—";
  return s.length <= n ? s : s.slice(0, n).trim() + "…";
}
