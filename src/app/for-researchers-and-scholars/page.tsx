import type { Metadata } from "next";
import Link from "next/link";
import { ESSAYS } from "../research/essays";
import ResearcherLeadForm from "./ResearcherLeadForm";

// ════════════════════════════════════════════════════════════════
// /for-researchers-and-scholars — audience-specific conversion
// page for academics, PhD students, policy researchers, and think
// tanks.
//
// Funnel position: STAGE 3 (Conversion) — the credibility engine.
// Entry from: /research essays, /method, academic outreach,
//   referrals from cohort-1 practitioners with academic ties.
// Exit to: /api/institutions/consult with scope="research:[type]"
//   so admin sees research inquiries as a distinct segment while
//   reusing the same infrastructure as institutional consults.
//
// Register: measured, epistemically honest, no marketing verbs.
// Researchers respond to what the framework does NOT claim as
// strongly as to what it does — the "What we don't claim" and
// "What we're testing" sections are the credibility spine.
// ════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "For Researchers & Scholars | Twelvefold Institute",
  description:
    "The framework makes testable claims about how human transformation is structured. This page is for the researchers, PhD students, and scholars examining those claims.",
  openGraph: {
    title: "For Researchers & Scholars — Twelvefold Institute",
    description:
      "The framework makes testable claims. This page is for the scholars examining them.",
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
  goldDim: "rgba(251,191,36,0.10)",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  radius: "18px",
  radiusSm: "11px",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

// What the framework claims — inherited from /method register,
// tightened for a researcher audience.
const CLAIMS = [
  {
    heading: "Convergence, not derivation",
    body: "Six wisdom traditions — Ifá, Kabbalah, the I Ching, scripture, Buddhism, Hermetic philosophy — developed largely without contact and yet substantially agree on the structural shape of human transformation. The framework's claim is that this convergence is evidence that the structure is recognized, not invented.",
  },
  {
    heading: "12 phases × 4 micro-states",
    body: "The 12-phase spine derives from the astronomical / zodiacal tradition (twelve lunar cycles per solar year). The 4 micro-states (Initiation → Expansion → Contraction → Integration) are the framework's specific structural contribution — not present as a discrete claim in any single tradition, but consistent with the qualitative distinctions each tradition draws.",
  },
  {
    heading: "Patterns as curriculum",
    body: "A recurring pattern is a curriculum being presented, not a pathology to be eliminated. This is a falsifiable hypothesis: if pattern literacy interventions consistently produce different outcomes than pathology-oriented interventions on the same recurrence, the claim gets support. If not, it doesn't.",
  },
];

// What the framework does NOT claim — this is the credibility spine
// for a scholarly audience.
const DISCLAIMERS = [
  "We do not claim that all six traditions taught the same thing. They differ profoundly on metaphysics, cosmology, and soteriology. The convergence is on structural pattern, not doctrine.",
  "We do not claim the framework replaces psychotherapy, clinical care, or evidence-based interventions. It is a diagnostic and orienting framework, not a treatment protocol.",
  "We do not claim the astrological labels (Aries, Taurus, etc.) confer causal power from celestial bodies. They function as borrowed vocabulary for the 12 phase-qualities, not as personality types or predictive signs.",
  "We do not claim to have completed the validation work. Longitudinal outcomes research is in progress with a small first cohort. Cross-cultural validity work is being sought. The framework is treated as a serious hypothesis under active empirical scrutiny — not as a settled science.",
];

// Research initiatives in progress. Same three tracks as the /research
// page, but with fuller detail here since this page's audience will
// actually read the specifics.
const RESEARCH_TRACKS = [
  {
    status: "Active",
    statusColor: "#4ADE80",
    title: "Longitudinal outcome tracking",
    lead: "Do pattern literacy interventions reduce pattern recurrence at six-month follow-up?",
    detail:
      "Data collection underway with the first practitioner cohort and their clients. Baseline captures the frequency and character of a recurring pattern the client names on intake; six-month follow-up captures the same. Design is quasi-experimental (no random assignment in the first wave), so this is descriptive rather than causal. A controlled study follows if the descriptive data supports proceeding.",
  },
  {
    status: "Seeking partners",
    statusColor: T.accent,
    title: "Cross-cultural validity",
    lead: "Do the 12-phase pattern qualities manifest consistently across cultures?",
    detail:
      "The convergence claim is empirically vulnerable to a cross-cultural counter-example. If the phase qualities that six wisdom traditions describe do not reproduce in cultures with different narrative structures, the convergence claim weakens substantially. Seeking research partnerships with universities in West Africa, East Asia, and continental Europe to run culturally-situated pattern recognition studies.",
  },
  {
    status: "Planned",
    statusColor: T.textMuted,
    title: "Practitioner efficacy study",
    lead: "Do practitioner-guided pattern readings produce different outcomes than self-directed framework use?",
    detail:
      "Design phase. The hypothesis is that framework knowledge alone is insufficient — that the practitioner's read of phase-in-the-room is where efficacy lives. This study compares self-directed cohorts (book + app only) to practitioner-guided cohorts on the same outcome measures. Powered to detect a medium effect size. Planning begins after the longitudinal study reaches interim analysis.",
  },
];

// Ways scholars can engage. Three distinct paths — not a menu of tiers.
const ENGAGEMENT_PATHS = [
  {
    label: "Institutional partnership",
    title: "Formal research collaboration",
    body: "Co-designed studies, shared IRB submissions, joint publication. Best for university faculty, research institutes, and think tanks with a specific empirical question about the framework or its outcomes. Includes access to anonymized cohort data and practitioner interviews under partnership terms.",
  },
  {
    label: "Graduate research / PhD access",
    title: "Individual scholarly access",
    body: "For PhD students, postdocs, and independent scholars working on adjacent questions (transformation psychology, wisdom-traditions comparative work, decision-making under uncertainty). Access to framework materials, ability to cite and reproduce the 48-state schema, and correspondence with the founding team where useful for a thesis or paper.",
  },
  {
    label: "Peer review or citation",
    title: "Review the work directly",
    body: "For scholars who want to review, critique, or cite the framework in their own published work. Full access to methodological documentation, the derivation of the 48-state schema, and the epistemological posture toward the wisdom traditions. Critique from qualified reviewers is welcomed; disagreement in print is welcomed.",
  },
];

// Essays curated for a scholarly audience — the ones with the most
// methodological / epistemic content. Filtered from the full essay list.
const CURATED_ESSAY_SLUGS = [
  "patterns-are-curriculum-not-pathology",
  "why-six-traditions-converge",
];
const CURATED_ESSAYS = ESSAYS.filter((e) => CURATED_ESSAY_SLUGS.includes(e.slug));

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

export default function ForResearchersPage() {
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
          <Link
            href="/method"
            style={{
              fontFamily: T.fontMono,
              fontSize: "11px",
              letterSpacing: "1.5px",
              color: T.textDim,
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "7px 14px",
            }}
          >
            Method
          </Link>
          <Link
            href="/research"
            style={{
              fontFamily: T.fontMono,
              fontSize: "11px",
              letterSpacing: "1.5px",
              color: T.textDim,
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "7px 14px",
            }}
          >
            Essays →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 64px)",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Eyebrow color={T.gold}>For researchers &amp; scholars</Eyebrow>
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
          The framework makes testable claims.
          <br />
          <span style={{ color: T.accent, fontStyle: "italic" }}>
            This page is for the people examining them.
          </span>
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
          Pattern literacy is a serious framework offered under active empirical scrutiny — not a settled science. This page names the claims, names what we are not claiming, describes the research in progress, and offers concrete ways for scholars to engage.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="#collective"
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
            Join the research collective →
          </a>
          <Link
            href="/method"
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
            Read the methodology
          </Link>
        </div>
      </section>

      {/* ─── WHAT THE FRAMEWORK CLAIMS ──────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 920,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.accent}>What the framework claims</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 32px",
            color: T.text,
          }}
        >
          Three claims. Each falsifiable.
        </h2>

        <div style={{ display: "grid", gap: "14px" }}>
          {CLAIMS.map((c, i) => (
            <div
              key={i}
              style={{
                padding: "26px 30px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
              }}
            >
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: T.gold,
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                {String(i + 1).padStart(2, "0")} · Claim
              </div>
              <h3
                style={{
                  fontFamily: T.font,
                  fontSize: "21px",
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 10px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.2px",
                }}
              >
                {c.heading}
              </h3>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "16px",
                  color: T.textDim,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT WE DO NOT CLAIM — the credibility spine ─ */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 920,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>What we do not claim</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 20px",
            color: T.text,
          }}
        >
          What&rsquo;s excluded matters as much as what&rsquo;s included.
        </h2>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "17px",
            color: T.textDim,
            lineHeight: 1.7,
            marginBottom: "32px",
            maxWidth: 720,
          }}
        >
          These are not caveats. They are constitutive of what the framework is. A researcher considering the work should be able to know precisely where the boundaries are.
        </p>
        <div style={{ display: "grid", gap: "10px" }}>
          {DISCLAIMERS.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "18px",
                padding: "20px 24px",
                background: T.bgCardSubtle,
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${T.textMuted}`,
                borderRadius: T.radiusSm,
              }}
            >
              <span
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "13px",
                  color: T.textMuted,
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                ✕
              </span>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "16px",
                  color: T.text,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RESEARCH IN PROGRESS ────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 1080,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>Research in progress</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "0 0 20px",
            color: T.text,
          }}
        >
          Three tracks of active empirical work.
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
          The framework is treated as a hypothesis under active scrutiny. These are the three questions currently being tested — with methodological honesty about design limits at this stage.
        </p>

        <div style={{ display: "grid", gap: "14px" }}>
          {RESEARCH_TRACKS.map((r) => (
            <div
              key={r.title}
              style={{
                padding: "28px 32px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: T.fontMono,
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: r.statusColor,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: r.statusColor,
                    display: "inline-block",
                  }}
                />
                {r.status}
              </div>
              <h3
                style={{
                  fontFamily: T.font,
                  fontSize: "22px",
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.3px",
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "16.5px",
                  fontStyle: "italic",
                  color: T.accent,
                  lineHeight: 1.55,
                  margin: "0 0 14px",
                }}
              >
                {r.lead}
              </p>
              <p
                style={{
                  fontFamily: T.font,
                  fontSize: "15.5px",
                  color: T.textDim,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {r.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CURATED ESSAYS ─────────────────────────────── */}
      {CURATED_ESSAYS.length > 0 && (
        <section
          style={{
            padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
            maxWidth: 1080,
            margin: "0 auto",
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <Eyebrow color={T.accent}>Published thinking</Eyebrow>
          <h2
            style={{
              fontFamily: T.font,
              fontSize: "clamp(28px, 4.5vw, 42px)",
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              margin: "0 0 12px",
              color: T.text,
            }}
          >
            Essays on the epistemology.
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
            The reasoning behind the framework, in long form. Selected for the scholarly audience. The full essay library is at{" "}
            <Link href="/research" style={{ color: T.accent, textDecoration: "none" }}>
              /research
            </Link>
            .
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {CURATED_ESSAYS.map((e) => (
              <Link
                key={e.slug}
                href={`/research/${e.slug}`}
                style={{
                  display: "block",
                  padding: "28px 30px",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  textDecoration: "none",
                  transition: "border-color 0.25s ease, transform 0.25s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    color: T.textMuted,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "14px",
                  }}
                >
                  <span style={{ color: T.gold }}>{e.category}</span>
                  <span>·</span>
                  <span>{e.readingTime}</span>
                </div>
                <h3
                  style={{
                    fontFamily: T.font,
                    fontSize: "22px",
                    fontWeight: 600,
                    color: T.text,
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {e.title}
                </h3>
                <p
                  style={{
                    fontFamily: T.font,
                    fontSize: "15.5px",
                    color: T.textDim,
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                  }}
                >
                  {e.dek}
                </p>
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "10.5px",
                    color: T.accent,
                    letterSpacing: "0.5px",
                  }}
                >
                  Read essay →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── WAYS TO ENGAGE ──────────────────────────────── */}
      <section
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow color={T.gold}>Ways to engage</Eyebrow>
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
          Three concrete paths for scholars.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {ENGAGEMENT_PATHS.map((p, i) => (
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
                {p.label}
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
                {p.title}
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
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COLLECTIVE FORM ─────────────────────────────── */}
      <section
        id="collective"
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)",
          maxWidth: 720,
          margin: "0 auto",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <ResearcherLeadForm />
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
          Continue
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/method"
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
            The methodology →
          </Link>
          <Link
            href="/research"
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
            All essays →
          </Link>
          <Link
            href="/book"
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
            The book →
          </Link>
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
