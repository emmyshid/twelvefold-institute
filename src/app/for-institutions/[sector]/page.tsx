import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SECTORS, SECTOR_KEYS, type Sector } from "./sectorConfig";
import InstitutionsConsultForm from "./InstitutionsConsultForm";

// ════════════════════════════════════════════════════════════════
// /for-institutions/[sector] — audience-specific conversion pages
// for schools, healthcare, and corporate leadership.
//
// Funnel position: STAGE 3 (Conversion).
// Entry from: /institutions hub, direct search, referrals.
// Exit to: /api/institutions/consult (existing endpoint) with
//   scope="[sector]:[engagementType]" so admin can filter by
//   sector and by requested engagement type simultaneously.
//
// Uses the existing consult_requests table with no schema change.
// The scope field is repurposed to carry both dimensions.
// ════════════════════════════════════════════════════════════════

// Pre-render all 3 sectors at build time
export function generateStaticParams() {
  return SECTOR_KEYS.map((sector) => ({ sector }));
}

// SEO metadata per sector
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector } = await params;
  const config = SECTORS[sector as Sector];
  if (!config) return { title: "For Institutions | Twelvefold Institute" };

  return {
    title: `Pattern Literacy ${config.eyebrow} | Twelvefold Institute`,
    description: config.hero.sub,
    openGraph: {
      title: `Pattern Literacy ${config.eyebrow}`,
      description: config.hero.sub,
      type: "website",
    },
  };
}

const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardSubtle: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.14)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.65)",
  textMuted: "rgba(237,233,245,0.4)",
  accent: "#A78BFA",
  accentDark: "#7C3AED",
  gold: "#FBBF24",
  goldDim: "rgba(251,191,36,0.10)",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  radius: "18px",
  radiusSm: "11px",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: T.fontMono,
        fontSize: "11px",
        letterSpacing: "3px",
        color: color || T.gold,
        textTransform: "uppercase",
        marginBottom: "18px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color || T.gold,
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}

