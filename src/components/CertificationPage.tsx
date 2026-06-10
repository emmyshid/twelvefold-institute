"use client";

import { useState, useEffect, useRef, useMemo } from "react";

// ════════════════════════════════════════════════════════════════
// TWELVEFOLD INSTITUTE — Certification Sales Page (Phase 1 / C2)
// 200-Hour Certification in Pattern Literacy · $6,500 · cohort-based.
// Same design system as the homepage. Signature: the certification seal.
// Framed as an application, not instant checkout.
// ════════════════════════════════════════════════════════════════

const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.6)",
  textMuted: "rgba(237,233,245,0.34)",
  accent: "#A78BFA",
  accentDark: "#7C3AED",
  gold: "#FBBF24",
  grad: "linear-gradient(135deg, #A78BFA, #7C3AED)",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  radius: "18px",
  radiusSm: "11px",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
};

const PHASES = [
  "Sparking", "Building", "Learning", "Feeling",
  "Expressing", "Refining", "Relating", "Transforming",
  "Reaching", "Constructing", "Liberating", "Dissolving",
];

const CURRICULUM = [
  {
    tag: "Phase I", hours: "40 hours", when: "Weeks 1–2 · self-paced",
    title: "Foundation", color: "#A78BFA",
    blurb: "Learn the framework cold before you read for anyone.",
    modules: [
      ["Core Teaching", "15h", "Reality is patterned, not random. Why six traditions converged. The 12 phases and 4 micro-states, end to end."],
      ["Pattern Recognition Basics", "15h", "Signal detection. Telling pattern from story. The six life areas. The common traps — and five worked case studies."],
      ["The Wisdom Traditions", "10h", "Ifá, Kabbalah, I Ching, Scripture, Buddhism, Hermetic — how they converge, and how to honor them without appropriating."],
    ],
  },
  {
    tag: "Phase II", hours: "80 hours", when: "Weeks 3–6 · cohort + live",
    title: "Framework", color: "#7C3AED",
    blurb: "Live the framework through every phase, with a cohort beside you.",
    modules: [
      ["The 12 Phases Deep Dive", "40h", "Each phase taught live, then practiced — group case studies, self-study, and PatternOS readings on your own life."],
      ["Micro-States, Timing & Case Work", "40h", "The four micro-states inside every phase, how timing changes the reading, and supervised cohort case work."],
    ],
  },
  {
    tag: "Phase III", hours: "80 hours", when: "Weeks 7+ · supervised practicum",
    title: "Application", color: "#FBBF24",
    blurb: "Read for real people, under supervision, until it holds.",
    modules: [
      ["Supervised Practicum", "—", "Conduct real readings and receive live group supervision on your work."],
      ["Certification Deliverables", "—", "A full diagnostic, an aligned-action plan, and a reflection — reviewed against the standard."],
      ["Final Review & Certification", "—", "Peer and faculty review. On passing, you become a Certified Pattern Institute Practitioner."],
    ],
  },
];

const OUTCOMES = [
  "Read which phase and micro-state a person or organization is in, with evidence — not a guess.",
  "Name the curriculum a pattern is carrying, in plain language anyone can act on.",
  "Translate any reading through the six traditions without flattening or appropriating them.",
  "Guide recommended participation: what cooperating with the phase actually asks, in real circumstances.",
  "Hold a reading with care — honest about what the framework can and cannot tell you.",
  "Practice inside PatternOS in practitioner mode, with client history and session tools.",
];

const FAQ = [
  ["Do I need to believe in astrology?", "No. The phase names are borrowed labels, not personality types. The 12 phases track the solar year; the framework rests on observable structure, not belief. Skeptics do well here."],
  ["What's the time commitment?", "200 hours over 8–16 weeks, paced to your life. The Foundation phase is self-paced; the Framework and Application phases include scheduled live sessions with your cohort."],
  ["Do I need prior training?", "No clinical or spiritual credential is required. You need genuine curiosity, the willingness to be read yourself first, and the discipline to finish 200 hours of real work."],
  ["What can I do once certified?", "Read patterns for the individuals and organizations you work with, use PatternOS in practitioner mode, and carry the Certified Pattern Institute Practitioner credential. We make no income promises — only that you'll be able to do the work well."],
  ["Why is admission by application?", "Because we cap cohorts to protect the quality of supervision, and because this work asks something of you. We read every application and admit people we can train well."],
];

// ─── Reveal ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.8s ${T.ease} ${delay}s, transform 0.8s ${T.ease} ${delay}s`, ...style }}>{children}</div>;
}

