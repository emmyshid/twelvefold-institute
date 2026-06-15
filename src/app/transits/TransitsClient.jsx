"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ════════════════════════════════════════════════════════════════
// /transits — TransitsClient
// The approved transit-dial preview, wired to live data:
//   • dial driven by the real current date (phase computed client-side
//     for the visual; the authoritative phase + teachings come from
//     /api/transit)
//   • three nested rhythms (daily/weekly/monthly) with self/org lens
//   • teachings generated live by the engine, fetched on mount
// ════════════════════════════════════════════════════════════════

const T = {
  bg: "#06060F",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.66)",
  textMuted: "rgba(237,233,245,0.40)",
  border: "rgba(255,255,255,0.08)",
  card: "rgba(255,255,255,0.025)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  font: "'Crimson Text', Georgia, serif",
  mono: "'Space Mono', 'Courier New', monospace",
};

const PHASES = [
  { sign: "Capricorn", glyph: "♑", phase: "Structure", id: "capricorn", from: [12, 22], to: [1, 19] },
  { sign: "Aquarius", glyph: "♒", phase: "Liberation", id: "aquarius", from: [1, 20], to: [2, 18] },
  { sign: "Pisces", glyph: "♓", phase: "Dissolution", id: "pisces", from: [2, 19], to: [3, 20] },
  { sign: "Aries", glyph: "♈", phase: "Ignition", id: "aries", from: [3, 21], to: [4, 19] },
  { sign: "Taurus", glyph: "♉", phase: "Foundation", id: "taurus", from: [4, 20], to: [5, 20] },
  { sign: "Gemini", glyph: "♊", phase: "Intelligence", id: "gemini", from: [5, 21], to: [6, 20] },
  { sign: "Cancer", glyph: "♋", phase: "Inner Root", id: "cancer", from: [6, 21], to: [7, 22] },
  { sign: "Leo", glyph: "♌", phase: "Authority", id: "leo", from: [7, 23], to: [8, 22] },
  { sign: "Virgo", glyph: "♍", phase: "Correction", id: "virgo", from: [8, 23], to: [9, 22] },
  { sign: "Libra", glyph: "♎", phase: "Balance", id: "libra", from: [9, 23], to: [10, 22] },
  { sign: "Scorpio", glyph: "♏", phase: "Transformation", id: "scorpio", from: [10, 23], to: [11, 21] },
  { sign: "Sagittarius", glyph: "♐", phase: "Expansion", id: "sagittarius", from: [11, 22], to: [12, 21] },
];

function phaseIndexForDate(date: Date): number {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (let i = 0; i < PHASES.length; i++) {
    const [fm, fd] = PHASES[i].from;
    const [tm, td] = PHASES[i].to;
    if (fm > tm) {
      if ((m === fm && d >= fd) || (m === tm && d <= td) || m > fm || m < tm) return i;
    } else if ((m === fm && d >= fd) || (m === tm && d <= td) || (m > fm && m < tm)) {
      return i;
    }
  }
  return 0;
}

interface TransitData {
  phase: string;
  phase_id: string;
  season_teaching: string;
  self: { daily: string; weekly: string; monthly: string };
  org: { daily: string; weekly: string; monthly: string };
}

const MICRO = { daily: "Initiation", weekly: "Expansion", monthly: "Contraction" } as const;

