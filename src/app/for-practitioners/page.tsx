import type { Metadata } from "next";
import PractitionerLeadForm from "./PractitionerLeadForm";

// ════════════════════════════════════════════════════════════════
// /for-practitioners — audience-specific conversion page for
// therapists, coaches, OD consultants, and educators.
//
// Funnel position: STAGE 3 (Conversion).
// Entry from: paid community → upgrade prompts, /research essays,
//   podcast appearances, direct LinkedIn outreach.
// Exit to: /certification (full program details + Stripe checkout).
//
// Composition matches /certification visually but the message is
// audience-specific: pain point first ("your clients see patterns
// — give them language"), then curriculum, then graduate voices,
// then a low-friction lead form (no payment, just interest).
//
// The lead form posts to /api/certification/apply with
// source='for-practitioners' so the admin can segment follow-up.
// ════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Pattern Literacy for Practitioners | Twelvefold Institute",
  description:
    "Therapists, coaches, and consultants: add Pattern Literacy to your practice. A 200-hour certification giving your clients language for the patterns they're already living.",
  openGraph: {
    title: "Pattern Literacy for Practitioners",
    description:
      "Give your clients language for the patterns they're already living. A 200-hour Twelvefold certification for therapists, coaches, and consultants.",
    type: "website",
  },
};

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
  goldDim: "rgba(251,191,36,0.12)",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  radius: "18px",
  radiusSm: "11px",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

const RECOGNITION_BULLETS = [
  "A client returns with the same conflict in a new relationship — and you can name which phase keeps reactivating.",
  "An executive describes feeling stuck. You see immediately which micro-state they're caught in, and what receiving it would look like.",
  "A team brings you the third version of the same restructure. You can read whether it's Contraction asking for completion or Initiation asking for clarity.",
  "Instead of giving advice, you give the person language for what's already happening — and watch their own intelligence take over.",
];

const CURRICULUM_PHASES = [
  {
    label: "PHASE I",
    title: "Foundations",
    weeks: "Weeks 1–8 · 60 hours",
    body: "The 12 phases, the 4 micro-states, the 48 pattern states. Six wisdom traditions and how they converge. You'll read your own patterns first, then start reading for peer practice partners.",
  },
  {
    label: "PHASE II",
    title: "Applied Pattern Reading",
    weeks: "Weeks 9–18 · 80 hours",
    body: "Supervised practicums with real clients (your own or assigned). Case study analysis from cohort 1 graduates. How to deliver readings that empower rather than prescribe — the difference between language-giving and advice-giving.",
  },
  {
    label: "PHASE III",
    title: "Practice & Certification",
    weeks: "Weeks 19–24 · 60 hours",
    body: "Final practicum review. Specialization in your modality (therapy, coaching, OD, education). Ethics intensive. Certification credential issued by Twelvefold Institute, recognized by participating wisdom-tradition partners.",
  },
];

const SAMPLE_LESSONS = [
  {
    n: "01",
    module: "Module 3 · Phase Recognition",
    title: "Reading Phase Without Knowing the Story",
    body: "How to recognize which of the 12 phases is active from a 60-second client statement — before they've told you the content. Six practitioner exercises.",
  },
  {
    n: "02",
    module: "Module 7 · The Four Micro-States",
    title: "When Contraction Is Wisdom and When It's Avoidance",
    body: "The single hardest discernment in pattern literacy. A framework for telling the difference, with case studies from therapy and executive coaching.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I&rsquo;ve practiced as a depth therapist for eighteen years. This is the first framework I&rsquo;ve trained in where my clients say, after a session, &lsquo;That&rsquo;s exactly it.&rsquo; The language fits what they&rsquo;re already living.",
    name: "Therapist, cohort 1",
    context: "Depth-oriented private practice",
  },
  {
    quote:
      "My coaching shifted from helping executives make decisions to helping them recognize which phase they&rsquo;re already in. The result: faster decisions, less second-guessing, real alignment.",
    name: "Executive coach, cohort 1",
    context: "Fortune 500 leadership coaching",
  },
  {
    quote:
      "As an OD consultant I was sceptical of any &lsquo;wisdom traditions&rsquo; framing. The training is rigorously secular and the framework is genuinely useful for diagnosing what&rsquo;s actually happening inside an org.",
    name: "OD consultant, cohort 1",
    context: "Mid-market organizational development",
  },
];

