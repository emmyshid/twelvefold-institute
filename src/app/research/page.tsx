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

        {/* Disclaimer */}
        <p style={{ marginTop: "60px", textAlign: "center", fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, lineHeight: 1.6, letterSpacing: "0.3px" }}>
          Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
        </p>
      </div>
    </div>
  );
}