export default async function ForInstitutionsSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector } = await params;
  const config = SECTORS[sector as Sector];
  if (!config) notFound();

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: T.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: ${T.bg}; }
        ::selection { background: ${T.gold}30; color: ${T.text}; }
      `}</style>

      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "20px clamp(20px, 5vw, 64px)",
          background: "rgba(6,6,15,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontFamily: T.fontMono,
            fontSize: "14px",
            letterSpacing: "1px",
            fontWeight: 700,
            color: T.text,
          }}
        >
          <span style={{ color: T.text }}>Twelvefold</span>{" "}
          <span style={{ color: T.accent }}>Institute</span>
        </Link>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {SECTOR_KEYS.map((s) => (
            <Link
              key={s}
              href={`/for-institutions/${s}`}
              style={{
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: s === config.key ? T.accent : T.textDim,
                background: s === config.key ? "rgba(167,139,250,0.10)" : "transparent",
                border: `1px solid ${s === config.key ? T.accent : T.border}`,
                padding: "7px 14px",
                borderRadius: "999px",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              {SECTORS[s].navLabel}
            </Link>
          ))}
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 64px)",
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        <Eyebrow color={T.gold}>{config.eyebrow}</Eyebrow>
        <h1
          style={{
            fontFamily: T.font,
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-1px",
            margin: "0 0 24px",
            color: T.text,
          }}
        >
          {config.hero.lead}
          <br />
          <span style={{ color: T.accent, fontStyle: "italic" }}>{config.hero.accent}</span>
        </h1>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "clamp(18px, 2.5vw, 22px)",
            color: T.textDim,
            lineHeight: 1.55,
            margin: "0 0 36px",
            maxWidth: 720,
          }}
        >
          {config.hero.sub}
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="#consult-form"
            style={{
              padding: "14px 32px",
              background: T.gradGold,
              color: "#1a1206",
              textDecoration: "none",
              borderRadius: "999px",
              fontFamily: T.fontMono,
              fontSize: "12px",
              letterSpacing: "1px",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              minHeight: "48px",
            }}
          >
            Book a consultation →
          </a>
          <Link
            href="/institutions"
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: T.text,
              border: `1px solid ${T.borderLight}`,
              textDecoration: "none",
              borderRadius: "999px",
              fontFamily: T.fontMono,
              fontSize: "12px",
              letterSpacing: "1px",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              minHeight: "48px",
            }}
          >
            See all institutional offerings
          </Link>
        </div>
      </section>

      {/* ─── PAIN POINT / RECOGNITION ────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 920,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.accent}>What we hear from leaders in your sector</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 24px",
            color: T.text,
          }}
        >
          {config.painPoint.heading}
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "18px",
            color: T.textDim,
            lineHeight: 1.7,
            marginBottom: "32px",
            maxWidth: 720,
          }}
        >
          {config.painPoint.body}
        </p>

        <div style={{ display: "grid", gap: "12px" }}>
          {config.painPoint.bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                padding: "20px 24px",
                background: T.bgCardSubtle,
                border: `1px solid ${T.border}`,
                borderRadius: T.radiusSm,
              }}
            >
              <span
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "11px",
                  color: T.gold,
                  flexShrink: 0,
                  marginTop: "3px",
                  letterSpacing: "1px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "16.5px",
                  color: T.text,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── USE CASES ───────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>How institutions engage</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 44px",
            color: T.text,
            maxWidth: 780,
          }}
        >
          Three typical engagement paths.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {config.useCases.map((uc, i) => (
            <div
              key={i}
              style={{
                padding: "30px 30px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
              }}
            >
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "10px",
                  letterSpacing: "2.5px",
                  color: T.gold,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                {uc.label}
              </div>
              <h3
                style={{
                  fontFamily: T.font,
                  fontSize: "22px",
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 14px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.3px",
                }}
              >
                {uc.title}
              </h3>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "15.5px",
                  color: T.textDim,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {uc.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROI / OUTCOMES ──────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 920,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.accent}>What to expect</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 24px",
            color: T.text,
          }}
        >
          {config.roi.heading}
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "17px",
            color: T.textDim,
            lineHeight: 1.7,
            marginBottom: "36px",
            maxWidth: 720,
          }}
        >
          {config.roi.body}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {config.roi.metrics.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "24px 22px",
                background: T.goldDim,
                border: `1px solid rgba(251,191,36,0.20)`,
                borderLeft: `3px solid ${T.gold}`,
                borderRadius: T.radiusSm,
              }}
            >
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "26px",
                  fontWeight: 600,
                  color: T.gold,
                  lineHeight: 1.1,
                  marginBottom: "6px",
                  letterSpacing: "-0.5px",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "10.5px",
                  color: T.textDim,
                  letterSpacing: "0.5px",
                  lineHeight: 1.4,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIAL ─────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 820,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>A voice from your sector</Eyebrow>
        <blockquote
          style={{
            fontFamily: T.font,
            fontSize: "clamp(20px, 2.5vw, 26px)",
            fontStyle: "italic",
            color: T.text,
            lineHeight: 1.55,
            margin: "0 0 28px",
            padding: "0",
            borderLeft: `3px solid ${T.accent}`,
            paddingLeft: "24px",
          }}
        >
          &ldquo;{config.testimonial.quote}&rdquo;
        </blockquote>
        <div style={{ paddingLeft: "27px" }}>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: "11px",
              letterSpacing: "1.5px",
              color: T.accent,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            {config.testimonial.name}
          </div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: "10.5px",
              letterSpacing: "1.2px",
              color: T.textMuted,
              textTransform: "uppercase",
            }}
          >
            {config.testimonial.context}
          </div>
        </div>
      </section>

      {/* ─── CONSULT FORM ────────────────────────────────── */}
      <section
        id="consult-form"
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 720,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <InstitutionsConsultForm
          sector={config.key}
          heading={config.cta.heading}
          body={config.cta.body}
        />
      </section>

      {/* ─── CROSS-LINKS ─────────────────────────────────── */}
      <section
        style={{
          padding: "40px clamp(20px, 5vw, 64px) 60px",
          maxWidth: 920,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "10px",
            letterSpacing: "2px",
            color: T.textMuted,
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 700,
          }}
        >
          Other sectors
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {SECTOR_KEYS.filter((s) => s !== config.key).map((s) => (
            <Link
              key={s}
              href={`/for-institutions/${s}`}
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
                textDecoration: "none",
              }}
            >
              {SECTORS[s].eyebrow} →
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer
        style={{
          padding: "40px clamp(20px, 5vw, 64px)",
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "13px",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          <span style={{ color: T.text }}>Twelvefold</span>{" "}
          <span style={{ color: T.accent }}>Institute</span>
        </div>
        <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted }}>
          twelvefold.institute
        </div>
      </footer>
    </div>
  );
}
