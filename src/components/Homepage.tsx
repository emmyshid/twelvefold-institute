"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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

const PHASES = ["Sparking","Building","Learning","Feeling","Expressing","Refining","Relating","Transforming","Reaching","Constructing","Liberating","Dissolving"];
const TRADITIONS = ["Ifá","Kabbalah","I Ching","Scripture","Buddhism","Hermetic"];
// ─── Recognition carousel data ──────────────────────────────────
// Each card mirrors a real voice — something a cold visitor might
// say to themselves. Tapping a card prefills the reading textarea
// below with that exact phrasing so they can immediately get a
// reading on what they recognized.
// Pattern Names sourced from PatternOS-Pattern-Name-Library.md
const RECOGNITION_CARDS = [
  { voice: "I keep starting things with excitement and abandoning them at week three.", pattern: "The Boredom Test", state: "Taurus · Contraction · 2.3" },
  { voice: "Every relationship ends the same way, and I can describe exactly how.", pattern: "The Compromise Wall", state: "Libra · Contraction · 7.3" },
  { voice: "I'm exhausted, and slowing down feels like falling behind.", pattern: "The Tiredness That Knows", state: "Pisces · Initiation · 12.1" },
  { voice: "I see what's wrong but can't make myself fix it.", pattern: "Perfectionist's Trap", state: "Virgo · Contraction · 6.3" },
  { voice: "Something needs to end — a job, a story, an old self — and I'm resisting it.", pattern: "The Underworld Crossing", state: "Scorpio · Expansion · 8.2" },
  { voice: "I left the form that held me, and I haven't built what's next.", pattern: "Breaking the Form", state: "Aquarius · Expansion · 11.2" },
  { voice: "Something new is calling me, and I'm afraid to say yes.", pattern: "Ignition Moment", state: "Aries · Initiation · 1.1" },
  { voice: "I feel stuck — but I sense I'm being prepared for something.", pattern: "Hidden Preparation", state: "Capricorn · Initiation · 10.1" },
];

// ─── Six traditions carousel data ───────────────────────────────
// The convergence argument made visible: six lineages, all serious,
// all pointing at the same underlying structure.
const TRADITION_CARDS = [
  { name: "Ifá",        origin: "Yoruba tradition (West Africa)", insight: "256 odu configurations map every human cycle and the right relationship with each.", source: "Wande Abimbola, Sixteen Great Poems of Ifá (Harvard)" },
  { name: "Kabbalah",   origin: "Jewish mysticism",                insight: "The ten Sefirot represent stages of conscious evolution.",                              source: "Sefer Yetzirah; Gershom Scholem, Major Trends in Jewish Mysticism" },
  { name: "I Ching",    origin: "Chinese classic",                 insight: "Sixty-four hexagrams describe situations and how they transform. Nothing is static.", source: "Wilhelm/Baynes translation (Princeton, 1967)" },
  { name: "Scripture",  origin: "World spiritual texts",           insight: "Reality operates on patterns. Solomon's prayer: teach me how reality works.",         source: "1 Kings 3:9; Genesis, Exodus, Job; 1 Corinthians 12:4–11" },
  { name: "Buddhism",   origin: "Asian tradition",                 insight: "The Twelve Nidanas map the cycle of suffering and awakening.",                         source: "Bhikkhu Bodhi, Comprehensive Manual of the Dharma" },
  { name: "Hermetic",   origin: "Western esoteric philosophy",     insight: "The Principle of Rhythm: everything flows, out and in; everything has its tides.",  source: "The Kybalion (1908)" },
];


type Variant = "primary" | "gold" | "ghost";

