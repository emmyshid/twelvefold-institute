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

function Btn({ children, variant = "primary", href, style }: { children: ReactNode; variant?: Variant; href?: string; style?: CSSProperties }) {
  const variants: Record<Variant, { background: string; color: string; border: string }> = {
    primary: { background: T.grad, color: "#fff", border: "none" },
    gold: { background: T.gradGold, color: "#1a1206", border: "none" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
  };
  const v = variants[variant];
  return <button onClick={() => { if (href) window.location.href = href; }} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", background: v.background, color: v.color, border: v.border, ...style }}>{children}</button>;
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.accent, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />{children}</div>;
}

export default function AboutPage() {
  const antiGoals = [
    ["We will not commodify spirituality.", "The wisdom traditions we draw from are not products. We translate them into a framework you can use without flattening what they are."],
    ["We will not be acquired or venture-backed.", "Independence is structural. We fund the institute through its own work — certification, licensing, books, research — and answer only to the standard of the work itself."],
    ["We will not appropriate the traditions.", "Six lineages contribute to the framework. None of them are ours to claim. We use them with respect, with credit, and never as decoration."],
    ["We will not promise what cannot be delivered.", "Pattern literacy is a skill, not a transformation. It takes years to develop. We say that out loud and design every offering accordingly."],
  ];

  const principles = [
    ["Authority before audience", "The work earns its standing through quality, not marketing. We build the framework, document it, teach it well — and let people find us when the work is ready to find them."],
    ["Long-form over metrics", "Books, essays, case studies, certified practitioners. The institute's reputation is built in writing and in graduates, not in followers or growth charts."],
    ["Funded by its own work", "Five revenue streams — certification, institutional licensing, research, community membership, and publishing — keep the institute independent and aligned with what it teaches."],
    ["Held to standard", "Every claim is sourced. Every promise is bounded. Every offering is what it says it is."],
  ];

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pi-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        .pi-star { animation: pi-twinkle ease-in-out infinite; }
      `}</style>
      <Starfield />

      <div style={{ position: "relative", zIndex: 3 }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px clamp(20px, 5vw, 64px)", gap: "16px", background: "rgba(6,6,15,0.78)", backdropFilter: "blur(18px)", borderBottom: `1px solid ${T.border}` }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span>
          </a>
          <Btn variant="ghost" href="/" style={{ padding: "10px 18px" }}>← Back to home</Btn>
        </nav>

        {/* Hero */}
        <header style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(24px, 4vw, 40px)", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The institute</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(38px, 6.5vw, 64px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-1px" }}>Independent<br />by design.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: T.font, fontSize: "clamp(19px, 2.6vw, 24px)", color: T.accent, fontStyle: "italic", lineHeight: 1.5, marginTop: "24px", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
              Twelvefold Institute teaches pattern literacy — the ability to read the intelligent cycles governing human life and act with clarity, alignment, and purpose.
            </p>
          </Reveal>
        </header>

        {/* What Twelvefold names */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The name</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.5px", marginBottom: "20px" }}>Why Twelvefold.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, lineHeight: 1.7 }}>
              The framework is built around the twelve phases of the solar year — the structure every life moves through, every relationship lives, every project follows. Twelve lunar cycles per solar year. Twelve archetypal phases of transformation, recognized independently by Ifá, Kabbalah, the I Ching, Scripture, Buddhism, and Hermetic philosophy. The Institute is named for the structure it teaches. <em style={{ color: T.text }}>Twelvefold</em> is the shape of how anything moves through time.
            </p>
          </Reveal>
        </section>

        {/* Anti-goals */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 880, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.gold}>What we will not do</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Four lines we hold.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.2vw, 18px)", color: T.textDim, maxWidth: 600, margin: "16px auto 0", lineHeight: 1.6 }}>
              An institution is defined as much by what it refuses as by what it builds. These are the commitments that shape every decision.
            </p>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {antiGoals.map(([title, body], i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ padding: "26px 28px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, borderLeft: `3px solid ${T.gold}` }}>
                  <h3 style={{ fontFamily: T.font, fontSize: "21px", fontWeight: 600, marginBottom: "8px", letterSpacing: "-0.3px" }}>{title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.65 }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>How we operate</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Four operating principles.</h2>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {principles.map(([title, body], i) => (
              <Reveal key={title} delay={(i % 2) * 0.08}>
                <div style={{ height: "100%", padding: "24px 26px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.accent, textTransform: "uppercase", marginBottom: "12px" }}>0{i + 1}</div>
                  <h3 style={{ fontFamily: T.font, fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}>{title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.65 }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(40px, 7vw, 100px) clamp(20px, 5vw, 64px)", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.5px", marginBottom: "16px" }}>Ready to begin?</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.3vw, 18px)", color: T.textDim, lineHeight: 1.6, marginBottom: "28px" }}>
              Read one of your own patterns now, or commit to becoming Twelvefold-certified.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="gold" href="/#try-it">Read my pattern</Btn>
              <Btn variant="ghost" href="/certification">See certification</Btn>
            </div>
          </Reveal>
        </section>

        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></a>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <a href="/pattern-literacy" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Pattern Literacy</a>
            <a href="/certification" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Certification</a>
            <a href="/institutions" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Institutions</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
