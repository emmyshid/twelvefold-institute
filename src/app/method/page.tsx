import type { Metadata } from "next";
import Link from "next/link";

// ════════════════════════════════════════════════════════════════
// /method — Sources & Method.
//
// The credibility page. The Twelvefold framework makes a substantial
// claim — that six wisdom traditions independently recognized similar
// archetypal patterns of human transformation, and that those patterns
// can be organized into a usable 12-phase map. That claim deserves
// careful epistemic accounting.
//
// This page answers, for skeptics, scholars, and institutional buyers:
//   • What the framework inherits  — the lineages we draw from
//   • What the framework interprets — our translations and choices
//   • What the framework contributes — what's actually original
//   • Where the traditions agree   — the convergence claim, named
//   • Where the traditions differ  — the honest disclaimers
//   • What we do NOT claim         — limits of the work
// ════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Sources & Method | Twelvefold Institute",
  description:
    "An honest accounting of where the Twelvefold framework comes from, what it inherits, what it contributes, and what it does not claim.",
};

const T = {
  bg: "#06060F",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.65)",
  textMuted: "rgba(237,233,245,0.42)",
  border: "rgba(255,255,255,0.08)",
  cardBg: "rgba(255,255,255,0.025)",
  accent: "#A78BFA",
  accentDeep: "#7C3AED",
  gold: "#FBBF24",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

interface SectionProps {
  eyebrow: string;
  title: string;
  intro?: string;
  body: React.ReactNode;
  accent?: string;
}

function Section({ eyebrow, title, intro, body, accent = T.accent }: SectionProps) {
  return (
    <section
      style={{
        padding: "clamp(36px, 6vw, 64px) 0",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "10px",
          letterSpacing: "2.5px",
          color: accent,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "14px",
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: T.font,
          fontSize: "clamp(28px, 4.5vw, 40px)",
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
          margin: "0 0 22px",
          color: T.text,
        }}
      >
        {title}
      </h2>
      {intro && (
        <p
          style={{
            fontFamily: T.font,
            fontSize: "clamp(17px, 2.4vw, 19px)",
            lineHeight: 1.65,
            color: T.textDim,
            marginBottom: "26px",
            maxWidth: 720,
          }}
        >
          {intro}
        </p>
      )}
      <div
        style={{
          fontFamily: T.font,
          fontSize: "16px",
          lineHeight: 1.75,
          color: T.textDim,
        }}
      >
        {body}
      </div>
    </section>
  );
}

function Bullet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li
      style={{
        marginBottom: "14px",
        lineHeight: 1.7,
        paddingLeft: "8px",
      }}
    >
      <strong style={{ color: T.text, fontWeight: 600 }}>{label}.</strong>{" "}
      {children}
    </li>
  );
}