// ─── Starfield ───────────────────────────────────────────────
function Starfield() {
  const stars = useMemo(() => Array.from({ length: 40 }, () => ({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1.5 + 0.6, delay: Math.random() * 6, dur: Math.random() * 4 + 4, op: Math.random() * 0.4 + 0.2 })), []);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {stars.map((s, i) => <span key={i} className="pi-star" style={{ position: "absolute", top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, borderRadius: "50%", background: i % 7 === 0 ? T.gold : "#fff", opacity: s.op, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />)}
    </div>
  );
}

// ─── Signature: certification seal ───────────────────────────
function CertSeal() {
  const VB = 300, c = VB / 2, r = 118;
  return (
    <div style={{ position: "relative", width: "min(300px, 70vw)", aspectRatio: "1 / 1", margin: "0 auto" }}>
      <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="sealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" /><stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <radialGradient id="sealGlow"><stop offset="0%" stopColor="rgba(251,191,36,0.18)" /><stop offset="100%" stopColor="rgba(251,191,36,0)" /></radialGradient>
        </defs>
        <circle cx={c} cy={c} r={r + 14} fill="url(#sealGlow)" />
        <circle className="pi-rot-slow" cx={c} cy={c} r={r} fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" strokeDasharray="3 7" style={{ transformOrigin: "center" }} />
        <circle cx={c} cy={c} r={r - 14} fill="none" stroke="url(#sealGrad)" strokeWidth="2" />
        {PHASES.map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={c + (r - 14) * Math.cos(a)} cy={c + (r - 14) * Math.sin(a)} r="2.5" fill="#FBBF24" />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 14%" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "3px", color: T.gold, textTransform: "uppercase" }}>Certified</div>
        <div style={{ fontFamily: T.font, fontSize: "clamp(20px, 5vw, 26px)", fontStyle: "italic", color: T.text, lineHeight: 1.1, margin: "6px 0" }}>Pattern Institute Practitioner</div>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.textMuted }}>200 HOURS</div>
      </div>
    </div>
  );
}

// ─── Atoms ───────────────────────────────────────────────────
function Btn({ children, variant = "primary", onClick, style }) {
  const v = { primary: { background: T.grad, color: "#fff", border: "none", glow: "rgba(124,58,237,0.4)" }, gold: { background: T.gradGold, color: "#1a1206", border: "none", glow: "rgba(251,191,36,0.35)" }, ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}`, glow: "rgba(167,139,250,0.25)" } }[variant];
  return (
    <button onClick={onClick} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", transition: `transform 0.3s ${T.ease}, box-shadow 0.3s ${T.ease}, border-color 0.3s ${T.ease}`, background: v.background, color: v.color, border: v.border, ...style }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${v.glow}`; if (variant === "ghost") e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; if (variant === "ghost") e.currentTarget.style.borderColor = T.border; }}>{children}</button>
  );
}
function Eyebrow({ children, color }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.accent, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />{children}</div>;
}

