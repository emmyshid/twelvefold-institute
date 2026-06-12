import type { Metadata } from "next";
import Link from "next/link";
import BookSubscribeForm from "./BookSubscribeForm";

// ════════════════════════════════════════════════════════════════
// /book — marketing page for Pattern Literacy.
//
// Server component (for SEO + performance). All interactivity is
// in the BookSubscribeForm client component, mounted near the end.
// Content sourced from the actual book manuscript and publisher
// proposal — see /mnt/project for source files.
// ════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Pattern Literacy — the book | Twelvefold Institute",
  description:
    "How to Read the Intelligent Cycles Governing Your Life. A book by Emanuel Shidali, founder of Twelvefold Institute. Currently with publishers.",
};

const T = {
  bg: "#06060F",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.62)",
  textMuted: "rgba(237,233,245,0.38)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.14)",
  cardBg: "rgba(255,255,255,0.035)",
  accent: "#A78BFA",
  accentDeep: "#7C3AED",
  gold: "#FBBF24",
  goldDeep: "#F59E0B",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  gradAccent: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

const CHAPTERS: Array<{ n: string; title: string; desc: string }> = [
  {
    n: "01",
    title: "Reality Is Patterned",
    desc:
      "Why the cycles in your life are intelligible — and why six independent traditions have been mapping them for centuries.",
  },
  {
    n: "02",
    title: "The 12 Universal Cycles",
    desc:
      "The full sweep from Ignition through Dissolution. Each phase named, with the curriculum it carries.",
  },
  {
    n: "03",
    title: "The Four Micro-States",
    desc:
      "The phases within phases: Initiation, Expansion, Contraction, Integration — and why you can't skip them.",
  },
  {
    n: "04",
    title: "Timing & Cycles",
    desc:
      "How long phases last, why some can't be rushed, and what cooperating with timing actually looks like.",
  },
  {
    n: "05",
    title: "The 12 Phases Deep Dive",
    desc:
      "Every phase examined in depth: the curriculum, the pattern signature, and how each wisdom tradition names it.",
  },
  {
    n: "06",
    title: "Pattern Recognition In Your Own Life",
    desc:
      "How to spot the pattern you're inside, in real time, while it's still happening — not in retrospect.",
  },
  {
    n: "07",
    title: "Aligned Action",
    desc:
      "What cooperation with a phase looks like, in practice, on a Tuesday. The whole framework, applied.",
  },
  {
    n: "08",
    title: "Pattern Reading as Skill",
    desc:
      "How to develop pattern literacy as a daily competence, not a one-time insight that fades.",
  },
  {
    n: "09",
    title: "Working with Confrontation",
    desc:
      "When the pattern resists being seen, and what to do when the curriculum is hard.",
  },
  {
    n: "10",
    title: "Teaching Pattern Literacy to Others",
    desc:
      "How to share what you've learned — without proselytizing, without flattening the framework.",
  },
  {
    n: "11",
    title: "From Individual to Institutional",
    desc:
      "Reading patterns at the level of teams, organizations, and communities. Where this work becomes systemic.",
  },
  {
    n: "12",
    title: "The Larger Arc",
    desc:
      "Your life as a multi-decade spiral — what becomes visible when you zoom out.",
  },
  {
    n: "13",
    title: "The Research Behind This",
    desc:
      "An honest accounting of what's empirically established and what rests on wisdom-tradition convergence.",
  },
  {
    n: "14",
    title: "Building Your Practice",
    desc:
      "How to make pattern reading a sustainable lifelong skill, not a passing interest.",
  },
];

const READERS = [
  {
    title: "People with a pattern",
    body:
      "You can describe the loop precisely because you've lived it enough times to know its shape. Therapy helped with some things and not this. The repetition has been waiting for a different kind of language.",
  },
  {
    title: "Skeptics looking for rigor",
    body:
      "You're allergic to mysticism, self-help platitudes, and frameworks that fade. You want something with intellectual integrity that still works in your actual life. This book holds both.",
  },
  {
    title: "Practitioners and professionals",
    body:
      "Therapists, coaches, organizational consultants, educators, religious leaders — anyone whose work involves reading what's happening with another person, and who's looking for a framework that complements the one they already use.",
  },
  {
    title: "Readers of wisdom traditions",
    body:
      "You've read across Buddhism, Kabbalah, the I Ching, Hermetic philosophy, Ifá, scripture — and you've sensed they're describing the same underlying structure. This book makes that intuition precise.",
  },
];