interface PatternReading {
  pattern_name?: string;
  phase?: string;
  micro_state?: string;
  likely_curriculum?: string;
  active_lesson?: string;
  recommended_participation?: string;
  error?: string;
}

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
  const stars = useMemo(() => Array.from({ length: 46 }, () => ({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1.6 + 0.6, delay: Math.random() * 6, dur: Math.random() * 4 + 4, op: Math.random() * 0.4 + 0.2 })), []);
  return <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>{stars.map((s, i) => <span key={i} className="pi-star" style={{ position: "absolute", top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, borderRadius: "50%", background: i % 7 === 0 ? T.gold : "#fff", opacity: s.op, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />)}</div>;
}

function PhaseRing() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % 12), 2400);
    return () => clearInterval(id);
  }, []);
  const size = 460, c = size / 2, r = 145, rLabel = 186, arcFrac = (active + 1) / 12;
  return (
    <div style={{ position: "relative", width: "min(440px, 86vw)", aspectRatio: "1 / 1", margin: "0 auto" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="55%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx={c} cy={c} r={r} fill="none" stroke="url(#arcGrad)" strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray={`${arcFrac} 1`} transform={`rotate(-90 ${c} ${c})`} filter="url(#soft)" style={{ transition: "stroke-dasharray 1.1s " + T.ease }} />
        {PHASES.map((name, i) => {
          const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = c + r * Math.cos(ang), y = c + r * Math.sin(ang);
          const lx = c + rLabel * Math.cos(ang), ly = c + rLabel * Math.sin(ang);
          const on = i === active;
          return (
            <g key={name}>
              <circle cx={x} cy={y} r={on ? 6 : 3} fill={on ? T.gold : "rgba(237,233,245,0.3)"} filter={on ? "url(#soft)" : undefined} style={{ transition: "all 0.7s " + T.ease }} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontFamily="'Space Mono', monospace" fontSize="11" letterSpacing="1.5" fill={on ? T.gold : "rgba(237,233,245,0.28)"} style={{ transition: "fill 0.7s " + T.ease, textTransform: "uppercase" }}>{name}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "3px", color: T.textMuted, textTransform: "uppercase" }}>Now reading</div>
        <div style={{ fontFamily: T.font, fontSize: "clamp(26px, 6vw, 36px)", color: T.text, fontStyle: "italic", lineHeight: 1.05, margin: "6px 0" }}>{PHASES[active]}</div>
        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.accent }}>{String(active + 1).padStart(2, "0")} / 12</div>
      </div>
    </div>
  );
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
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = href;
    }
  };
  return (
    <button onClick={handleClick} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", transition: `transform 0.3s ${T.ease}, box-shadow 0.3s ${T.ease}`, background: v.background, color: v.color, border: v.border, ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${v.glow}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      {children}
    </button>
  );
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.accent, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />{children}</div>;
}