const FAQS = [
  {
    q: "How is this different from coach training or therapy certification I already have?",
    a: "It doesn't replace your existing credential. It adds a layer: a framework for reading which phase someone is in, without imposing content on them. Most graduates report it makes their existing modality more accurate, not different.",
  },
  {
    q: "Is the framework compatible with [psychodynamic / CBT / IFS / somatic / coaching / etc.]?",
    a: "Yes. The framework is diagnostic, not prescriptive — it describes the phase someone is in without dictating method. Graduates apply it inside their existing modality, not as a replacement.",
  },
  {
    q: "What's the time commitment?",
    a: "200 hours over 24 weeks. Roughly 8 hours per week including live sessions (2 hours), reading, peer practicums, and supervised client work in Phase II. Designed for working practitioners.",
  },
  {
    q: "How many people are in a cohort?",
    a: "12 to 16. Small enough for personalized supervision; large enough for diverse peer practice. We won't run a cohort larger than 16.",
  },
  {
    q: "What does certification actually credential me to do?",
    a: "It credentials you as a Twelvefold-certified Pattern Literacy practitioner — qualified to offer pattern readings inside your existing practice. The credential is issued by Twelvefold Institute. It does not replace any licensure required by your jurisdiction.",
  },
];

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
        marginBottom: "16px",
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

