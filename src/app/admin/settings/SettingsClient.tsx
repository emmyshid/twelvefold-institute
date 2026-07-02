"use client";

import { useState } from "react";
import Link from "next/link";

const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardSubtle: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.6)",
  textMuted: "rgba(237,233,245,0.34)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  green: "#4ADE80",
  red: "#FF6B6B",
  amber: "#F59E0B",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

interface PricingRow {
  productKey: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  mode: "payment" | "subscription";
  interval?: "month" | "year";
  active: boolean;
  isOverride: boolean;
  updatedBy: string | null;
  updatedAt: string | null;
}

interface Props {
  adminEmail: string | null;
  initialPricing: PricingRow[];
}

interface DraftState {
  amount: string;        // dollars input, converted to cents on save
  currency: string;
  name: string;
  description: string;
  active: boolean;
}

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(dollars: string): number | null {
  const n = parseFloat(dollars);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function toDraft(row: PricingRow): DraftState {
  return {
    amount: centsToDollars(row.amount),
    currency: row.currency,
    name: row.name,
    description: row.description,
    active: row.active,
  };
}

export default function SettingsClient({ adminEmail, initialPricing }: Props) {
  const [pricing, setPricing] = useState<PricingRow[]>(initialPricing);
  const [drafts, setDrafts] = useState<Record<string, DraftState>>(
    Object.fromEntries(initialPricing.map((p) => [p.productKey, toDraft(p)]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState<string | null>(null);

  function updateDraft(productKey: string, patch: Partial<DraftState>) {
    setDrafts((d) => ({ ...d, [productKey]: { ...d[productKey], ...patch } }));
    // Clear any error on this row when the user starts editing again
    if (errors[productKey]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[productKey];
        return next;
      });
    }
  }

  function isDirty(row: PricingRow): boolean {
    const d = drafts[row.productKey];
    if (!d) return false;
    return (
      d.amount !== centsToDollars(row.amount) ||
      d.currency !== row.currency ||
      d.name !== row.name ||
      d.description !== row.description ||
      d.active !== row.active
    );
  }

  async function saveRow(row: PricingRow) {
    const d = drafts[row.productKey];
    if (!d) return;

    const cents = dollarsToCents(d.amount);
    if (cents === null) {
      setErrors((e) => ({ ...e, [row.productKey]: "Price must be a valid positive number." }));
      return;
    }
    if (d.name.trim().length < 2) {
      setErrors((e) => ({ ...e, [row.productKey]: "Name must be at least 2 characters." }));
      return;
    }
    if (!/^[a-z]{3}$/.test(d.currency.trim().toLowerCase())) {
      setErrors((e) => ({ ...e, [row.productKey]: "Currency must be a 3-letter ISO code." }));
      return;
    }

    setSaving(row.productKey);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: row.productKey,
          amount: cents,
          currency: d.currency.trim().toLowerCase(),
          name: d.name.trim(),
          description: d.description.trim(),
          active: d.active,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Save failed");

      // Update the local row to reflect the new values
      setPricing((p) =>
        p.map((r) =>
          r.productKey === row.productKey
            ? {
                ...r,
                amount: cents,
                currency: d.currency.trim().toLowerCase(),
                name: d.name.trim(),
                description: d.description.trim(),
                active: d.active,
                isOverride: true,
                updatedAt: new Date().toISOString(),
                updatedBy: adminEmail,
              }
            : r
        )
      );
      setFlash(`Saved ${row.productKey}. New checkouts use these values immediately.`);
    } catch (e) {
      setErrors((err) => ({
        ...err,
        [row.productKey]: e instanceof Error ? e.message : "Save failed",
      }));
    } finally {
      setSaving(null);
    }
  }

  async function resetRow(row: PricingRow) {
    if (!row.isOverride) return;
    if (!confirm(`Reset ${row.productKey} to the hardcoded defaults? Any custom values will be lost.`)) {
      return;
    }
    setSaving(row.productKey);
    setFlash(null);
    try {
      const res = await fetch(
        `/api/admin/pricing?productKey=${encodeURIComponent(row.productKey)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Reset failed");

      // Reload the page to fetch fresh defaults
      window.location.reload();
    } catch (e) {
      setErrors((err) => ({
        ...err,
        [row.productKey]: e instanceof Error ? e.message : "Reset failed",
      }));
      setSaving(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: ${T.bg}; }
        input, textarea, select {
          font-family: ${T.font};
          font-size: 15px;
          background: rgba(255,255,255,0.03);
          border: 1px solid ${T.border};
          border-radius: 8px;
          color: ${T.text};
          padding: 9px 12px;
          outline: none;
          width: 100%;
          transition: border-color 0.15s ease;
        }
        input:focus, textarea:focus, select:focus { border-color: ${T.accent}; }
        textarea { resize: vertical; min-height: 60px; }
        .adm-label {
          font-family: ${T.fontMono};
          font-size: 10px;
          letter-spacing: 1.5px;
          color: ${T.textMuted};
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 6px;
          display: block;
        }
      `}</style>

      {/* Header */}
      <header style={{ padding: "24px clamp(20px, 4vw, 48px)", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <Link href="/admin" style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.textDim, textDecoration: "none", textTransform: "uppercase" }}>
            ← Admin
          </Link>
          <h1 style={{ fontFamily: T.font, fontSize: "28px", fontWeight: 600, letterSpacing: "-0.3px", margin: "6px 0 0" }}>
            Settings — Product Pricing
          </h1>
        </div>
        {adminEmail && (
          <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, letterSpacing: "0.5px" }}>
            Signed in as <span style={{ color: T.textDim }}>{adminEmail}</span>
          </div>
        )}
      </header>

      {/* Warning banner — the single most important piece of context */}
      <section style={{ padding: "20px clamp(20px, 4vw, 48px)" }}>
        <div style={{ padding: "16px 20px", background: `${T.amber}18`, border: `1px solid ${T.amber}40`, borderLeft: `3px solid ${T.amber}`, borderRadius: "10px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
            How Stripe handles price changes
          </div>
          <p style={{ fontFamily: T.font, fontSize: "15px", color: T.text, lineHeight: 1.6, margin: 0 }}>
            Changes here apply to <strong>new checkouts only</strong>. Existing subscribers keep the price they were originally charged. To migrate current subscribers to a new price, use the Stripe dashboard&rsquo;s subscription update flow (with proration if you want to be fair about it).
          </p>
        </div>
      </section>

      {flash && (
        <section style={{ padding: "0 clamp(20px, 4vw, 48px) 20px" }}>
          <div style={{ padding: "12px 16px", background: `${T.green}15`, border: `1px solid ${T.green}40`, borderRadius: "8px", fontFamily: T.font, fontSize: "14px", color: T.text }}>
            ✓ {flash}
          </div>
        </section>
      )}

      {/* Product cards */}
      <section style={{ padding: "0 clamp(20px, 4vw, 48px) 60px" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          {pricing.map((row) => {
            const draft = drafts[row.productKey];
            const dirty = isDirty(row);
            const err = errors[row.productKey];
            const isSubscription = row.mode === "subscription";

            return (
              <div key={row.productKey} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "22px 24px" }}>
                {/* Row header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      {row.productKey}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textDim, padding: "3px 8px", background: T.bgCardSubtle, borderRadius: "999px", border: `1px solid ${T.border}` }}>
                        {isSubscription ? `SUBSCRIPTION · ${row.interval?.toUpperCase()}` : "ONE-TIME PAYMENT"}
                      </span>
                      {row.isOverride ? (
                        <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.accent, letterSpacing: "1px" }}>
                          ● OVERRIDDEN
                        </span>
                      ) : (
                        <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, letterSpacing: "1px" }}>
                          ○ USING DEFAULTS
                        </span>
                      )}
                      {!row.active && (
                        <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.red, letterSpacing: "1px" }}>
                          ⊘ INACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                  {row.updatedAt && (
                    <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, textAlign: "right" }}>
                      Updated {new Date(row.updatedAt).toLocaleString()}
                      {row.updatedBy && <div>by {row.updatedBy}</div>}
                    </div>
                  )}
                </div>

                {/* Editable fields */}
                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="adm-label">Display name</label>
                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => updateDraft(row.productKey, { name: e.target.value })}
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="adm-label">Currency</label>
                      <input
                        type="text"
                        value={draft.currency}
                        onChange={(e) => updateDraft(row.productKey, { currency: e.target.value })}
                        maxLength={3}
                        placeholder="usd"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="adm-label">Description</label>
                    <textarea
                      value={draft.description}
                      onChange={(e) => updateDraft(row.productKey, { description: e.target.value })}
                      maxLength={1000}
                      rows={2}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "flex-end" }}>
                    <div>
                      <label className="adm-label">
                        Price ({draft.currency.toUpperCase()}
                        {isSubscription && row.interval ? ` / ${row.interval}` : ""})
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: T.fontMono, fontSize: "16px", color: T.textDim }}>$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={draft.amount}
                          onChange={(e) => updateDraft(row.productKey, { amount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="adm-label">Status</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "9px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: "8px" }}>
                        <input
                          type="checkbox"
                          checked={draft.active}
                          onChange={(e) => updateDraft(row.productKey, { active: e.target.checked })}
                          style={{ width: "auto", margin: 0, accentColor: T.accent }}
                        />
                        <span style={{ fontFamily: T.font, fontSize: "14px", color: T.text }}>
                          {draft.active ? "Active — available for new checkouts" : "Inactive — checkouts blocked"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {err && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", background: `${T.red}15`, border: `1px solid ${T.red}40`, borderRadius: "8px", fontFamily: T.font, fontSize: "14px", color: "#FF9B9B" }}>
                    {err}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => saveRow(row)}
                    disabled={!dirty || saving === row.productKey}
                    style={{
                      padding: "10px 22px",
                      background: dirty ? "linear-gradient(135deg, #FBBF24, #F59E0B)" : "rgba(255,255,255,0.05)",
                      color: dirty ? "#1a1206" : T.textMuted,
                      border: "none",
                      borderRadius: "999px",
                      fontFamily: T.fontMono,
                      fontSize: "11px",
                      letterSpacing: "1px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      cursor: dirty && saving !== row.productKey ? "pointer" : "not-allowed",
                      opacity: saving === row.productKey ? 0.6 : 1,
                    }}
                  >
                    {saving === row.productKey ? "Saving…" : dirty ? "Save changes" : "No changes"}
                  </button>
                  {row.isOverride && (
                    <button
                      onClick={() => resetRow(row)}
                      disabled={saving === row.productKey}
                      style={{
                        padding: "10px 20px",
                        background: "transparent",
                        color: T.textDim,
                        border: `1px solid ${T.border}`,
                        borderRadius: "999px",
                        fontFamily: T.fontMono,
                        fontSize: "11px",
                        letterSpacing: "1px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        cursor: saving === row.productKey ? "not-allowed" : "pointer",
                      }}
                    >
                      Reset to defaults
                    </button>
                  )}
                  {dirty && (
                    <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.amber, letterSpacing: "0.5px" }}>
                      ● unsaved changes
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