export default function MethodPage() {
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
      {/* Aurora */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: "min(640px, 90vw)",
          height: "min(640px, 90vw)",
          top: -160,
          left: -140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)",
          filter: "blur(110px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: "min(500px, 85vw)",
          height: "min(500px, 85vw)",
          bottom: -120,
          right: -120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.10), transparent 70%)",
          filter: "blur(110px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 880,
          margin: "0 auto",
          padding:
            "clamp(28px, 5vw, 50px) clamp(20px, 5vw, 56px) clamp(80px, 12vw, 120px)",
        }}
      >
        {/* Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "clamp(48px, 8vw, 80px)",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: T.fontMono,
              fontSize: "15px",
              letterSpacing: "1px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span style={{ color: T.text }}>Twelvefold</span>{" "}
            <span style={{ color: T.accent }}>Institute</span>
          </Link>
          <Link
            href="/"
            style={{
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: T.textMuted,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← Home
          </Link>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: "clamp(28px, 5vw, 50px)" }}>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "2.5px",
              color: T.gold,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            ● Sources &amp; Method
          </div>
          <h1
            style={{
              fontFamily: T.font,
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              margin: "0 0 26px",
              maxWidth: 720,
            }}
          >
            Where this comes from. What we claim. What we don&rsquo;t.
          </h1>
          <p
            style={{
              fontSize: "clamp(17px, 2.5vw, 21px)",
              lineHeight: 1.6,
              color: T.textDim,
              maxWidth: 660,
              marginBottom: "20px",
              fontStyle: "italic",
            }}
          >
            The Twelvefold framework makes a strong claim — that six wisdom
            traditions, working independently across millennia, recognized the
            same shape of human transformation. A claim that strong deserves
            careful accounting.
          </p>
          <p
            style={{
              fontSize: "16.5px",
              lineHeight: 1.7,
              color: T.textDim,
              maxWidth: 620,
            }}
          >
            This page is that accounting. What we inherit, what we interpret,
            what we add, where the traditions agree and differ — and what we
            explicitly do not claim. Read by skeptics, scholars, and serious
            buyers who want to know whether the work holds.
          </p>
        </div>

        <Section
          eyebrow="01 · Inheritance"
          title="What the framework inherits"
          intro="The Twelvefold framework does not invent its underlying shape. Several elements are inherited directly from older traditions, named here so credit is clear."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="The 12-phase structure">
                Drawn from the Western zodiacal-astronomical tradition — twelve
                lunar cycles per solar year, a structure recognized by Babylonian,
                Hellenistic, Indian, and later European astronomical lineages.
                The names (Aries, Taurus, etc.) are used here as borrowed labels
                for the archetypal qualities, not as claims about planetary
                influence on individuals.
              </Bullet>
              <Bullet label="Pattern as curriculum">
                A philosophical orientation found across humanistic psychology
                (Jung, Hillman), contemplative traditions (Buddhist
                Pratītyasamutpāda, Christian discernment), and Indigenous
                cosmologies — the idea that recurring difficulty teaches.
              </Bullet>
              <Bullet label="Cyclical time and phase wisdom">
                The recognition that human experience moves in cycles, that
                phases have characteristic challenges, and that wisdom involves
                cooperating with these rhythms — found in Ifá, Kabbalistic
                cosmology, the I Ching, Vedic and Buddhist time-theory,
                Hermetic philosophy, and biblical literature (Ecclesiastes
                being one Western example).
              </Bullet>
              <Bullet label="Phase-specific teachings">
                The substantive content of each phase&rsquo;s curriculum draws
                on the wisdom of the six traditions named below — not as a
                synthesis that flattens them, but as parallel illuminations of
                the same underlying territory.
              </Bullet>
            </ul>
          }
        />

        <Section
          eyebrow="02 · Interpretation"
          title="What the framework interprets"
          intro="Between inheritance and contribution sits interpretation — the choices we made about how to present, organize, and translate the source material for contemporary use."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="Cross-traditional convergence">
                We organize the six traditions&rsquo; phase-recognition into a
                single 12-phase map. This is an interpretive move: the
                traditions do not themselves agree that they map to twelve
                phases (I Ching has 64 hexagrams, Kabbalah has ten Sefirot, and
                so on). What they agree on is the existence of structured,
                phased human transformation. The twelvefold map is our
                organizing scheme.
              </Bullet>
              <Bullet label="Neutral observable language">
                Each phase is given a felt-experience name (Ignition, Foundation,
                Inner Root, etc.) that doesn&rsquo;t require religious
                vocabulary. This translation choice makes the work accessible to
                skeptics without flattening the source traditions, which we
                cite alongside in their original framing.
              </Bullet>
              <Bullet label="Pattern Names">
                Each of the 48 micro-states (12 phases × 4 micro-states) has a
                human-readable Pattern Name — &ldquo;The Boredom Test,&rdquo;
                &ldquo;Hidden Preparation,&rdquo; &ldquo;The Compromise
                Wall.&rdquo; These names are our compositions, drawing on
                language from the traditions and clinical observation, designed
                to make the felt shape of each state recognizable.
              </Bullet>
              <Bullet label="The four micro-states">
                The progression Initiation → Expansion → Contraction →
                Integration is our distillation of phase-internal dynamics
                widely observed across traditions (e.g., Buddhist arising
                /enduring/decay/release, the I Ching&rsquo;s changing-line
                logic, the Hermetic rhythm of any process). Naming them as
                a four-fold sequence is our contribution.
              </Bullet>
            </ul>
          }
        />

        <Section
          eyebrow="03 · Contribution"
          title="What the framework contributes"
          intro="Setting aside what we inherit and interpret, here is what is genuinely original to Twelvefold."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="The 12 × 4 = 48 state system">
                The combination of twelve phases and four micro-states yielding
                forty-eight named pattern states is our organizing structure.
                We are not aware of an exact precedent for this combination.
              </Bullet>
              <Bullet label="The Pattern Name Library">
                Forty-eight felt-experience names mapping to the 48 states.
                Each is composed to be recognizable to a contemporary reader
                describing a situation in plain language.
              </Bullet>
              <Bullet label="Pattern Literacy as a teachable practice">
                The framing of pattern recognition not as a gift, a mystical
                attainment, or a clinical skill — but as a literacy: a
                competence that can be taught, practiced, and certified.
              </Bullet>
              <Bullet label="The reading protocol">
                A six-layer structure for delivering a pattern reading
                (Pattern Summary, Recognition, Teaching, Alignment,
                Participation, Six Traditions) developed by the Institute and
                used both by AI-assisted tools and by certified practitioners.
              </Bullet>
              <Bullet label="Practitioner certification">
                A 200-hour curriculum for training practitioners who can
                deliver pattern readings to clients with rigor, ethical
                boundaries, and care for the source traditions.
              </Bullet>
            </ul>
          }
        />

        <Section
          eyebrow="04 · Agreement"
          title="Where the traditions agree"
          accent={T.gold}
          intro="The convergence claim. These are the points on which six independent traditions, working without contact across continents and millennia, reach substantively similar conclusions."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="Reality is structured, not random">
                Human experience moves in patterns that can be recognized,
                named, and worked with. This is asserted in Ifá&rsquo;s
                odu-divination, Kabbalah&rsquo;s emanation-of-being, the I
                Ching&rsquo;s hexagram-changes, Buddhist dependent-arising,
                Hermetic correspondence, and biblical pattern (Solomon&rsquo;s
                prayer for wisdom to discern, Ecclesiastes&rsquo; &ldquo;a time
                for everything&rdquo;).
              </Bullet>
              <Bullet label="Patterns have phases with distinct teachings">
                Each phase of a cycle carries its own particular curriculum.
                The phase of beginning is not the phase of building, which is
                not the phase of dissolution. Each requires its own
                participation. Ifá&rsquo;s odu specify situation and right
                response. The I Ching&rsquo;s hexagrams specify a stance.
                Buddhist phase-doctrines specify a discipline.
              </Bullet>
              <Bullet label="Cooperation yields wisdom; resistance prolongs suffering">
                The traditions agree that the work is to align with what the
                phase asks, not to override it. This is named differently:
                <em> wu-wei</em> in Taoism (which infused the I Ching),
                <em> tawakkul</em> in some Islamic and Hermetic-influenced
                traditions, <em>khanti</em> in Buddhism, <em>shamatha</em> in
                Buddhist practice, surrender in Christian contemplation.
              </Bullet>
              <Bullet label="The cycle is intelligent">
                The traditions agree, in their respective vocabularies, that
                the structure of reality is wise — that what arrives, arrives
                meaningfully. The Twelvefold framework calls this curriculum.
              </Bullet>
            </ul>
          }
        />

        <Section
          eyebrow="05 · Difference"
          title="Where the traditions differ"
          intro="Convergence is real; identity is not. The traditions agree on the underlying structure but differ substantially on cosmology, vocabulary, and practical application. The Twelvefold framework does not flatten these differences."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="Cosmological framings">
                Ifá&rsquo;s Olódùmarè-and-orisha cosmology is theistic and
                ancestor-relational. Buddhism is non-theistic and
                ancestor-distant. Kabbalah is monotheistic with emanation.
                Hermetic philosophy is pantheistic in a strict sense. These are
                not interchangeable cosmologies.
              </Bullet>
              <Bullet label="Number and shape of phases">
                Ifá: 256 odu. I Ching: 64 hexagrams. Kabbalah: 10 Sefirot.
                Buddhism: 12 Nidānas, but also many other phase-schemes
                (Bardos, Paramis). The Twelvefold framework&rsquo;s twelve
                phases is the zodiacal organizing scheme, not the traditions&rsquo;
                native count.
              </Bullet>
              <Bullet label="Practice and ritual">
                Each tradition has its own technologies — divination,
                meditation, prayer, ceremony, contemplation, study. These are
                not optional decorations on a shared truth; they are how each
                tradition actually transmits its work. We do not teach the
                traditions&rsquo; practices. We honor them as alive elsewhere.
              </Bullet>
              <Bullet label="Soteriology and ultimate aim">
                The traditions differ on what cooperation with the cycle is
                ultimately for. Liberation from rebirth (Buddhism). Communion
                with the source (Kabbalah, Christian contemplation). Right
                living within a relational cosmos (Ifá). Knowledge of self as
                cosmos (Hermetic). These are not synonyms. The Twelvefold
                framework does not adjudicate.
              </Bullet>
            </ul>
          }
        />

        <Section
          eyebrow="06 · Limits"
          title="What the Institute does NOT claim"
          accent="#FF8B8B"
          intro="Explicit non-claims, written so they cannot be misread."
          body={
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <Bullet label="We do not claim astrology is predictive">
                The twelve phases use zodiacal names as borrowed labels for
                archetypal qualities. We make no claim that planetary positions
                cause or predict outcomes in individual lives.
              </Bullet>
              <Bullet label="We do not claim the traditions are equivalent">
                The convergence we point to is structural, not theological.
                Ifá, Kabbalah, the I Ching, Christian and Hebrew scripture,
                Buddhism, and Hermetic philosophy are not different names for
                the same religion. They are different lineages that recognized
                similar structural patterns of human transformation.
              </Bullet>
              <Bullet label="We do not claim originality of the underlying patterns">
                The patterns the framework names are recognized across
                traditions. We did not discover them. We organize them.
              </Bullet>
              <Bullet label="We do not claim completeness">
                Forty-eight states are a usable map, not an exhaustive
                inventory of human experience. The framework will be revised.
                The current version is openly numbered.
              </Bullet>
              <Bullet label="We do not provide therapy, medical care, diagnosis, or financial advice">
                Pattern Literacy is an educational and reflective framework. It
                is not a substitute for professional mental health care,
                medical treatment, legal counsel, or financial advice. Anyone
                in acute distress should contact a licensed professional.
              </Bullet>
              <Bullet label="We do not claim the framework is faith-required">
                The framework can be practiced by skeptics, religious
                practitioners, atheists, and agnostics. It does not ask the
                reader to believe in spirits, gods, planetary influence, karma,
                or any specific cosmology. It asks only that they observe
                whether the named patterns recur in their actual life.
              </Bullet>
            </ul>
          }
        />

        {/* Closing CTA */}
        <section
          style={{
            marginTop: "clamp(40px, 7vw, 80px)",
            padding: "32px",
            background: T.cardBg,
            border: `1px solid ${T.border}`,
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: T.font,
              fontSize: "17px",
              fontStyle: "italic",
              color: T.textDim,
              lineHeight: 1.65,
              marginBottom: "20px",
              maxWidth: 580,
              margin: "0 auto 22px",
            }}
          >
            We&rsquo;d rather lose a reader who needs certainty than offer one
            we can&rsquo;t deliver. If you&rsquo;ve read this far, you&rsquo;re
            the kind of reader we built for.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/pattern-literacy"
              style={{
                padding: "13px 26px",
                background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "999px",
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1px",
                fontWeight: 700,
                textTransform: "uppercase",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Read the framework
            </Link>
            <Link
              href="/certification"
              style={{
                padding: "13px 26px",
                background: "transparent",
                color: T.text,
                textDecoration: "none",
                borderRadius: "999px",
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1px",
                fontWeight: 700,
                textTransform: "uppercase",
                border: `1px solid ${T.border}`,
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              See the certification
            </Link>
          </div>
        </section>

        {/* Site-wide disclaimer */}
        <p
          style={{
            marginTop: "72px",
            textAlign: "center",
            fontFamily: T.fontMono,
            fontSize: "11px",
            color: T.textMuted,
            lineHeight: 1.6,
            letterSpacing: "0.3px",
          }}
        >
          Pattern Literacy is an educational and reflective framework. It is
          not therapy, medical care, diagnosis, financial advice, or a
          substitute for professional support.
        </p>
      </div>
    </div>
  );
}