export default function ForPractitionersPage() {
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
            color: T.text,
          }}
        >
          <span style={{ color: T.text }}>Twelvefold</span>{" "}
          <span style={{ color: T.accent }}>Institute</span>
        </a>
        <a
          href="/certification"
          style={{
            fontFamily: T.fontMono,
            fontSize: "11px",
            letterSpacing: "1.5px",
            color: T.textDim,
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          Full program →
        </a>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 64px)",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <Eyebrow color={T.gold}>For practitioners</Eyebrow>
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
          Your clients already see patterns.
          <br />
          <span style={{ color: T.accent, fontStyle: "italic" }}>Give them language.</span>
        </h1>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "clamp(18px, 2.5vw, 22px)",
            color: T.textDim,
            lineHeight: 1.55,
            margin: "0 0 36px",
            maxWidth: 620,
          }}
        >
          A 200-hour certification in Pattern Literacy &mdash; the framework that
          gives therapists, coaches, and consultants a way to read which phase
          a client is in, without imposing content on them.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="#lead-form"
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
            Request cohort details →
          </a>
          <a
            href="/certification"
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
            See the full program
          </a>
        </div>
      </section>

      {/* ─── PAIN POINT / RECOGNITION ────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 880,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.accent}>What changes in your practice</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 28px",
            color: T.text,
          }}
        >
          The hour after you finish the training, your sessions are different.
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "18px",
            color: T.textDim,
            lineHeight: 1.7,
            marginBottom: "32px",
            maxWidth: 640,
          }}
        >
          Not because you have new techniques. Because you have a framework
          for reading which of the twelve phases your client is in, and which
          micro-state inside that phase. The framework doesn&rsquo;t replace
          your existing modality &mdash; it sharpens it.
        </p>

        <div style={{ display: "grid", gap: "12px" }}>
          {RECOGNITION_BULLETS.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                padding: "18px 22px",
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
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CURRICULUM ──────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 1080,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>The training</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 14px",
            color: T.text,
          }}
        >
          Three phases. 200 hours. 24 weeks.
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "17px",
            color: T.textDim,
            lineHeight: 1.65,
            marginBottom: "44px",
            maxWidth: 640,
          }}
        >
          Cohorts of 12&ndash;16. Live sessions, supervised practicums, and
          peer practice partners. Designed around the schedule of a working
          practitioner.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {CURRICULUM_PHASES.map((p) => (
            <div
              key={p.label}
              style={{
                padding: "28px 28px",
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
                  marginBottom: "12px",
                }}
              >
                {p.label}
              </div>
              <h3
                style={{
                  fontFamily: T.font,
                  fontSize: "22px",
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 6px",
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                }}
              >
                {p.title}
              </h3>
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: T.textMuted,
                  marginBottom: "16px",
                }}
              >
                {p.weeks}
              </div>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "15.5px",
                  color: T.textDim,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Sample lessons */}
        <div style={{ marginTop: "52px" }}>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "2px",
              color: T.textMuted,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Sample lessons from the curriculum
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "14px",
            }}
          >
            {SAMPLE_LESSONS.map((l) => (
              <div
                key={l.n}
                style={{
                  padding: "24px 26px",
                  background: T.goldDim,
                  border: `1px solid rgba(251,191,36,0.22)`,
                  borderLeft: `3px solid ${T.gold}`,
                  borderRadius: T.radiusSm,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "baseline",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: "12px",
                      color: T.gold,
                      fontWeight: 700,
                      letterSpacing: "1px",
                    }}
                  >
                    {l.n}
                  </span>
                  <span
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: "10px",
                      letterSpacing: "1.2px",
                      color: T.textMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {l.module}
                  </span>
                </div>
                <h4
                  style={{
                    fontFamily: T.font,
                    fontSize: "19px",
                    fontWeight: 600,
                    color: T.text,
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {l.title}
                </h4>
                <p
                  style={{
                    fontFamily: T.font,
                    fontSize: "15px",
                    color: T.textDim,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {l.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 1080,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.accent}>What graduates say</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 36px",
            color: T.text,
            maxWidth: 720,
          }}
        >
          Three voices from cohort 1.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "28px 28px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "17px",
                  fontStyle: "italic",
                  color: T.text,
                  lineHeight: 1.6,
                  flex: 1,
                  marginBottom: "20px",
                }}
                dangerouslySetInnerHTML={{ __html: `&ldquo;${t.quote}&rdquo;` }}
              />
              <div style={{ paddingTop: "16px", borderTop: `1px solid ${T.border}` }}>
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    color: T.accent,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "1.2px",
                    color: T.textMuted,
                    textTransform: "uppercase",
                  }}
                >
                  {t.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQS ────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 820,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>Common questions</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 36px",
            color: T.text,
          }}
        >
          From practitioners considering the work.
        </h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {FAQS.map((f, i) => (
            <details
              key={i}
              style={{
                background: T.bgCardSubtle,
                border: `1px solid ${T.border}`,
                borderRadius: T.radiusSm,
                padding: "18px 22px",
              }}
            >
              <summary
                style={{
                  fontFamily: T.font,
                  fontSize: "17px",
                  fontWeight: 600,
                  color: T.text,
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  lineHeight: 1.4,
                }}
              >
                <span>{f.q}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: "20px", color: T.accent, flexShrink: 0 }}>+</span>
              </summary>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "15.5px",
                  color: T.textDim,
                  lineHeight: 1.65,
                  margin: "14px 0 0",
                }}
              >
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── LEAD FORM ───────────────────────────────────── */}
      <section
        id="lead-form"
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 680,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <PractitionerLeadForm />
        <p
          style={{
            fontFamily: T.fontMono,
            fontSize: "11px",
            color: T.textMuted,
            textAlign: "center",
            marginTop: "28px",
            letterSpacing: "0.5px",
          }}
        >
          Ready to enroll directly?{" "}
          <a href="/certification" style={{ color: T.accent, textDecoration: "none" }}>
            See full certification &rarr;
          </a>
        </p>
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
