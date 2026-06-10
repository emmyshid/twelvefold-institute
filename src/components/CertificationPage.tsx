"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

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

function CertSeal() {
  const size = 280, c = size / 2, r = 110;
  return (
    <div style={{ position: "relative", width: "min(260px, 64vw)", aspectRatio: "1 / 1", margin: "0 auto" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="sealGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" strokeDasharray="3 7" />
        <circle cx={c} cy={c} r={r - 13} fill="none" stroke="url(#sealGrad)" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const an = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={c + (r - 13) * Math.cos(an)} cy={c + (r - 13) * Math.sin(an)} r="2.4" fill="#FBBF24" />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16%" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "8px", letterSpacing: "3px", color: T.gold, textTransform: "uppercase" }}>Certified</div>
        <div style={{ fontFamily: T.font, fontSize: "clamp(17px, 4.5vw, 22px)", fontStyle: "italic", color: T.text, lineHeight: 1.1, margin: "5px 0" }}>Twelvefold Practitioner</div>
        <div style={{ fontFamily: T.fontMono, fontSize: "8px", letterSpacing: "2px", color: T.textMuted }}>200 HOURS</div>
      </div>
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, style }: { children: ReactNode; variant?: Variant; onClick?: () => void; style?: CSSProperties }) {
  const variants: Record<Variant, { background: string; color: string; border: string; glow: string }> = {
    primary: { background: T.grad, color: "#fff", border: "none", glow: "rgba(124,58,237,0.4)" },
    gold: { background: T.gradGold, color: "#1a1206", border: "none", glow: "rgba(251,191,36,0.35)" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}`, glow: "rgba(167,139,250,0.25)" },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", background: v.background, color: v.color, border: v.border, ...style }}>
      {children}
    </button>
  );
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.gold, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />{children}</div>;
}

export default function CertificationPage() {
  const [form, setForm] = useState({ name: "", email: "", motivation: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function submitApp() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/certification/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
      setSubmitted(true);
      setForm({ name: "", email: "", motivation: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const outcomes = [
    "Read your own patterns with depth and precision",
    "Hold a 90-minute reading session for a client",
    "Identify the phase and micro-state from a real situation",
    "Apply the six wisdom traditions without flattening them",
    "Recognize when a pattern is curriculum vs. crisis",
    "Build a sustainable practice on the framework",
  ];

  const curriculum = [
    { phase: "Phase I · Foundation", weeks: "Weeks 1–2", hours: "40h", mode: "Self-paced", color: T.accent, modules: [
      ["Module 1", "Core Teaching", "15h"],
      ["Module 2", "Pattern Recognition Basics", "15h"],
      ["Module 3", "Wisdom Traditions Overview", "10h"],
    ] },
    { phase: "Phase II · Framework", weeks: "Weeks 3–6", hours: "80h", mode: "Cohort + live sessions", color: T.accentDark, modules: [
      ["Module 4", "The 12 Phases Deep Dive", "40h"],
      ["Module 5", "Micro-States, Timing & Case Work", "40h"],
    ] },
    { phase: "Phase III · Application", weeks: "Weeks 7+", hours: "80h", mode: "Supervised practicum", color: T.gold, modules: [
      ["Module 6", "Supervised Practicum", "—"],
      ["Module 7", "Certification Deliverables", "—"],
      ["Module 8", "Final Review", "—"],
    ] },
  ];

  const faq = [
    ["Do I need to believe in astrology to take this?", "No. The 12 phases follow the solar year — twelve lunar cycles, the structure humanity has tracked for millennia. We use astronomical structure, not horoscope interpretation. You don't need to believe anything spiritual to read patterns. The framework rests on observable cycles."],
    ["Who is this for?", "Therapists, coaches, consultants, spiritual directors, and serious lay practitioners. Anyone who already does the work of helping others see clearly, and wants a structural framework that holds up across traditions."],
    ["What does the $6,500 cover?", "All 200 hours of instruction, cohort access, live sessions, supervised practicum, certification review, and lifetime access to the materials and updates. Payment plans available on application."],
    ["How rigorous is it?", "Very. You will write case reports, sit live readings, and demonstrate competency before certification. We are building practitioners, not certificate holders."],
    ["When does the next cohort start?", "Cohorts run two or three times per year. Apply now to be considered for the next opening."],
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
        .pi-card:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.35); }
      `}</style>

      <Starfield />

      <div style={{ position: "relative", zIndex: 3 }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px clamp(20px, 5vw, 64px)", gap: "16px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span>
          </div>
          <Btn variant="ghost" style={{ padding: "10px 20px" }}>← Back to home</Btn>
        </nav>

        <header style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(24px, 4vw, 40px)", maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <Reveal><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Practitioner Certification</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(36px, 6.5vw, 64px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-1px" }}>Learn to read patterns<br />for others.</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 20px)", color: T.textDim, maxWidth: 600, margin: "20px auto 0", lineHeight: 1.6 }}>A 200-hour cohort program. Rigorous, supervised, grounded in six wisdom traditions.</p>
            <div style={{ display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap", marginTop: "28px", fontFamily: T.fontMono, fontSize: "12px", color: T.textDim }}>
              <span>200 hours</span>
              <span style={{ color: T.textMuted }}>·</span>
              <span>8–16 weeks</span>
              <span style={{ color: T.textMuted }}>·</span>
              <span style={{ color: T.gold }}>$6,500</span>
            </div>
            <div style={{ marginTop: "30px" }}>
              <Btn variant="gold" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>Apply for the next cohort</Btn>
            </div>
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: "clamp(40px, 7vw, 60px)" }}><CertSeal /></Reveal>
        </header>

        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 980, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.accent}>What you will be able to do</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Six practitioner capabilities.</h2>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {outcomes.map((o, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="pi-card" style={{ padding: "20px 22px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.gold, flexShrink: 0, marginTop: "3px" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: 1.5 }}>{o}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 980, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.accent}>The curriculum</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Three phases. Two hundred hours.</h2>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {curriculum.map((p, i) => (
              <Reveal key={p.phase} delay={i * 0.08}>
                <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "24px 28px", borderLeft: `4px solid ${p.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontFamily: T.font, fontSize: "22px", fontWeight: 600 }}>{p.phase}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: "13px", color: T.gold }}>{p.hours}</span>
                  </div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1px", color: T.textDim, marginBottom: "16px" }}>{p.weeks} · {p.mode}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.modules.map(([m, name, h], j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 14px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm }}>
                        <div><span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted, marginRight: "10px" }}>{m}</span><span style={{ fontFamily: T.font, fontSize: "16px", color: T.text }}>{name}</span></div>
                        <span style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textDim }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Investment</Eyebrow></div>
            <div style={{ fontFamily: T.font, fontSize: "clamp(48px, 9vw, 78px)", fontWeight: 600, color: T.gold, letterSpacing: "-2px", marginBottom: "8px" }}>$6,500</div>
            <p style={{ fontFamily: T.font, fontSize: "18px", color: T.textDim, lineHeight: 1.6 }}>Includes all 200 hours of instruction, cohort access, live sessions, supervised practicum, certification review, and lifetime access to materials and updates. Payment plans available on application.</p>
          </Reveal>
        </section>

        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow color={T.accent}>Questions</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Common questions, honest answers.</h2>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {faq.map(([q, a], i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", color: T.text }}>
                    <span style={{ fontFamily: T.font, fontSize: "18px", fontWeight: 600 }}>{q}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: "18px", color: T.accent, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 22px", fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.65 }}>{a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="apply" style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "clamp(28px, 5vw, 42px)" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Apply</Eyebrow></div>
                <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Apply for the next cohort.</h2>
                <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, marginTop: "10px" }}>We respond to every application within 48 hours.</p>
              </div>
              {!submitted ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "13px 15px", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "16px" }} />
                  <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "13px 15px", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "16px" }} />
                  <textarea placeholder="What draws you to pattern literacy? Tell us about your background and why you want to read patterns for others." value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} rows={5} style={{ width: "100%", boxSizing: "border-box", padding: "13px 15px", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "16px", resize: "vertical", lineHeight: 1.5 }} />
                  {error && <div style={{ padding: "12px 14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: T.radiusSm, fontFamily: T.font, fontSize: "14px", color: "#FF9B9B" }}>{error}</div>}
                  <Btn variant="gold" onClick={submitApp} style={{ width: "100%", opacity: submitting || !form.name.trim() || !form.email.trim() ? 0.55 : 1 }}>{submitting ? "Submitting…" : "Submit application"}</Btn>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontFamily: T.font, fontSize: "22px", fontStyle: "italic", color: T.gold, marginBottom: "10px" }}>✓ Application received.</div>
                  <div style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6 }}>We respond within 48 hours. Watch your email — including spam folder.</div>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px", marginTop: "40px" }}>
          <div style={{ fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></div>
          <div style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted }}>twelvefold.institute</div>
        </footer>
      </div>
    </div>
  );
}