function TransitDial({ phaseIdx, dayAngle, weekAngle }: { phaseIdx: number; dayAngle: number; weekAngle: number }) {
  const size = 340;
  const c = size / 2;
  const rimR = c - 26;
  const monthR = c - 70;
  const weekR = c - 104;
  const dayR = c - 134;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.30)" />
          <stop offset="100%" stopColor="rgba(167,139,250,0)" />
        </radialGradient>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <circle cx={c} cy={c} r={dayR} fill="url(#coreGlow)" />
      {PHASES.map((p, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = c + Math.cos(a) * rimR;
        const y = c + Math.sin(a) * rimR;
        const active = i === phaseIdx;
        return (
          <g key={p.sign}>
            <circle cx={x} cy={y} r={active ? 16 : 12}
              fill={active ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.03)"}
              stroke={active ? "#FBBF24" : "rgba(255,255,255,0.12)"} strokeWidth={active ? 1.5 : 1} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={active ? 16 : 13}
              fill={active ? "#FBBF24" : "rgba(237,233,245,0.5)"}>{p.glyph}</text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={monthR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <circle cx={c} cy={c} r={monthR} fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${monthR * 0.5} ${monthR * 8}`} transform={`rotate(${(phaseIdx / 12) * 360 - 90} ${c} ${c})`} opacity="0.9" />
      <circle cx={c} cy={c} r={weekR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <circle cx={c} cy={c} r={weekR} fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${weekR * 0.7} ${weekR * 8}`} transform={`rotate(${weekAngle} ${c} ${c})`} opacity="0.85" />
      <circle cx={c} cy={c} r={dayR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <circle cx={c} cy={c} r={dayR} fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${dayR * 0.4} ${dayR * 8}`} transform={`rotate(${dayAngle} ${c} ${c})`} />
      <circle cx={c} cy={c} r="4" fill="#FBBF24" />
    </svg>
  );
}

export default function TransitsClient() {
  const now = new Date();
  const phaseIdx = phaseIndexForDate(now);
  const activePhase = PHASES[phaseIdx];

  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const loop = () => { setT((v) => v + 0.15); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const dayAngle = (t * 2) % 360;
  const weekAngle = (t * 0.6) % 360;

  const [openRhythm, setOpenRhythm] = useState<string>("monthly");
  const [lens, setLens] = useState<"self" | "org">("self");
  const [data, setData] = useState<TransitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/transit");
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || "The transit is unavailable right now.");
        }
        const d = (await res.json()) as TransitData;
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something interrupted the transit.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const seasonTeaching = data?.season_teaching ?? "";
  const lensTeachings = data ? data[lens] : null;

  const rhythms = [
    { key: "daily", scale: "Daily transit", label: "The daily rhythm", color: T.gold },
    { key: "weekly", scale: "Weekly transit", label: "The movement of pattern through experience", color: T.accent },
    { key: "monthly", scale: "Monthly transit", label: "The dominant lesson of the season", color: "#fff" },
  ] as const;

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div aria-hidden style={{ position: "fixed", width: 620, height: 620, top: -180, left: -160, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.24), transparent 70%)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "fixed", width: 520, height: 520, bottom: -160, right: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)", filter: "blur(100px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(20px,5vw,56px) 100px" }}>
        {/* nav */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(40px,7vw,64px)" }}>
          <Link href="/" style={{ fontFamily: T.mono, fontSize: 15, letterSpacing: 1, fontWeight: 700, textDecoration: "none" }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>Institute</span>
          </Link>
          <Link href="/" style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.5, color: T.textMuted, textTransform: "uppercase", textDecoration: "none" }}>← Home</Link>
        </nav>

        {/* hero */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>● The Twelvefold transit · timing as teaching</div>
          <h1 style={{ fontFamily: T.font, fontSize: "clamp(36px,6.5vw,60px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 22px", maxWidth: 760 }}>
            Time keeps a pattern. <span style={{ fontStyle: "italic", color: T.accent }}>Learn to lead with it.</span>
          </h1>
          <p style={{ fontSize: "clamp(17px,2.4vw,20px)", lineHeight: 1.6, color: T.textDim, maxWidth: 620, fontStyle: "italic" }}>
            A transit is the reading of how the pattern of Intelligent Order expresses through time — and what this moment is asking of you, your leadership, and your organization today, this week, this season.
          </p>
        </div>

        {/* dial + season */}
        <div style={{ display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center", flexWrap: "wrap", margin: "44px 0 56px", justifyContent: "center" }}>
          <TransitDial phaseIdx={phaseIdx} dayAngle={dayAngle} weekAngle={weekAngle} />
          <div style={{ flex: "1 1 280px", minWidth: 260 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.textMuted, textTransform: "uppercase", marginBottom: 10 }}>This season&rsquo;s teaching</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 40, color: T.gold }}>{activePhase.glyph}</span>
              <div>
                <div style={{ fontFamily: T.font, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{activePhase.phase}</div>
                <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, color: T.textMuted, textTransform: "uppercase", marginTop: 4 }}>{activePhase.sign} · phase {((phaseIdx + 9) % 12) + 1} of 12</div>
              </div>
            </div>
            {seasonTeaching && (
              <p style={{ fontFamily: T.font, fontSize: 19, fontStyle: "italic", color: T.text, lineHeight: 1.5, marginTop: 16, paddingLeft: 16, borderLeft: `2px solid ${T.gold}` }}>
                &ldquo;{seasonTeaching}&rdquo;
              </p>
            )}
            <p style={{ fontFamily: T.font, fontSize: 15, color: T.textDim, lineHeight: 1.6, marginTop: 14 }}>
              The same lesson scales: from a single decision, to how you lead, to how an organization moves through its season.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 24, fontFamily: T.mono, fontSize: 10, letterSpacing: 1, color: T.textMuted, textTransform: "uppercase", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 18, height: 3, background: T.gold, borderRadius: 9, display: "inline-block" }} /> Day</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 18, height: 3, background: T.accent, borderRadius: 9, display: "inline-block" }} /> Week</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 18, height: 3, background: "linear-gradient(90deg,#A78BFA,#FBBF24)", borderRadius: 9, display: "inline-block" }} /> Month</span>
            </div>
          </div>
        </div>

        {/* lens toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 999, padding: 3, gap: 2 }}>
            {([["self", "For you"], ["org", "For your organization"]] as const).map(([id, lbl]) => (
              <button key={id} onClick={() => setLens(id)} style={{
                padding: "8px 18px", borderRadius: 999, fontFamily: T.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                background: lens === id ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "transparent",
                color: lens === id ? "#1a1206" : T.textDim, border: "none", cursor: "pointer", fontWeight: 700, transition: "all 0.25s ease",
              }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, color: T.accent, textTransform: "uppercase", fontWeight: 700, textAlign: "center", marginBottom: 20 }}>— Three rhythms, one order —</div>

        {/* loading / error / rhythms */}
        {loading ? (
          <div style={{ textAlign: "center", fontFamily: T.mono, fontSize: 12, letterSpacing: 1, color: T.textMuted, padding: "40px 0" }}>Reading the transit…</div>
        ) : error ? (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 16, textAlign: "center", fontFamily: T.font, fontSize: 16, color: "#FF9B9B" }}>{error}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760, margin: "0 auto" }}>
            {rhythms.map((r) => {
              const open = openRhythm === r.key;
              const body = lensTeachings ? lensTeachings[r.key as "daily" | "weekly" | "monthly"] : "";
              return (
                <button key={r.key} onClick={() => setOpenRhythm(open ? "" : r.key)} style={{
                  textAlign: "left", width: "100%", cursor: "pointer",
                  background: open ? "rgba(255,255,255,0.035)" : T.card,
                  border: `1px solid ${open ? "rgba(167,139,250,0.3)" : T.border}`,
                  borderRadius: 16, padding: "22px 26px", color: "inherit", font: "inherit", transition: "all 0.25s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: r.color === "#fff" ? T.text : r.color, fontWeight: 700, marginBottom: 6 }}>{r.scale}</div>
                      <div style={{ fontFamily: T.font, fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{r.label}</div>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 18, color: T.textMuted, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}>+</span>
                  </div>
                  {open && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                      <p style={{ fontFamily: T.font, fontSize: 17, color: T.textDim, lineHeight: 1.7, margin: 0 }}>{body}</p>
                      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.5, color: T.gold, textTransform: "uppercase", marginTop: 14 }}>Micro-state · {MICRO[r.key as "daily" | "weekly" | "monthly"]}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* honest framing */}
        <div style={{ marginTop: 56, padding: "26px 30px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.gold, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>Pattern Literacy for life, leadership &amp; transformation</div>
          <p style={{ fontFamily: T.font, fontSize: 16, color: T.textDim, lineHeight: 1.7, margin: 0 }}>
            The zodiac names are borrowed labels for the twelve phases of Intelligent Order — not a claim that planets exert force on anyone. A transit is read as timing, not prophecy: the day&rsquo;s rhythm, the week&rsquo;s movement, the season&rsquo;s dominant lesson. The same pattern that governs a life governs a team, a launch, a leadership arc. Timing as curriculum — for individuals and organizations alike.
          </p>
        </div>

        {/* disclaimer */}
        <p style={{ marginTop: 48, textAlign: "center", fontFamily: T.mono, fontSize: 11, color: T.textMuted, lineHeight: 1.6, letterSpacing: 0.3 }}>
          Pattern Literacy is an educational and reflective framework. It is not therapy, medical care, diagnosis, financial advice, or a substitute for professional support.
        </p>
      </div>
    </div>
  );
}
