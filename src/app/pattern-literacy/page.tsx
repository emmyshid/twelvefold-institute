"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

const T = {
  bg: "#06060F", bgCard: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5", textDim: "rgba(237,233,245,0.6)", textMuted: "rgba(237,233,245,0.34)",
  accent: "#A78BFA", accentDark: "#7C3AED", gold: "#FBBF24",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  radius: "18px", radiusSm: "11px",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
};

const PHASES = [
  ["Aries", "Sparking", "Ignition"], ["Taurus", "Building", "Foundation"],
  ["Gemini", "Learning", "Intelligence"], ["Cancer", "Feeling", "Inner Root"],
  ["Leo", "Expressing", "Authority"], ["Virgo", "Refining", "Correction"],
  ["Libra", "Relating", "Balance"], ["Scorpio", "Transforming", "Transformation"],
  ["Sagittarius", "Reaching", "Expansion"], ["Capricorn", "Constructing", "Structure"],
  ["Aquarius", "Liberating", "Liberation"], ["Pisces", "Dissolving", "Dissolution"],
];

const MICROSTATES = [
  ["Initiation", "How a phase begins. The opening, the spark, the first move."],
  ["Expansion", "How a phase builds. Energy accumulates, the shape takes form."],
  ["Contraction", "How a phase peaks and meets its limit. Pressure builds, definition sharpens."],
  ["Integration", "How a phase resolves. The lesson lands and prepares the next opening."],
];

const TRADITIONS = [
  ["Ifá", "A Yoruba system of wisdom mapping life's forces, turning points, and the intelligence inside circumstance."],
  ["Kabbalah", "A Jewish mystical tradition charting how the unseen takes form — and how form returns to source."],
  ["I Ching", "The Chinese Book of Changes. Sixty-four hexagrams describing the moving structure of any moment."],
  ["Scripture", "Wisdom literature on covenant, exile, return, renewal. The arc of any life writ at human scale."],
  ["Buddhism", "Teachings on impermanence and the arising and passing of states — the texture of phase shifts themselves."],
  ["Hermetic", "Western esoteric philosophy on cycles, polarity, and correspondence. As above, so below."],
];

type Variant = "primary" | "gold" | "ghost";

function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.8s ${T.ease} ${delay}s, transform 0.8s ${T.ease} ${delay}s`, ...style }}>{children}</div>;
}

function Starfield() {
  const stars = useMemo(() => Array.from({ length: 40 }, () => ({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1.6 + 0.6, delay: Math.random() * 6, dur: Math.random() * 4 + 4, op: Math.random() * 0.4 + 0.2 })), []);
  return <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>{stars.map((s, i) => <span key={i} className="pi-star" style={{ position: "absolute", top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, borderRadius: "50%", background: i % 7 === 0 ? T.gold : "#fff", opacity: s.op, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />)}</div>;
}

function Btn({ children, variant = "primary", onClick, href, style }: { children: ReactNode; variant?: Variant; onClick?: () => void; href?: string; style?: CSSProperties }) {
  const variants: Record<Variant, { background: string; color: string; border: string; glow: string }> = {
    primary: { background: T.grad, color: "#fff", border: "none", glow: "rgba(124,58,237,0.4)" },
    gold: { background: T.gradGold, color: "#1a1206", border: "none", glow: "rgba(251,191,36,0.35)" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}`, glow: "rgba(167,139,250,0.25)" },
  };
  const v = variants[variant];
  const handleClick = () => {
    if (onClick) return onClick();
    if (!href) return;
    if (href.startsWith("#")) { const el = document.getElementById(href.slice(1)); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else window.location.href = href;
  };
  return <button onClick={handleClick} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", transition: `transform 0.3s ${T.ease}, box-shadow 0.3s ${T.ease}`, background: v.background, color: v.color, border: v.border, ...style }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${v.glow}`; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>{children}</button>;
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.accent, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />{children}</div>;
}