function TryReading() {
  const [input, setInput] = useState("");

  // Listen for prefill events dispatched by recognition cards above.
  // When a card is tapped, we drop its voice into our textarea, scroll
  // into view, and focus so the visitor can immediately Read.
  useEffect(() => {
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<{ text: string }>).detail;
      if (!detail?.text) return;
      setInput(detail.text);
      // Defer focus until after the textarea has the new value
      setTimeout(() => {
        const ta = document.querySelector("#try-it textarea") as HTMLTextAreaElement | null;
        if (ta) ta.focus();
      }, 50);
    }
    window.addEventListener("prefill-reading", onPrefill as EventListener);
    return () => window.removeEventListener("prefill-reading", onPrefill as EventListener);
  }, []);

  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<PatternReading | null>(null);

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setReading(null);
    try {
      const res = await fetch("/api/reading", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ situation: input.trim() }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Reading service unavailable"); }
      const data = await res.json();
      setReading(data.summary);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something interrupted the reading.";
      setReading({ error: msg });
    } finally {
      setLoading(false);
    }
  }

  const field = (label: string, value?: string) => value ? (
    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, borderLeft: `2px solid rgba(167,139,250,0.4)` }}>
      <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.accent, textTransform: "uppercase", marginBottom: "7px" }}>{label}</div>
      <div style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: 1.55 }}>{value}</div>
    </div>
  ) : null;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "clamp(20px, 4vw, 30px)" }}>
      <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "2px", color: T.textDim, textTransform: "uppercase", marginBottom: "12px" }}>What keeps happening?</div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="The same thing keeps showing up in my work / relationships / life…" style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "17px", padding: "15px", resize: "vertical", outline: "none", lineHeight: 1.5 }} />
      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
        <Btn variant="gold" onClick={run} style={{ opacity: loading || !input.trim() ? 0.55 : 1 }}>{loading ? "Reading the pattern…" : "Read my pattern"}</Btn>
        <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted }}>Free · no account needed</span>
      </div>
      {reading && !reading.error ? (
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "13px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.gold, textTransform: "uppercase", marginBottom: "8px" }}>Your pattern</div>
            <div style={{ fontFamily: T.font, fontSize: "clamp(28px, 6vw, 36px)", fontStyle: "italic", color: T.text, lineHeight: 1.1 }}>{reading.pattern_name}</div>
            {reading.phase && <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", color: T.textDim, marginTop: "9px" }}>{reading.phase}{reading.micro_state ? ` · ${reading.micro_state}` : ""}</div>}
          </div>
          {field("The curriculum", reading.likely_curriculum)}
          {field("The lesson active now", reading.active_lesson)}
          {field("Recommended participation", reading.recommended_participation)}
        </div>
      ) : reading?.error ? (
        <div style={{ marginTop: "18px", padding: "14px 16px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: T.radiusSm, fontFamily: T.font, fontSize: "15px", color: "#FF9B9B" }}>{reading.error}</div>
      ) : null}
    </div>
  );
}

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Practitioner detection — show Portal + PatternOS links in the nav
  // only to cert-paid users. Lightweight client-side check against the
  // existing /api/me/cert-status endpoint (returns {isCertified}). Until
  // the response lands, isCertified is false, so the links simply don't
  // flash in for anonymous/non-cert visitors.
  const [isCertified, setIsCertified] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/cert-status");
        if (!res.ok) return;
        const data = (await res.json()) as { isCertified?: boolean };
        if (!cancelled) setIsCertified(!!data.isCertified);
      } catch {
        /* not signed in or check failed — leave links hidden */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const navLinks: [string, string][] = [
    ["Initiation", "/initiation"],
    ["Pattern Literacy", "/pattern-literacy"],
    ["Read", "/read"],
    ["Book", "/book"],
    ["Certification", "/certification"],
    ["Institutions", "/institutions"],
    // Practitioner-only links — appended when the user is cert-paid.
    ...(isCertified
      ? ([["Portal", "/portal"], ["PatternOS", "/read/app"]] as [string, string][])
      : []),
  ];
  const doors = [
    { eyebrow: "Begin here", title: "Take the Initiation", body: "A guided 35-minute introduction to the framework. Recognize the phase you are in, hear what it is asking, and leave with a practice for the week.", cta: "Begin the Initiation", href: "/initiation", variant: "gold" as Variant },
    { eyebrow: "When you have a situation in mind", title: "Try a brief reading", body: "Describe what keeps happening. The homepage try-it gives you a pattern name and a phase. For a full reading, work with a certified practitioner.", cta: "Try it now", href: "#try-it", variant: "primary" as Variant },
    { eyebrow: "The book", title: "Pattern Literacy", body: "How to read the intelligent cycles governing your life. Read the opening pages, see the chapter list, and join the launch list.", cta: "Read more", href: "/book", variant: "ghost" as Variant },
    { eyebrow: "Become a practitioner", title: "Certification", body: "Become a Twelvefold-certified practitioner. 200 hours, small cohorts, $6,500.", cta: "See the program", href: "/certification", variant: "primary" as Variant, feature: true },
    { eyebrow: "For organizations", title: "License the Twelvefold framework", body: "Organizational diagnostics and licensing for schools, healthcare, and teams. Book a consult.", cta: "Start a conversation", href: "/institutions", variant: "ghost" as Variant },
  ];
  const shift: [string, string][] = [
    ["\u201CWhy does this keep happening to me?\u201D", "\u201CWhat is this pattern teaching me?\u201D"],
    ["Life as random events", "Life as intelligently ordered"],
    ["Patterns as personal failure", "Patterns as curriculum"],
    ["Self-improvement through willpower", "Alignment with what the moment asks"],
    ["Wisdom in isolation", "Six traditions, one structure"],
  ];

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
        .pi-nav-links { display: flex; gap: 28px; align-items: center; }
        .pi-menu-btn { display: none; background: transparent; border: 1px solid ${T.border}; border-radius: 10px; width: 42px; height: 42px; color: ${T.text}; font-size: 18px; cursor: pointer; align-items: center; justify-content: center; flex-shrink: 0; }
        .pi-shift-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: 14px; }
        .pi-shift-arrow { font-family: ${T.fontMono}; font-size: 18px; color: ${T.accent}; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 820px) {
          .pi-nav-links { display: none; }
          .pi-menu-btn { display: inline-flex; }
        }
        @media (max-width: 640px) {
          .pi-shift-row { grid-template-columns: 1fr; gap: 8px; }
          .pi-shift-arrow { transform: rotate(90deg); padding: 2px 0; }
        }
        /* Carousels — horizontal scroll-snap with peek-on-edges */
        .pi-carousel-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(260px, 320px);
          gap: 14px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          padding: 8px clamp(20px, 5vw, 64px) 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(167,139,250,0.3) transparent;
          -webkit-overflow-scrolling: touch;
        }
        .pi-carousel-track::-webkit-scrollbar { height: 6px; }
        .pi-carousel-track::-webkit-scrollbar-track { background: transparent; }
        .pi-carousel-track::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.22); border-radius: 6px; }
        .pi-carousel-card {
          scroll-snap-align: start;
          background: rgba(255,255,255,0.025);
          border: 1px solid ${T.border};
          border-radius: 14px;
          padding: 24px 24px;
          cursor: default;
          transition: transform 0.3s ${T.ease}, border-color 0.3s ${T.ease}, box-shadow 0.3s ${T.ease};
          display: flex;
          flex-direction: column;
          text-align: left;
          color: inherit;
          font: inherit;
        }
        .pi-recog-card { cursor: pointer; }
        .pi-recog-card:hover, .pi-recog-card:focus-visible {
          transform: translateY(-3px);
          border-color: rgba(167,139,250,0.35);
          box-shadow: 0 14px 40px rgba(0,0,0,0.40);
        }
        .pi-tradition-card:hover {
          transform: translateY(-3px);
          border-color: rgba(167,139,250,0.30);
          box-shadow: 0 14px 40px rgba(0,0,0,0.36);
        }
        @media (max-width: 640px) {
          .pi-carousel-track { grid-auto-columns: minmax(240px, 80vw); padding: 8px 20px 24px; }
        }
        button:focus-visible, textarea:focus-visible, a:focus-visible { outline: 2px solid #A78BFA; outline-offset: 3px; }
      `}</style>

      <Starfield />

      <div style={{ position: "relative", zIndex: 3 }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px clamp(20px, 5vw, 64px)", gap: "16px", background: "rgba(6,6,15,0.78)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span>
          </div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div className="pi-nav-links">
              {navLinks.map(([label, href]) => {
                const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (href.startsWith("#")) {
                    e.preventDefault();
                    const el = document.getElementById(href.slice(1));
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                };
                return <a key={label} href={href} onClick={handle} style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim, textDecoration: "none", letterSpacing: "0.5px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}>{label}</a>;
              })}
            </div>
            <Btn variant="ghost" href="#try-it" style={{ padding: "10px 18px" }}>Get a reading</Btn>
            <SignedOut>
              <Btn variant="ghost" href="/sign-in" style={{ padding: "10px 18px" }}>Sign in</Btn>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  variables: { colorPrimary: "#A78BFA" },
                  elements: { avatarBox: { width: 36, height: 36, border: `1px solid ${T.border}` } },
                }}
              />
            </SignedIn>
            <button aria-label="Menu" className="pi-menu-btn" onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? "\u2715" : "\u2630"}
            </button>
          </div>
          {menuOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, margin: "8px clamp(20px,5vw,64px) 0", background: "rgba(12,12,24,0.96)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 12, display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 16px 44px rgba(0,0,0,0.5)" }}>
              {navLinks.map(([label, href]) => {
                const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  setMenuOpen(false);
                  if (href.startsWith("#")) {
                    e.preventDefault();
                    setTimeout(() => {
                      const el = document.getElementById(href.slice(1));
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }
                };
                return <a key={label} href={href} onClick={handle} style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.textDim, textDecoration: "none", letterSpacing: "0.5px", padding: "13px 14px", borderRadius: T.radiusSm }}>{label}</a>;
              })}
            </div>
          )}
        </nav>

        <header style={{ padding: "clamp(36px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(20px, 5vw, 40px)", maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <Reveal><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Read the pattern. Align with the order.</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(40px, 8vw, 78px)", lineHeight: 1.0, fontWeight: 600, letterSpacing: "-1px" }}>Something invisible is<br />running your life.</h1>
            <p style={{ fontFamily: T.font, fontSize: "clamp(21px, 3.4vw, 28px)", color: T.accent, fontStyle: "italic", marginTop: "18px" }}>You can learn to read it.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, maxWidth: 580, margin: "24px auto 0", lineHeight: 1.65 }}>The same situations keep returning — in work, in love, in who you become under pressure. They are not random, and they are not failure. They are curriculum. We teach you to read it.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "34px", flexWrap: "wrap" }}>
              <Btn variant="gold" href="#try-it">Get your first reading</Btn>
              <Btn variant="ghost" href="/certification">See the certification</Btn>
            </div>
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: "clamp(40px, 7vw, 70px)" }}><PhaseRing /></Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "2.5px", color: T.textMuted, textTransform: "uppercase", marginTop: "20px" }}>
              Twelve phases &middot; Forty-eight states &middot; One framework
            </p>
          </Reveal>
        </header>

        <section id="how-it-works" style={{ padding: "clamp(40px, 7vw, 90px) clamp(20px, 5vw, 64px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>How it works</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 600, letterSpacing: "-0.5px", margin: "0 0 14px" }}>Four steps. One cycle.</h2>
              <p style={{ fontFamily: T.font, fontSize: "clamp(16px, 2.2vw, 18px)", color: T.textDim, maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>The framework reads a recurring situation as a position in a larger cycle — and gives you a way to act with that cycle, not against it.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {[
              { n: "01", label: "Name", title: "Name the recurring situation", body: "You describe what keeps happening. A relationship loop, a work pattern, an emotional cycle — the more specific, the better." },
              { n: "02", label: "Phase", title: "Identify the phase", body: "The framework locates your situation in one of twelve universal phases — from Ignition through Dissolution — and names the curriculum it carries." },
              { n: "03", label: "Micro-state", title: "Read the micro-state", body: "Each phase moves through four micro-states: Initiation, Expansion, Contraction, Integration. You see exactly where in the arc you are." },
              { n: "04", label: "Action", title: "Receive aligned action", body: "You leave with a concrete recommended participation — what cooperation with this phase looks like in your actual life this week." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.06}>
                <div className="pi-card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "26px 24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1.5px", color: T.gold, fontWeight: 700, marginBottom: "10px" }}>{step.n} · {step.label.toUpperCase()}</div>
                  <h3 style={{ fontFamily: T.font, fontSize: "20px", fontWeight: 600, marginBottom: "10px", letterSpacing: "-0.2px", lineHeight: 1.25 }}>{step.title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.6, flex: 1 }}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p style={{ textAlign: "center", marginTop: "32px", maxWidth: 620, marginLeft: "auto", marginRight: "auto", fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.65, fontStyle: "italic" }}>
              The brief reading below gives you all four steps in summary form. For depth on each — the full pattern named, the alignment read, the participation prescribed — you work with a <a href="/read" style={{ color: T.accent, textDecoration: "none", borderBottom: "1px dashed " + T.accent }}>certified practitioner</a>.
            </p>
          </Reveal>
        </section>

        <section id="recognition" style={{ padding: "clamp(40px, 7vw, 90px) 0 clamp(20px, 4vw, 50px)", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", padding: "0 clamp(20px, 5vw, 64px)", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Recognition</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 600, letterSpacing: "-0.5px", margin: "0 0 10px" }}>Does this sound like you?</h2>
              <p style={{ fontFamily: T.font, fontSize: "clamp(15px, 2.2vw, 17px)", color: T.textDim, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>Tap any voice that feels familiar. Each one is a real pattern, with a name and a phase. Tapping drops it into the reading below.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="pi-carousel-track" role="region" aria-label="Recognition carousel">
              {RECOGNITION_CARDS.map((c, i) => (
                <button key={i} className="pi-carousel-card pi-recog-card" onClick={() => {
                  window.dispatchEvent(new CustomEvent("prefill-reading", { detail: { text: c.voice } }));
                  setTimeout(() => {
                    const el = document.getElementById("try-it");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 0);
                }}>
                  <div style={{ fontFamily: T.font, fontSize: "18px", fontStyle: "italic", color: T.text, lineHeight: 1.55, marginBottom: "18px", flex: 1 }}>&ldquo;{c.voice}&rdquo;</div>
                  <div style={{ paddingTop: "14px", borderTop: `1px solid ${T.border}` }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "5px" }}>{c.pattern}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: "9.5px", letterSpacing: "1.2px", color: T.textMuted, textTransform: "uppercase" }}>{c.state}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "8px", fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted, letterSpacing: "1.5px", textTransform: "uppercase" }}>← Swipe to see all eight →</div>
          </Reveal>
        </section>

        <section id="convergence" style={{ padding: "clamp(40px, 7vw, 90px) 0 clamp(20px, 4vw, 50px)", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", padding: "0 clamp(20px, 5vw, 64px)", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Convergence</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 600, letterSpacing: "-0.5px", margin: "0 0 10px" }}>Six traditions, one structure.</h2>
              <p style={{ fontFamily: T.font, fontSize: "clamp(15px, 2.2vw, 17px)", color: T.textDim, maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>Six independent lineages — across continents and millennia — recognized the same underlying patterns. When traditions this different agree on the structure, the structure is not invented. It&rsquo;s recognized.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="pi-carousel-track" role="region" aria-label="Six traditions carousel">
              {TRADITION_CARDS.map((t, i) => (
                <div key={i} className="pi-carousel-card pi-tradition-card">
                  <div style={{ fontFamily: T.font, fontSize: "26px", fontWeight: 600, color: T.text, letterSpacing: "-0.3px", marginBottom: "4px" }}>{t.name}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: "16px" }}>{t.origin}</div>
                  <div style={{ fontFamily: T.font, fontSize: "16.5px", color: T.text, lineHeight: 1.6, flex: 1, marginBottom: "16px" }}>{t.insight}</div>
                  <div style={{ paddingTop: "12px", borderTop: `1px solid ${T.border}`, fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "0.5px", color: T.textMuted, lineHeight: 1.5 }}>{t.source}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "16px", padding: "0 clamp(20px, 5vw, 64px)" }}>
              <a href="/pattern-literacy" style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1.5px", color: T.accent, textDecoration: "none", textTransform: "uppercase" }}>How each tradition maps to the 12 phases →</a>
            </div>
          </Reveal>
        </section>

        <section id="shift" style={{ padding: "clamp(50px, 8vw, 100px) clamp(20px, 5vw, 64px)", maxWidth: 980, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The shift</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(30px, 4.5vw, 44px)", fontWeight: 600, letterSpacing: "-0.5px" }}>From victim to student.</h2>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {shift.map(([from, to], i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="pi-shift-row">
                  <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.textMuted, marginBottom: "8px" }}>FROM</div>
                    <div style={{ fontFamily: T.font, fontSize: "17px", color: T.textDim }}>{from}</div>
                  </div>
                  <div className="pi-shift-arrow">→</div>
                  <div style={{ padding: "18px 22px", background: "rgba(167,139,250,0.06)", borderRadius: T.radiusSm, border: "1px solid rgba(167,139,250,0.2)" }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.accent, marginBottom: "8px" }}>TO</div>
                    <div style={{ fontFamily: T.font, fontSize: "17px", color: T.text }}>{to}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Not belief. Structure.</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(27px, 4vw, 38px)", fontWeight: 600, lineHeight: 1.25, marginBottom: "22px", letterSpacing: "-0.5px" }}>The framework is twelvefold.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, lineHeight: 1.7, maxWidth: 660, margin: "0 auto" }}>
              <strong style={{ color: T.text }}>Twelve phases</strong> — one for each lunar cycle the solar year contains. Twelve chapters of curriculum, repeated across every life, every relationship, every project. Within each phase, <strong style={{ color: T.text }}>four micro-states</strong> — how any cycle begins, builds, peaks, and integrates. Six wisdom traditions, working independently, named the same transformations. This is the structure humanity has tracked since we first looked up. It is what the Institute is named for, and what it teaches you to read.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "34px" }}>
              {TRADITIONS.map((t) => <span key={t} style={{ fontFamily: T.fontMono, fontSize: "12px", letterSpacing: "1px", padding: "10px 18px", borderRadius: "999px", border: `1px solid ${T.border}`, color: T.textDim, background: "rgba(255,255,255,0.02)" }}>{t}</span>)}
            </div>
          </Reveal>
        </section>

        <section id="try-it" style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "38px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Try it now</Eyebrow></div>
              <h2 style={{ fontFamily: T.font, fontSize: "clamp(27px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Read one pattern, free.</h2>
            </div>
            <TryReading />
            <p style={{ marginTop: "22px", textAlign: "center", maxWidth: 580, marginLeft: "auto", marginRight: "auto", fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, lineHeight: 1.6, letterSpacing: "0.3px" }}>
              Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
            </p>
          </Reveal>
        </section>

        <section style={{ padding: "clamp(50px, 8vw, 100px) clamp(20px, 5vw, 64px)", maxWidth: 1180, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Where to go from here</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(27px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Four ways in.</h2>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
            {doors.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <div className="pi-card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "28px", background: d.feature ? "rgba(167,139,250,0.07)" : T.bgCard, border: d.feature ? "1px solid rgba(167,139,250,0.3)" : `1px solid ${T.border}`, borderRadius: T.radius }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: d.feature ? T.gold : T.accent, textTransform: "uppercase", marginBottom: "14px" }}>{d.eyebrow}</div>
                  <h3 style={{ fontFamily: T.font, fontSize: "25px", fontWeight: 600, marginBottom: "11px" }}>{d.title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6, flex: 1, marginBottom: "22px" }}>{d.body}</p>
                  <Btn variant={d.variant} href={d.href}>{d.cta}</Btn>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section style={{ padding: "clamp(40px, 7vw, 90px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The institute</Eyebrow></div>
            <p style={{ fontFamily: T.font, fontSize: "clamp(20px, 2.8vw, 27px)", lineHeight: 1.6, color: T.text }}>Independent by design. Funded by its own work, never sold, never venture-backed. We hold the source traditions with respect, build authority before audience, and refuse to promise what we cannot deliver.</p>
            <p style={{ fontFamily: T.font, fontSize: "clamp(15px, 2vw, 17px)", color: T.textDim, marginTop: "20px", lineHeight: 1.7, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>Twelvefold names the structure: twelve phases, forty-eight states, six traditions that independently recognized the same shape of transformation.</p>
            <p style={{ fontFamily: T.font, fontSize: "clamp(18px, 2.5vw, 22px)", color: T.accent, marginTop: "24px", fontStyle: "italic", lineHeight: 1.5 }}>Twelvefold Institute teaches pattern literacy — the ability to read the intelligent cycles governing human life and act with clarity, alignment, and purpose.</p>
          </Reveal>
        </section>

        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px) 30px", display: "flex", flexDirection: "column", gap: "26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></div>
            <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
              {([["Initiation", "/initiation"], ["Rhythms", "/rhythms"], ["Community", "/community"], ["Pattern Literacy", "/pattern-literacy"], ["Read", "/read"], ["Book", "/book"], ["Certification", "/certification"], ["Institutions", "/institutions"], ["Method", "/method"], ["Research", "/research"], ["About", "/about"]] as [string, string][]).map(([label, href]) => {
                const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (href.startsWith("#")) {
                    e.preventDefault();
                    const el = document.getElementById(href.slice(1));
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                };
                return <a key={label} href={href} onClick={handle} style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.textDim)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}>{label}</a>;
              })}
            </div>
          </div>
          <p style={{ fontFamily: T.font, fontStyle: "italic", fontSize: "15px", color: T.textDim, lineHeight: 1.55, textAlign: "center", margin: "0 auto", maxWidth: 600 }}>
            Pattern Literacy for Life, Leadership, and Transformation.
          </p>
          <p style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, lineHeight: 1.6, letterSpacing: "0.3px", maxWidth: 760, textAlign: "center", margin: "0 auto" }}>
            Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
          </p>
        </footer>
      </div>
    </div>
  );
}