export default function BookPage() {
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
      {/* Aurora blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "min(720px, 90vw)",
            height: "min(720px, 90vw)",
            top: "-20%",
            left: "-15%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.28), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "min(640px, 85vw)",
            height: "min(640px, 85vw)",
            bottom: "-10%",
            right: "-15%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.14), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* Top nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px clamp(20px, 5vw, 56px)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: T.fontMono,
            fontSize: "14px",
            letterSpacing: "1px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <span style={{ color: T.text }}>Twelvefold</span>{" "}
          <span style={{ color: T.accent }}>Institute</span>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(16px, 3vw, 32px)",
            fontFamily: T.fontMono,
            fontSize: "11px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          <Link
            href="/pattern-literacy"
            style={{ color: T.textDim, textDecoration: "none" }}
          >
            Framework
          </Link>
          <Link href="/read" style={{ color: T.textDim, textDecoration: "none" }}>
            Read
          </Link>
          <Link
            href="/certification"
            style={{ color: T.textDim, textDecoration: "none" }}
          >
            Certify
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(40px, 8vw, 100px) clamp(20px, 5vw, 56px) clamp(48px, 8vw, 100px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(36px, 6vw, 64px)",
          alignItems: "center",
        }}
      >
        <div
          className="book-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "clamp(36px, 6vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Hero text */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 14px",
                background: "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.22)",
                borderRadius: "999px",
                fontFamily: T.fontMono,
                fontSize: "10px",
                letterSpacing: "1.5px",
                color: T.accent,
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              A book by Emanuel Shidali
            </div>
            <h1
              style={{
                fontFamily: T.font,
                fontSize: "clamp(48px, 9vw, 84px)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: 0.95,
                letterSpacing: "-1.5px",
                margin: "0 0 24px",
                color: T.text,
              }}
            >
              Pattern
              <br />
              Literacy
            </h1>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "clamp(20px, 3vw, 26px)",
                color: T.textDim,
                lineHeight: 1.35,
                fontStyle: "italic",
                marginBottom: "32px",
                maxWidth: "520px",
              }}
            >
              How to Read the Intelligent Cycles Governing Your Life
            </div>
            <p
              style={{
                fontFamily: T.font,
                fontSize: "17px",
                lineHeight: 1.7,
                color: T.textDim,
                margin: "0 0 32px",
                maxWidth: "540px",
              }}
            >
              A grounded, practical introduction to recognizing the recurring curriculum
              running through your life — and learning to cooperate with it instead of
              fighting it, denying it, or repeating it unconsciously for another decade.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1px",
                color: T.textMuted,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  padding: "5px 12px",
                  background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.22)",
                  borderRadius: "999px",
                  color: T.gold,
                  fontWeight: 700,
                }}
              >
                ● Currently with publishers
              </span>
              <span>~365 pages</span>
              <span>14 chapters</span>
              <span>Hardcover &amp; eBook</span>
            </div>
          </div>

          {/* Designed cover (typographic placeholder until real cover lands) */}
          <BookCoverArt />
        </div>
      </section>

      {/* EXCERPT */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>From the introduction</Eyebrow>
        <blockquote
          style={{
            margin: "32px 0 0",
            padding: "0 0 0 clamp(20px, 3vw, 36px)",
            borderLeft: `3px solid ${T.gold}`,
            fontFamily: T.font,
            fontSize: "clamp(18px, 2.6vw, 22px)",
            lineHeight: 1.7,
            color: T.text,
          }}
        >
          <p style={{ margin: "0 0 22px", fontStyle: "italic" }}>
            You are holding this book because something has already been happening.
          </p>
          <p style={{ margin: "0 0 22px", color: T.textDim, fontSize: "0.92em" }}>
            A relationship that ended the same way the last one did. A career that keeps
            hitting the same ceiling. An emotional pattern you can describe precisely
            because you've lived it enough times to know its shape. A recurring sense that
            your life is asking you something and you haven't been able to hear the
            question clearly.
          </p>
          <p style={{ margin: "0 0 22px", color: T.textDim, fontSize: "0.92em" }}>
            Something has been repeating. You know it. You may not have words for it yet,
            but you know it.
          </p>
          <p style={{ margin: "0 0 22px", color: T.textDim, fontSize: "0.92em" }}>
            That knowing is not the problem. The problem is that the knowing hasn't had
            anywhere useful to go. The therapy has helped with some things and not others.
            The self-help books gave you frameworks that faded. The conversations with
            people who love you haven't broken the cycle. The pattern keeps recurring with
            a consistency that tells you something is happening beneath the explanations
            you've been given.
          </p>
          <p style={{ margin: 0, fontStyle: "italic" }}>This book is for that something.</p>
        </blockquote>
      </section>

      {/* WHAT THIS BOOK IS */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 880,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>What this book is</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "20px 0 36px",
            color: T.text,
          }}
        >
          Your life is not random. <em style={{ color: T.gold }}>It is curriculum.</em>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            fontFamily: T.font,
            fontSize: "17px",
            lineHeight: 1.75,
            color: T.textDim,
          }}
        >
          <p style={{ margin: 0 }}>
            Pattern literacy is the ability to read the intelligent cycles governing human
            life — not in the metaphorical sense, but in the practical one. The same way
            you can read a map and use it to navigate, or read a weather system and use it
            to plan, pattern literacy lets you read the recurring structures of your life
            and use what you see.
          </p>
          <p style={{ margin: 0 }}>
            The patterns showing up in your experience aren't evidence that something is
            wrong with you, or that you're cursed, or that you lack the discipline others
            seem to have. They are recurring teaching cycles — structured, purposeful,
            containing within them exactly the understanding you need to develop next.
          </p>
          <p style={{ margin: 0 }}>
            When a pattern keeps recurring, it isn't punishment. It's persistence. The
            curriculum is insisting. The teaching is waiting. And it will continue to wait
            — appearing in your relationships, your work, your health, your finances, your
            sense of yourself — until you receive it. When you receive it, the pattern
            transforms.
          </p>
          <p style={{ margin: 0, color: T.text, fontStyle: "italic" }}>
            That is the foundational claim. Everything else in this book is an elaboration
            of it.
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>Who this is for</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "20px 0 40px",
            color: T.text,
          }}
        >
          Four kinds of readers, one book.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {READERS.map((r) => (
            <div
              key={r.title}
              style={{
                padding: "28px 28px",
                background: T.cardBg,
                border: `1px solid ${T.border}`,
                borderRadius: "14px",
                borderTop: `2px solid ${T.accent}`,
              }}
            >
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: T.accent,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  fontWeight: 700,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "15.5px",
                  lineHeight: 1.6,
                  color: T.textDim,
                }}
              >
                {r.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>The structure</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "20px 0 40px",
            color: T.text,
          }}
        >
          Fourteen chapters, four sections.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1px",
            background: T.border,
            border: `1px solid ${T.border}`,
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {CHAPTERS.map((c) => (
            <div
              key={c.n}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr",
                gap: "clamp(16px, 3vw, 28px)",
                padding: "22px clamp(20px, 3vw, 28px)",
                background: T.bg,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "13px",
                  color: T.gold,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  paddingTop: "4px",
                }}
              >
                {c.n}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: T.font,
                    fontSize: "clamp(17px, 2.2vw, 20px)",
                    fontWeight: 600,
                    color: T.text,
                    marginBottom: "6px",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontFamily: T.font,
                    fontSize: "15px",
                    color: T.textDim,
                    lineHeight: 1.55,
                  }}
                >
                  {c.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "24px",
            fontFamily: T.fontMono,
            fontSize: "11px",
            color: T.textMuted,
            letterSpacing: "0.5px",
            textAlign: "center",
          }}
        >
          Plus an introduction, seven appendices, and a complete glossary. ~100,000 words.
        </div>
      </section>

      {/* ABOUT THE AUTHOR */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 880,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>About the author</Eyebrow>
        <h2
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: "20px 0 32px",
            color: T.text,
          }}
        >
          Emanuel Shidali
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
            fontFamily: T.font,
            fontSize: "17px",
            lineHeight: 1.75,
            color: T.textDim,
          }}
        >
          <p style={{ margin: 0 }}>
            Emanuel Shidali is the founder of Twelvefold Institute and the creator of
            PatternOS, an AI-powered pattern reading application. The pattern literacy
            framework emerged from his study of the wisdom traditions that inform it —
            Ifá, Kabbalah, the I Ching, world scripture, Buddhism, and Hermetic philosophy
            — alongside years of work observing how systematically people repeat cycles
            without the language to read them.
          </p>
          <p style={{ margin: 0 }}>
            The discovery that six independent traditions had each recognized the same
            archetypal qualities of transformation — and that the Western zodiacal
            structure organized those qualities into a usable map — became the foundation
            of <em>Pattern Literacy</em>.
          </p>
          <p style={{ margin: 0 }}>
            He continues to do his own pattern work daily, teaches the certification
            program himself, and serves practitioners and institutions worldwide.
          </p>
        </div>
      </section>

      {/* SUBSCRIBE FORM */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <BookSubscribeForm />
      </section>

      {/* RELATED */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px)",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Eyebrow>Continue reading</Eyebrow>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          <RelatedDoor
            label="Framework"
            title="What pattern literacy is"
            desc="The long-form introduction to the framework, written for the web."
            href="/pattern-literacy"
          />
          <RelatedDoor
            label="Read"
            title="Try a pattern reading"
            desc="Describe a recurring situation. Get a three-layer reading. Free."
            href="/read"
          />
          <RelatedDoor
            label="Certify"
            title="Practitioner certification"
            desc="The 200-hour training for people who want to read patterns for others."
            href="/certification"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "60px clamp(20px, 5vw, 56px) 80px",
          borderTop: `1px solid ${T.border}`,
          marginTop: "40px",
          textAlign: "center",
          fontFamily: T.fontMono,
          fontSize: "11px",
          letterSpacing: "1px",
          color: T.textMuted,
        }}
      >
        <Link
          href="/"
          style={{ color: T.text, textDecoration: "none", fontWeight: 700, fontSize: "13px" }}
        >
          Twelvefold <span style={{ color: T.accent }}>Institute</span>
        </Link>
        <div style={{ marginTop: "10px" }}>Pattern literacy · for the long arc</div>
      </footer>

      {/* Responsive grid breakdown on narrow screens */}
      <style>{`
        @media (max-width: 760px) {
          .book-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "2px",
        color: T.accent,
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function BookCoverArt() {
  // Typographic book cover — designed in-brand. When the real cover is
  // ready from your designer, swap this component for an <Image /> of it.
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "2/3",
        maxWidth: 360,
        width: "100%",
        margin: "0 auto",
        background: "linear-gradient(155deg, #0c0c1a 0%, #06060F 60%, #0a0816 100%)",
        border: "1px solid rgba(167,139,250,0.20)",
        borderRadius: "6px",
        boxShadow:
          "0 30px 70px rgba(0,0,0,0.55), 0 4px 18px rgba(124,58,237,0.12), inset 0 0 80px rgba(167,139,250,0.04)",
        padding: "clamp(28px, 6%, 44px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: "rotate(-2deg)",
      }}
    >
      {/* Top mark */}
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "9px",
          letterSpacing: "3px",
          color: T.gold,
          textTransform: "uppercase",
          fontWeight: 700,
          textAlign: "center",
          opacity: 0.9,
        }}
      >
        Twelvefold Institute
      </div>

      {/* Center title block */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "32px",
            height: "1px",
            background: T.gold,
            margin: "0 auto 24px",
          }}
        />
        <div
          style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 40px)",
            fontStyle: "italic",
            fontWeight: 600,
            color: T.text,
            letterSpacing: "-0.8px",
            lineHeight: 0.95,
            marginBottom: "16px",
          }}
        >
          Pattern
          <br />
          Literacy
        </div>
        <div
          style={{
            fontFamily: T.font,
            fontSize: "clamp(11px, 1.5vw, 13px)",
            fontStyle: "italic",
            color: T.textDim,
            lineHeight: 1.4,
            padding: "0 8%",
          }}
        >
          How to Read the Intelligent Cycles Governing Your Life
        </div>
        <div
          style={{
            width: "32px",
            height: "1px",
            background: T.gold,
            margin: "24px auto 0",
          }}
        />
      </div>

      {/* Author */}
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "10px",
          letterSpacing: "2px",
          color: T.textDim,
          textTransform: "uppercase",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Emanuel Shidali
      </div>
    </div>
  );
}

function RelatedDoor({
  label,
  title,
  desc,
  href,
}: {
  label: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "24px 26px",
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: "14px",
        textDecoration: "none",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "10px",
          letterSpacing: "1.5px",
          color: T.accent,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "18px",
          fontWeight: 600,
          color: T.text,
          marginBottom: "6px",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "14px",
          color: T.textDim,
          lineHeight: 1.55,
        }}
      >
        {desc}
      </div>
    </Link>
  );
}
