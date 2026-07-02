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
  return <button onClick={handleClick} style={{ padding: "14px 30px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "12.5px", letterSpacing: "0.8px", cursor: "pointer", background: v.background, color: v.color, border: v.border, ...style }}>{children}</button>;
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "3px", color: color || T.accent, textTransform: "uppercase", marginBottom: "18px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />{children}</div>;
}

export default function InstitutionsPage() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", role: "", scope: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.organization.trim()) {
      setError("Name, email, and organization are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/institutions/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
      setSubmitted(true);
      setForm({ name: "", email: "", organization: "", role: "", scope: "", message: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const offerings = [
    {
      eyebrow: "Diagnostic",
      title: "Read your organization's phase",
      body: "A full reading of where your organization actually is, what the phase is asking, and which moves cooperate with it. Six weeks. Includes leadership session and written diagnostic.",
      range: "$50K — $90K",
      color: T.accent,
    },
    {
      eyebrow: "Framework licensing",
      title: "Bring Twelvefold in-house",
      body: "License the framework for use inside your organization. Internal training of your facilitators, customized materials, ongoing support. Multi-year terms.",
      range: "$150K — $300K / year",
      color: T.gold,
      feature: true,
    },
    {
      eyebrow: "Strategic partnership",
      title: "Deep institutional integration",
      body: "Embed pattern literacy into your operating rhythm. Recurring leadership readings, certified internal practitioners, custom diagnostic instruments, joint research.",
      range: "$300K — $500K+ / year",
      color: T.accentDark,
    },
  ];

  const useCases = [
    ["Schools and educational systems", "Read the institutional phase, identify which capacity the curriculum is actually building, and align governance with what the moment is asking."],
    ["Healthcare systems", "Diagnostic frameworks for clinical teams, leadership development, and reading the phase a department is in before restructuring."],
    ["Mission-driven organizations", "Strategic clarity at inflection points, succession planning aligned to phase, and frameworks for sustained institutional renewal."],
    ["Founder-led companies", "Read the phase you and the company are actually in. Most strategic mistakes come from reading the wrong phase."],
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
        <header style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px) clamp(24px, 4vw, 40px)", maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <Reveal><div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Read the pattern. Align with the order.</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontFamily: T.font, fontSize: "clamp(36px, 6.5vw, 64px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-1px" }}>Read your organization's<br />phase.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 20px)", color: T.textDim, maxWidth: 640, margin: "20px auto 0", lineHeight: 1.6 }}>
              Schools, healthcare systems, mission-driven organizations, and founder-led companies move through the same cycles people do. We diagnose the phase, name what it is asking, and license the Twelvefold framework for your context.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
              <Btn variant="gold" onClick={() => document.getElementById("consult")?.scrollIntoView({ behavior: "smooth" })}>Request a consult</Btn>
            </div>
          </Reveal>
        </header>

        {/* Sector-specific paths — audience-aware entry points */}
        <section style={{ padding: "clamp(20px, 4vw, 40px) clamp(20px, 5vw, 64px)", maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Sector-specific paths</Eyebrow></div>
              <p style={{ fontFamily: T.font, fontSize: "clamp(15px, 2vw, 17px)", color: T.textDim, lineHeight: 1.6, maxWidth: 620, margin: "8px auto 0" }}>
                We speak in sector-specific language on these pages. If you&rsquo;re a school leader, healthcare executive, or corporate CLO, start here.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {[
                { href: "/for-institutions/schools", label: "Schools & universities", body: "K-12, higher ed, educational foundations." },
                { href: "/for-institutions/healthcare", label: "Healthcare systems", body: "Hospitals, clinical teams, health system leadership." },
                { href: "/for-institutions/corporate", label: "Corporate leadership", body: "Executive teams, CLOs, HR, org development." },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  style={{
                    display: "block",
                    padding: "22px 22px",
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${T.border}`,
                    borderRadius: "12px",
                    textDecoration: "none",
                    transition: `border-color 0.25s ${T.ease}, transform 0.25s ${T.ease}`,
                  }}
                >
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>{s.label}</div>
                  <div style={{ fontFamily: T.font, fontSize: "14.5px", color: T.textDim, lineHeight: 1.55, marginBottom: "10px" }}>{s.body}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.accent, letterSpacing: "0.5px" }}>→</div>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        {/* The premise */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>The premise</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: "20px" }}>Most strategic failures are phase misreads.</h2>
            <p style={{ fontFamily: T.font, fontSize: "clamp(17px, 2.4vw, 19px)", color: T.textDim, lineHeight: 1.7 }}>
              An organization in <em>Construction</em> is treated as if it needs <em>Expansion</em>. A team in <em>Correction</em> is told to <em>Liberate</em>. A founder in <em>Dissolution</em> is asked to <em>Ignite</em>. The strategy is sound for the phase the organization is not in. We help leaders read which phase is actually present, what it is asking of them, and what cooperation looks like.
            </p>
          </Reveal>
        </section>

        {/* Three offerings */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 1100, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Three ways to engage</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Scope to your moment.</h2>
          </div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
            {offerings.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div className="pi-card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "28px", background: o.feature ? "rgba(167,139,250,0.07)" : T.bgCard, border: o.feature ? "1px solid rgba(167,139,250,0.3)" : `1px solid ${T.border}`, borderRadius: T.radius, borderTop: `3px solid ${o.color}` }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: o.color, textTransform: "uppercase", marginBottom: "14px" }}>{o.eyebrow}</div>
                  <h3 style={{ fontFamily: T.font, fontSize: "23px", fontWeight: 600, marginBottom: "12px", lineHeight: 1.25 }}>{o.title}</h3>
                  <p style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6, flex: 1, marginBottom: "20px" }}>{o.body}</p>
                  <div style={{ fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px", color: T.gold }}>{o.range}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 820, margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Where it fits</Eyebrow></div>
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Built for serious institutions.</h2>
          </div></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {useCases.map(([who, why], i) => (
              <Reveal key={who} delay={i * 0.06}>
                <div style={{ padding: "22px 26px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusSm }}>
                  <div style={{ fontFamily: T.font, fontSize: "19px", fontWeight: 600, color: T.text, marginBottom: "6px" }}>{who}</div>
                  <div style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6 }}>{why}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Consult form */}
        <section id="consult" style={{ padding: "clamp(40px, 7vw, 80px) clamp(20px, 5vw, 64px)", maxWidth: 640, margin: "0 auto" }}>
          <Reveal>
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "clamp(28px, 5vw, 42px)" }}>
              <div style={{ textAlign: "center", marginBottom: "26px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow>Start a conversation</Eyebrow></div>
                <h2 style={{ fontFamily: T.font, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.5px" }}>Request a consult.</h2>
                <p style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, marginTop: "10px", lineHeight: 1.6 }}>Licensing partnerships begin with a conversation, not a checkout. We respond within five business days.</p>
              </div>
              {!submitted ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                    <input type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                  </div>
                  <input type="text" placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} style={inputStyle} />
                  <input type="text" placeholder="Your role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle} />
                  <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} style={inputStyle}>
                    <option value="">Likely scope —</option>
                    <option value="diagnostic">Diagnostic ($50K–$90K)</option>
                    <option value="licensing">Framework licensing ($150K–$300K/yr)</option>
                    <option value="partnership">Strategic partnership ($300K–$500K+/yr)</option>
                    <option value="exploring">Exploring fit</option>
                  </select>
                  <textarea placeholder="What is your organization facing right now? What kind of phase do you think you're in?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
                  {error && <div style={{ padding: "12px 14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: T.radiusSm, fontFamily: T.font, fontSize: "14px", color: "#FF9B9B" }}>{error}</div>}
                  <Btn variant="gold" onClick={submit} style={{ width: "100%", opacity: submitting ? 0.6 : 1 }}>{submitting ? "Submitting…" : "Request consult"}</Btn>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontFamily: T.font, fontSize: "24px", fontStyle: "italic", color: T.gold, marginBottom: "12px" }}>✓ Consult requested.</div>
                  <div style={{ fontFamily: T.font, fontSize: "16px", color: T.textDim, lineHeight: 1.6 }}>We respond within five business days. Watch your work email — including spam folder.</div>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px clamp(20px, 5vw, 64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px", marginTop: "40px" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "13px", letterSpacing: "1px" }}><span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span></a>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <a href="/pattern-literacy" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Pattern Literacy</a>
            <a href="/certification" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Certification</a>
            <a href="/about" style={{ fontFamily: T.fontMono, fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>About</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 15px",
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${T.border}`,
  borderRadius: T.radiusSm,
  color: T.text,
  fontFamily: T.font,
  fontSize: "16px",
  outline: "none",
};
