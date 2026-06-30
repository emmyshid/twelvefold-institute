import type { Metadata } from "next";
import Link from "next/link";
import { ESSAYS } from "./essays";

// ════════════════════════════════════════════════════════════════
// /research — the authority engine.
//
// The Solution Architecture named this "the authority engine —
// authority is built in public, in writing." This is the list page;
// individual essays live at /research/[slug].
//
// Option A (current): essays are hardcoded in essays.ts. When this
// graduates to a database, only essays.ts changes — this page keeps
// consuming the same ESSAYS array shape.
// ════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Research & Essays | Twelvefold Institute",
  description:
    "The thinking behind the work. Long-form essays on pattern literacy, the wisdom traditions, and the structure of human transformation.",
};

const T = {
  bg: "#06060F",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.65)",
  textMuted: "rgba(237,233,245,0.42)",
  border: "rgba(255,255,255,0.08)",
  cardBg: "rgba(255,255,255,0.025)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

export default function ResearchPage() {
  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: T.font,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{ position: "fixed", width: "min(640px, 90vw)", height: "min(640px, 90vw)", top: -160, left: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)", filter: "blur(110px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", width: "min(500px, 85vw)", height: "min(500px, 85vw)", bottom: -120, right: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.10), transparent 70%)", filter: "blur(110px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "clamp(28px, 5vw, 50px) clamp(20px, 5vw, 56px) clamp(80px, 12vw, 120px)" }}>
        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <Link href="/" style={{ fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700, textDecoration: "none" }}>
            <span style={{ color: T.text }}>Twelvefold</span>{" "}
            <span style={{ color: T.accent }}>Institute</span>
          </Link>
          <Link href="/" style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.textMuted, textTransform: "uppercase", textDecoration: "none" }}>← Home</Link>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: "clamp(40px, 7vw, 72px)" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "18px" }}>● Research &amp; thought leadership</div>
          <h1 style={{ fontFamily: T.font, fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 26px", maxWidth: 720 }}>The thinking behind the work.</h1>
          <p style={{ fontSize: "clamp(17px, 2.5vw, 21px)", lineHeight: 1.6, color: T.textDim, maxWidth: 620, fontStyle: "italic" }}>Long-form essays and papers. Authority is built in public, in writing — not in metrics.</p>
        </div>

        {/* Essay list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {ESSAYS.map((essay) => (
            <Link
              key={essay.slug}
              href={`/research/${essay.slug}`}
              style={{
                display: "block",
                padding: "28px 30px",
                background: T.cardBg,
                border: `1px solid ${T.border}`,
                borderRadius: "16px",
                textDecoration: "none",
                transition: "border-color 0.25s ease",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.accent, textTransform: "uppercase", fontWeight: 700 }}>{essay.category}</span>
                <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: T.textMuted }} />
                <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted, textTransform: "uppercase" }}>{essay.readingTime} read</span>
              </div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(24px, 3.6vw, 30px)", fontWeight: 600, letterSpacing: "-0.4px", lineHeight: 1.2, marginBottom: "8px", color: T.text }}>{essay.title}</h2>
              <p style={{ fontFamily: T.font, fontSize: "16.5px", color: T.textDim, lineHeight: 1.55, marginBottom: "14px" }}>{essay.dek}</p>
              <span style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", color: T.gold, textTransform: "uppercase", fontWeight: 700 }}>Read essay →</span>
            </Link>
          ))}
        </div>

        {/* Closing note */}
        <p style={{ marginTop: "56px", textAlign: "center", fontFamily: T.font, fontStyle: "italic", fontSize: "16px", color: T.textMuted, lineHeight: 1.6, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
          More essays are published as the work develops. This is a living library, not a finished archive.
        </p>

        {/* Research in progress */}
        <section style={{ marginTop: "72px", borderTop: `1px solid ${T.border}`, paddingTop: "52px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>
            Research in progress
          </div>
          <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.5px", margin: "0 0 16px", color: T.text }}>
            What we are trying to validate
          </h2>
          <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, lineHeight: 1.7, marginBottom: "36px", maxWidth: 640 }}>
            The Twelvefold framework makes a claim that deserves empirical scrutiny: that pattern literacy produces measurable changes in decision quality, pattern recurrence rate, and life-area outcomes over time. We are building the infrastructure to test this.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "36px" }}>
            {([
              {
                status: "Active",
                statusColor: "#4ADE80",
                title: "Longitudinal outcome tracking",
                body: "Do people who complete pattern readings report fewer recurrences of the same pattern six months later? Data collection underway with the first practitioner cohort.",
              },
              {
                status: "Seeking partners",
                statusColor: T.accent,
                title: "Cross-cultural validity",
                body: "Do the 12-phase patterns manifest consistently across cultures? Seeking research partnerships with universities in West Africa, East Asia, and Europe.",
              },
              {
                status: "Planned",
                statusColor: T.textMuted,
                title: "Practitioner efficacy study",
                body: "Comparing outcomes between self-directed framework use and practitioner-guided readings. Design phase.",
              },
            ] as { status: string; statusColor: string; title: string; body: string }[]).map((r) => (
              <div key={r.title} style={{ padding: "22px 22px", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "12px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: r.statusColor, textTransform: "uppercase", fontWeight: 700, marginBottom: "10px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: r.statusColor, display: "inline-block" }} />
                  {r.status}
                </div>
                <div style={{ fontFamily: T.font, fontSize: "18px", fontWeight: 600, color: T.text, marginBottom: "8px", letterSpacing: "-0.2px", lineHeight: 1.25 }}>{r.title}</div>
                <div style={{ fontFamily: T.font, fontSize: "14.5px", color: T.textDim, lineHeight: 1.6 }}>{r.body}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "24px 28px", background: "rgba(167,139,250,0.05)", border: `1px solid rgba(167,139,250,0.18)`, borderRadius: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>Research partnerships</div>
              <p style={{ fontFamily: T.font, fontSize: "15.5px", color: T.textDim, lineHeight: 1.65, margin: 0 }}>If you are a researcher, graduate student, or institutional partner interested in studying pattern literacy outcomes, we want to hear from you.</p>
            </div>
            <a href="mailto:hello@twelvefold.institute?subject=Research%20partnership" style={{ padding: "13px 24px", background: "transparent", color: T.text, textDecoration: "none", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", border: `1px solid ${T.border}`, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", minHeight: "44px" }}>
              Get in touch →
            </a>
          </div>
        </section>

        {/* Disclaimer */}
        <p style={{ marginTop: "60px", textAlign: "center", fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, lineHeight: 1.6, letterSpacing: "0.3px" }}>
          Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
        </p>
      </div>
    </div>
  );
}