export default function PatternLiteracyPage() {
  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pi-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        .pi-star { animation: pi-twinkle ease-in-out infinite; }
        .pi-card { transition: transform 0.35s ${T.ease}, border-color 0.35s ${T.ease}, box-shadow 0.35s ${T.ease}; }
        .pi-card:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.35); box-shadow: 0 16px 44px rgba(0,0,0,0.45); }
      `}</style>
      <Starfield />

      <div style={{ position: "relative", zIndex: 3 }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px clamp(20px, 5vw, 64px)", gap: "16px", background: "rgba(6,6,15,0.78)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: `1px solid ${T.border}` }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span>
          </a>
          <Btn variant="ghost" href="/" style={{ padding: "10px 18px" }}>← Back to home</Btn>
        </nav>

        {/* Hero */}
        <header style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(24px, 4vw, 40px)", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>What it is</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-1px" }}>Pattern literacy<br />is a skill.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: T.font, fontSize: "clamp(18px, 2.5vw, 22px)", color: T.textDim, maxWidth: 660, margin: "24px auto 0", lineHeight: 1.6 }}>
              The ability to recognize the intelligent cycles governing human life and act with clarity, alignment, and purpose. Like literacy itself — once you have it, you cannot un-see what is written everywhere around you.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
              <Btn variant="gold" href="/#try-it">Try a free reading</Btn>
              <Btn variant="ghost" href="/certification">See the certification</Btn>
            </div>
          </Reveal>
        </header>

        {/* The premise */}
        <section style={{ padding: "clamp(50px, 8vw, 100px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The premise</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px", marginBottom: "32px" }}>Your life is patterned. The question is whether you can read it.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.text, lineHeight: 1.75 }}>
                The same situations keep returning — in work, in love, in who you become under pressure. Most frameworks treat this as something to fix: a flaw to overcome, a wound to heal, a mindset to upgrade. We treat it as <strong style={{ color: T.gold, fontStyle: "italic" }}>curriculum</strong>.
              </p>
              <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, lineHeight: 1.75 }}>
                A pattern is not pathology. It is a recurring cycle of learning that intelligence — life, time, whatever you want to call the thing that moves the seasons — presents through your circumstances. The pattern repeats because the lesson has not yet been received. When it is, the pattern resolves and the next one opens.
              </p>
              <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, lineHeight: 1.75 }}>
                Pattern literacy is what lets you recognize the pattern, name the lesson, and cooperate with the curriculum instead of fighting it. It is not faith. It is structure — and it can be taught.
              </p>
            </div>
          </Reveal>
        </section>

        {/* The 12 phases */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1100, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The structure (1 of 2)</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Twelve phases.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.2vw, 18px)", color: T.textDim, maxWidth: 620, margin: "16px auto 0", lineHeight: 1.65 }}>
              One for each lunar cycle the solar year contains. Twelve chapters of curriculum, repeated across every life, every relationship, every project. Each phase carries its own work — what it asks of you, what it reveals, what it requires you to release.
            </p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {PHASES.map(([z, felt, label], i) => (
              <Reveal key={z} delay={(i % 6) * 0.05}>
                <div className="pi-card" style={{ padding: "16px 18px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: T.textMuted, textTransform: "uppercase" }}>{String(i + 1).padStart(2, "0")} · {z}</div>
                  <div style={{ fontFamily: T.font, fontSize: "22px", fontStyle: "italic", color: T.text, margin: "4px 0" }}>{felt}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.accent }}>{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The 4 micro-states */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1000, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The structure (2 of 2)</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Four micro-states.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.2vw, 18px)", color: T.textDim, maxWidth: 620, margin: "16px auto 0", lineHeight: 1.65 }}>
              Within each phase, four states describe where you are within it. Twelve phases × four micro-states = <strong style={{ color: T.gold }}>forty-eight distinct pattern states</strong>. This is the framework's specific contribution to the inherited structure.
            </p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {MICROSTATES.map(([name, desc], i) => (
              <Reveal key={name} delay={i * 0.08}>
                <div className="pi-card" style={{ padding: "22px 24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, borderLeft: `3px solid ${[T.accent, T.gold, T.accentDark, T.accent][i]}` }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.gold, textTransform: "uppercase", marginBottom: "8px" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontFamily: T.font, fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>{name}</div>
                  <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The 6 traditions */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The traditions</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Six lineages. One structure.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.2vw, 18px)", color: T.textDim, maxWidth: 640, margin: "16px auto 0", lineHeight: 1.65 }}>
              Working independently across continents and centuries, these traditions arrived at the same shape of transformation. The framework draws from each with respect, asks you to adopt none, and never flattens any of them.
            </p>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {TRADITIONS.map(([name, desc], i) => (
              <Reveal key={name} delay={(i % 3) * 0.07}>
                <div className="pi-card" style={{ padding: "24px 26px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <h3 style={{ fontFamily: T.font, fontSize: "24px", fontWeight: 600, marginBottom: "10px" }}>{name}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Who learns it</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>For people who want to see clearly.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                ["Therapists, coaches, consultants", "who want a framework that holds across traditions without colonizing any."],
                ["Founders, leaders, builders", "who keep hitting the same wall and want to understand which phase they are actually in."],
                ["Seekers and lay practitioners", "who are serious about the work and tired of frameworks that promise transformation without structure."],
                ["Skeptics and analysts", "who need observable cycles, falsifiable claims, and intellectually honest sourcing."],
              ].map(([who, why], i) => (
                <Reveal key={who} delay={i * 0.06}>
                  <div style={{ padding: "20px 24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm }}>
                    <div style={{ fontFamily: T.font, fontSize: "18px", fontWeight: 600, color: T.text, marginBottom: "4px" }}>{who}</div>
                    <div style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6 }}>{why}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(40px, 7vw, 90px) clamp(20px, 5vw, 64px)", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 600, letterSpacing: "-0.5px", marginBottom: "16px" }}>Two ways to begin.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.3vw, 19px)", color: T.textDim, lineHeight: 1.6, marginBottom: "30px" }}>
              Read one of your own patterns now — free, no account needed. Or commit to the full path and become Twelvefold-certified.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="gold" href="/#try-it">Read my pattern</Btn>
              <Btn variant="primary" href="/certification">See certification</Btn>
            </div>
          </Reveal>
        </section>

        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></a>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <a href="/certification" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Certification</a>
            <a href="/institutions" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Institutions</a>
            <a href="/about" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>About</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