// ─── Application capture (no backend; demonstrates the flow) ──
function ApplyPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [why, setWhy] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const valid = email.includes("@") && name.trim().length > 1;

  const inputStyle = { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "16px", padding: "13px 15px", outline: "none", marginBottom: "12px" };

  if (sent) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", background: T.bgCard, border: `1px solid rgba(251,191,36,0.3)`, borderRadius: T.radius, padding: "40px 28px" }}>
        <div style={{ fontFamily: T.font, fontSize: "26px", fontStyle: "italic", color: T.text, marginBottom: "10px" }}>Your application is in.</div>
        <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, lineHeight: 1.6 }}>We read every one. Expect a reply within a week about the next cohort and the conversation that comes next.</p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "clamp(20px, 4vw, 30px)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")} onBlur={e => (e.currentTarget.style.borderColor = T.border)} />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputStyle}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")} onBlur={e => (e.currentTarget.style.borderColor = T.border)} />
      <textarea value={why} onChange={e => setWhy(e.target.value)} rows={3} placeholder="Why do you want to learn to read patterns?" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")} onBlur={e => (e.currentTarget.style.borderColor = T.border)} />
      {err ? <div style={{ fontFamily: T.font, fontSize: "14px", color: "#FF9B9B", marginBottom: "10px" }}>{err}</div> : null}
      <Btn variant="gold" onClick={() => { if (!valid) { setErr("Add your name and a valid email to apply."); return; } setErr(null); setSent(true); }} style={{ opacity: valid ? 1 : 0.6, width: "100%" }}>Submit application</Btn>
      <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, textAlign: "center", marginTop: "12px", letterSpacing: "0.5px" }}>Applications reviewed individually · small cohorts</div>
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", background: "transparent", border: "none", cursor: "pointer", padding: "20px 4px", textAlign: "left" }}>
        <span style={{ fontFamily: T.font, fontSize: "19px", color: T.text }}>{q}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: "18px", color: T.accent, transform: open ? "rotate(45deg)" : "none", transition: `transform 0.3s ${T.ease}`, flexShrink: 0 }}>+</span>
      </button>
      {open ? <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.65, padding: "0 4px 22px" }}>{a}</p> : null}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function CertificationPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Pattern Literacy", "Read", "Book", "Certification", "Institutions"];

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pi-drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(7%, 5%) scale(1.12); } }
        @keyframes pi-drift2 { 0%,100% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-6%, -4%) scale(1); } }
        @keyframes pi-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        @keyframes pi-spin { to { transform: rotate(360deg); } }
        .pi-star { animation: pi-twinkle ease-in-out infinite; }
        .pi-rot-slow { animation: pi-spin 160s linear infinite; }
        .pi-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .pi-card { transition: transform 0.35s ${T.ease}, border-color 0.35s ${T.ease}, box-shadow 0.35s ${T.ease}; }
        .pi-card:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.35); box-shadow: 0 16px 44px rgba(0,0,0,0.45); }
        .pi-grain { position: fixed; inset: 0; z-index: 2; pointer-events: none; opacity: 0.04; mix-blend-mode: overlay; }
        .pi-menu-btn { display: none; }
        @media (max-width: 820px) { .pi-nav-links { display: none !important; } .pi-menu-btn { display: inline-flex !important; } }
        @media (prefers-reduced-motion: reduce) { .pi-star, .pi-rot-slow, .pi-blob { animation: none !important; } }
        button:focus-visible, textarea:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid #A78BFA; outline-offset: 3px; }
      `}</style>

      <Starfield />
      <div className="pi-blob" style={{ width: 540, height: 540, top: -140, left: -110, background: "radial-gradient(circle, rgba(124,58,237,0.42), transparent 70%)", animation: "pi-drift1 24s ease-in-out infinite" }} />
      <div className="pi-blob" style={{ width: 460, height: 460, top: 280, right: -130, background: "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)", animation: "pi-drift2 28s ease-in-out infinite" }} />
      <svg className="pi-grain"><filter id="grainF2"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainF2)" /></svg>

      <div style={{ position: "relative", zIndex: 3 }}>
        {/* Nav */}
        <nav style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px clamp(20px, 5vw, 64px)", gap: "16px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div className="pi-nav-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
              {navLinks.map(l => <a key={l} href="#" style={{ fontFamily: T.fontMono, fontSize: "12px", color: l === "Certification" ? T.text : T.textDim, textDecoration: "none", letterSpacing: "0.5px" }} onMouseEnter={e => (e.currentTarget.style.color = T.text)} onMouseLeave={e => (e.currentTarget.style.color = l === "Certification" ? T.text : T.textDim)}>{l}</a>)}
            </div>
            <Btn variant="gold" style={{ padding: "10px 20px" }}>Apply</Btn>
            <button className="pi-menu-btn" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", width: 44, height: 44, color: T.text, fontSize: "18px", cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{menuOpen ? "\u2715" : "\u2630"}</button>
          </div>
          {menuOpen ? (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, margin: "8px clamp(20px, 5vw, 64px) 0", background: "rgba(12,12,24,0.94)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "12px", display: "flex", flexDirection: "column", gap: "2px", boxShadow: "0 16px 44px rgba(0,0,0,0.5)" }}>
              {navLinks.map(l => <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.textDim, textDecoration: "none", letterSpacing: "0.5px", padding: "13px 14px", borderRadius: T.radiusSm }} onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }} onMouseLeave={e => { e.currentTarget.style.color = T.textDim; e.currentTarget.style.background = "transparent"; }}>{l}</a>)}
            </div>
          ) : null}
        </nav>

        {/* Hero */}
        <header style={{ padding: "clamp(36px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(20px, 5vw, 40px)", maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "clamp(36px, 6vw, 56px)", alignItems: "center", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.gold}>Practitioner Certification</Eyebrow></div>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(38px, 7vw, 68px)", lineHeight: 1.02, fontWeight: 600, letterSpacing: "-1px" }}>Learn to read patterns<br />for others.</h1>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, maxWidth: 580, margin: "22px auto 0", lineHeight: 1.65 }}>
              A 200-hour cohort program that trains you to read the phase a person or organization is in — and to guide what it's actually asking. Rigorous, supervised, and grounded in six traditions.
            </p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginTop: "26px", fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, letterSpacing: "0.5px" }}>
              <span>200 hours</span><span style={{ color: T.textMuted }}>·</span><span>8–16 weeks</span><span style={{ color: T.textMuted }}>·</span><span style={{ color: T.gold }}>$6,500</span>
            </div>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
              <Btn variant="gold">Apply for the next cohort</Btn>
              <Btn variant="ghost">Download the syllabus</Btn>
            </div>
          </Reveal>
          <Reveal delay={0.15}><CertSeal /></Reveal>
        </header>

        {/* Outcomes */}
        <section style={{ padding: "clamp(50px, 8vw, 100px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "46px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>What you'll be able to do</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.2vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>By the end, you can read.</h2>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {OUTCOMES.map((o, i) => (
              <Reveal key={i} delay={(i % 3) * 0.07}>
                <div style={{ height: "100%", padding: "24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.gold, marginBottom: "10px" }}>{String(i + 1).padStart(2, "0")}</div>
                  <p style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: 1.55 }}>{o}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The curriculum</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.2vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Three phases. Two hundred hours.</h2>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {CURRICULUM.map((p, i) => (
              <Reveal key={p.tag} delay={i * 0.08}>
                <div className="pi-card" style={{ padding: "clamp(22px, 4vw, 32px)", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "2px", color: p.color, textTransform: "uppercase" }}>{p.tag} · {p.when}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.gold }}>{p.hours}</div>
                  </div>
                  <h3 style={{ fontFamily: T.font, fontSize: "28px", fontWeight: 600, marginBottom: "4px" }}>{p.title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, fontStyle: "italic", marginBottom: "20px" }}>{p.blurb}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {p.modules.map(([mt, mh, md]) => (
                      <div key={mt} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: T.font, fontSize: "18px", color: T.text, fontWeight: 600 }}>{mt}</span>
                          <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted }}>{mh}</span>
                        </div>
                        <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.55 }}>{md}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[["Cohort-based", "You learn alongside a small group, with live supervision — not alone in a video library."], ["Self-paced where it fits", "Foundation is asynchronous. Live sessions anchor the framework and practicum."], ["Supervised practice", "You read real people and organizations under faculty review before you're certified."], ["Built on PatternOS", "Train inside the same tool you'll practice with, in practitioner mode."]].map(([h, b], i) => (
              <Reveal key={h} delay={(i % 4) * 0.06}>
                <div style={{ height: "100%", padding: "24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <h3 style={{ fontFamily: T.font, fontSize: "21px", fontWeight: 600, marginBottom: "8px" }}>{h}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.6 }}>{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Investment */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)" }}>
          <Reveal>
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: T.radius, padding: "clamp(28px, 5vw, 44px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.gold}>Investment</Eyebrow></div>
              <div style={{ fontFamily: T.font, fontSize: "clamp(48px, 9vw, 68px)", fontWeight: 600, color: T.text, lineHeight: 1 }}>$6,500</div>
              <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, lineHeight: 1.6, margin: "18px auto 0", maxWidth: 420 }}>
                The full 200-hour program: all coursework, live cohort sessions, supervised practicum, certification review, and PatternOS practitioner access. Payment plans available on request.
              </p>
              <div style={{ marginTop: "26px" }}><Btn variant="gold">Apply for the next cohort</Btn></div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 760, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Questions</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Before you apply.</h2>
          </div></Reveal>
          <Reveal delay={0.08}><div>{FAQ.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}</div></Reveal>
        </section>

        {/* Apply */}
        <section id="apply" style={{ padding: "clamp(40px, 7vw, 90px) clamp(20px, 5vw, 64px)" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.gold}>Apply</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.2vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Start the conversation.</h2>
              <p style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim, maxWidth: 480, margin: "14px auto 0", lineHeight: 1.6 }}>Tell us who you are and why this work calls you. We read every application and admit people we can train well.</p>
            </div>
            <ApplyPanel />
          </Reveal>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></div>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            {["Pattern Literacy", "PatternOS", "Certification", "Research", "About"].map(l => <a key={l} href="#" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = T.textDim)} onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>{l}</a>)}
          </div>
        </footer>
      </div>
    </div>
  );
}
