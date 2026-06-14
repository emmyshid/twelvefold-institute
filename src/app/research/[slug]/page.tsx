import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ESSAYS, getEssay } from "../essays";

// ════════════════════════════════════════════════════════════════
// /research/[slug] — individual essay.
//
// generateStaticParams pre-renders every essay at build time → fast,
// SEO-friendly static pages (essays must rank, per the Solution
// Architecture's authority goal). generateMetadata gives each essay
// its own <title> and description for search + social cards.
// ════════════════════════════════════════════════════════════════

const T = {
  bg: "#06060F",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.72)",
  textMuted: "rgba(237,233,245,0.42)",
  border: "rgba(255,255,255,0.08)",
  cardBg: "rgba(255,255,255,0.025)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

export function generateStaticParams() {
  return ESSAYS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return { title: "Essay not found | Twelvefold Institute" };
  return {
    title: `${essay.title} | Twelvefold Institute`,
    description: essay.dek,
    openGraph: {
      title: essay.title,
      description: essay.dek,
      type: "article",
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

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
      <div aria-hidden style={{ position: "fixed", width: "min(640px, 90vw)", height: "min(640px, 90vw)", top: -160, left: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.20), transparent 70%)", filter: "blur(110px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", width: "min(500px, 85vw)", height: "min(500px, 85vw)", bottom: -120, right: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.08), transparent 70%)", filter: "blur(110px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "clamp(28px, 5vw, 50px) clamp(20px, 5vw, 56px) clamp(80px, 12vw, 120px)" }}>
        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(40px, 7vw, 64px)" }}>
          <Link href="/" style={{ fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700, textDecoration: "none" }}>
            <span style={{ color: T.text }}>Twelvefold</span>{" "}
            <span style={{ color: T.accent }}>Institute</span>
          </Link>
          <Link href="/research" style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.textMuted, textTransform: "uppercase", textDecoration: "none" }}>← All essays</Link>
        </nav>

        {/* Article header */}
        <article>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.accent, textTransform: "uppercase", fontWeight: 700 }}>{essay.category}</span>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: T.textMuted }} />
            <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted, textTransform: "uppercase" }}>{essay.readingTime} read</span>
          </div>

          <h1 style={{ fontFamily: T.font, fontSize: "clamp(34px, 6vw, 52px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.8px", margin: "0 0 18px" }}>{essay.title}</h1>
          <p style={{ fontFamily: T.font, fontSize: "clamp(18px, 2.6vw, 22px)", fontStyle: "italic", color: T.textDim, lineHeight: 1.5, marginBottom: "40px", paddingBottom: "32px", borderBottom: `1px solid ${T.border}` }}>{essay.dek}</p>

          {/* Body blocks */}
          <div>
            {essay.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} style={{ fontFamily: T.font, fontSize: "clamp(24px, 3.5vw, 30px)", fontWeight: 600, letterSpacing: "-0.3px", lineHeight: 1.25, margin: "40px 0 16px" }}>{block.text}</h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={i} style={{ margin: "32px 0", padding: "20px 28px", borderLeft: `3px solid ${T.gold}`, background: "rgba(251,191,36,0.05)", borderRadius: "0 12px 12px 0" }}>
                    <p style={{ fontFamily: T.font, fontSize: "clamp(20px, 3vw, 24px)", fontStyle: "italic", color: T.text, lineHeight: 1.5, margin: 0 }}>{block.text}</p>
                  </blockquote>
                );
              }
              return (
                <p key={i} style={{ fontFamily: T.font, fontSize: "18.5px", color: T.textDim, lineHeight: 1.75, marginBottom: "22px" }}>{block.text}</p>
              );
            })}
          </div>
        </article>

        {/* Closing CTA */}
        <div style={{ marginTop: "60px", padding: "32px", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontFamily: T.font, fontSize: "17px", fontStyle: "italic", color: T.textDim, lineHeight: 1.6, marginBottom: "22px", maxWidth: 520, margin: "0 auto 22px" }}>
            Pattern Literacy is something you practice, not just read about. The brief reading on the homepage is the fastest way to feel it on something real.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#try-it" style={{ padding: "13px 26px", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", textDecoration: "none", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>Try a reading</Link>
            <Link href="/research" style={{ padding: "13px 26px", background: "transparent", color: T.text, textDecoration: "none", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", border: `1px solid ${T.border}`, minHeight: "44px", display: "inline-flex", alignItems: "center" }}>More essays</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ marginTop: "60px", textAlign: "center", fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, lineHeight: 1.6, letterSpacing: "0.3px" }}>
          Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
        </p>
      </div>
    </div>
  );
}
