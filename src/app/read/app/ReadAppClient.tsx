"use client";

import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import CoordinateReading from "@/components/CoordinateReading";

// ════════════════════════════════════════════════════════════════
// PatternOS — the actual reading app, behind Clerk auth.
// Three columns on desktop: HISTORY · COMPOSER · READING
// Stacked on mobile.
//
// Phase 1 (this build):
//   • Diagnostic input + pattern reading via /api/reading
//   • History pulled from Postgres via /api/readings
//   • Tiered reveal animation for the reading display
//   • Pattern Summary first (felt layer), Technical below
//
// Phase 2 status:
//   • Master/Client mode — ✅ BUILT (client CRM, sessions, email-to-client)
//   • Per-phase recurrence digest — ✅ BUILT (this update)
//   • Dream Reading — ✅ BUILT (dream-tuned input + reading structure)
//   • Live session codes — pending (real-time practitioner↔client sync)
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

interface PatternSummary {
  pattern_name?: string;
  phase?: string;
  phase_number?: number;
  phase_id?: string;
  micro_state?: string;
  state_code?: string;
  archetype?: string;
  life_area?: string;
  // Legacy fallback fields
  likely_curriculum?: string;
  active_lesson?: string;
  recommended_participation?: string;
}

interface Recognition {
  what_is_happening?: string;
  evidence_from_their_words?: string[];
}

interface Teaching {
  core_teaching?: string;
  what_is_being_asked?: string;
  tradition_wisdom?: string;
  existential_permission?: string;
}

interface Alignment {
  status?: "Aligned" | "Misaligned" | "Unclear" | "Testing";
  reading?: string;
  signs_of_alignment?: string;
  signs_of_misalignment?: string;
}

interface Participation {
  recommended_participation?: string;
  what_to_avoid?: string;
  pattern_rule?: string;
}

interface SixTraditions {
  ifa?: string;
  kabbalah?: string;
  i_ching?: string;
  scripture?: string;
  buddhism?: string;
  hermetic?: string;
}

// Legacy "technical" structure from v1 reading shape — kept so existing
// history items render without crashing.
interface TechnicalReading {
  phase_nature?: string;
  micro_state_work?: string;
  what_to_do?: string;
  what_to_avoid?: string;
  the_unseen?: string;
}

interface FullReading {
  summary: PatternSummary;
  recognition?: Recognition;
  teaching?: Teaching;
  alignment?: Alignment;
  participation?: Participation;
  traditions?: SixTraditions;
  // Legacy:
  technical?: TechnicalReading;
}

// Dream reading result — dream-specific layer plus the shared summary,
// teaching, participation, and six-traditions layers.
interface DreamLayer {
  symbols?: { image: string; meaning: string }[];
  emotional_tone?: string;
  phase_commentary?: string;
  waking_life_bridge?: string;
}
interface DreamResult {
  summary: PatternSummary;
  dream: DreamLayer;
  teaching?: Teaching;
  participation?: Participation;
  traditions?: SixTraditions;
}

interface PerceptionLayer {
  law: string;
  law_short: string;
  tradition: string;
  tradition_note: string;
  everywhere: {
    nature: string;
    society: string;
    body: string;
    spirit: string;
  };
  corresponding_structures: Array<{
    structure_id: string;
    structure_name: string;
    correspondence: string;
  }>;
  articulation_prompt: string;
  recurrence_signature: string;
}

interface HistoryItem {
  id: string;
  input: string;
  patternName: string | null;
  phase: string | null;
  microState: string | null;
  curriculum: string | null;
  activeLesson: string | null;
  recommendedParticipation: string | null;
  raw: unknown;
  clientId?: string | null;
  sentToClientAt?: string | null;
  createdAt: string;
}

interface ClientRecord {
  id: string;
  name: string;
  email: string | null;
  notes: string | null;
  archived: boolean;
  createdAt: string;
}

type Mode = "personal" | "practitioner";

// ─── Atoms ───────────────────────────────────────────────────
function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "2.5px",
        color: color || T.accent,
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.gold, display: "inline-block" }} />
      {children}
    </div>
  );
}

function Btn({
  children,
  variant = "primary",
  onClick,
  href,
  disabled,
  className,
  style,
}: {
  children: ReactNode;
  variant?: "primary" | "gold" | "ghost";
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const variants = {
    primary: { background: T.grad, color: "#fff", border: "none" },
    gold: { background: T.gradGold, color: "#1a1206", border: "none" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
  };
  const v = variants[variant];
  const handle = () => {
    if (disabled) return;
    if (onClick) return onClick();
    if (href) window.location.href = href;
  };
  return (
    <button
      onClick={handle}
      disabled={disabled}
      className={className}
      style={{
        padding: "12px 26px",
        borderRadius: "999px",
        fontFamily: T.fontMono,
        fontSize: "12px",
        letterSpacing: "0.8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        background: v.background,
        color: v.color,
        border: v.border,
        transition: "all 0.25s " + T.ease,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Reading display (6 layers, v10 schema parity) ─────────────────
function ReadingDisplay({ full, situation, onPerception }: { full: FullReading; situation: string; onPerception: (p: PerceptionLayer) => void }) {
  const { summary, recognition, teaching, alignment, participation, traditions, technical } = full;
  const [visibleTiers, setVisibleTiers] = useState(0);
  const [openTradition, setOpenTradition] = useState<string | null>(null);
  const [showAlignment, setShowAlignment] = useState(false);
  const [activeReadingTab, setActiveReadingTab] = useState<"reading" | "perception">("reading");
  const [perception, setPerception] = useState<PerceptionLayer | null>(null);
  const [perceptionLoading, setPerceptionLoading] = useState(false);
  const [perceptionError, setPerceptionError] = useState<string | null>(null);
  const [articulationText, setArticulationText] = useState("");
  const [articulationSaved, setArticulationSaved] = useState(false);

  // Detect which schema this reading uses — new (v10-parity) or legacy
  const hasV10 = !!recognition?.what_is_happening || !!teaching?.core_teaching;
  const hasTechnical = !!technical?.phase_nature;
  const hasTraditions = !!traditions?.ifa;

  useEffect(() => {
    setVisibleTiers(0);
    setOpenTradition(null);
    setShowAlignment(false);
    setActiveReadingTab("reading");
    setPerception(null);
    setPerceptionLoading(false);
    setPerceptionError(null);
    setArticulationText("");
    setArticulationSaved(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleTiers(8);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 8; i++) {
      timers.push(setTimeout(() => setVisibleTiers((v) => Math.max(v, i)), i * 280));
    }
    return () => timers.forEach(clearTimeout);
  }, [summary.pattern_name, summary.phase]);

  async function runPerception() {
    if (perceptionLoading) return;
    setPerceptionLoading(true);
    setPerceptionError(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          depth: "perception",
          phase: summary.phase ?? "",
          microState: summary.micro_state ?? "",
          patternName: summary.pattern_name ?? "",
          teaching: full.teaching?.core_teaching ?? full.teaching?.what_is_being_asked ?? "",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Perception layer unavailable");
      }
      const data: PerceptionLayer = await res.json();
      setPerception(data);
      setActiveReadingTab("perception");
      onPerception(data);
    } catch (e) {
      setPerceptionError(e instanceof Error ? e.message : "Something interrupted the reading.");
    } finally {
      setPerceptionLoading(false);
    }
  }

  const DOMAIN_LABELS: Array<[keyof PerceptionLayer["everywhere"], string, string]> = [
    ["nature",  "Nature",  "#4ADE80"],
    ["society", "Society", "#60A5FA"],
    ["body",    "Body",    "#F472B6"],
    ["spirit",  "Spirit",  "#FBBF24"],
  ];

  const tier = (idx: number, content: ReactNode) => (
    <div
      style={{
        opacity: visibleTiers >= idx ? 1 : 0,
        transform: visibleTiers >= idx ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.6s ${T.ease}, transform 0.6s ${T.ease}`,
      }}
    >
      {content}
    </div>
  );

  // Build a metadata strip (phase · micro · archetype · life_area)
  const metaParts: string[] = [];
  if (summary.phase) metaParts.push(summary.phase);
  if (summary.micro_state) metaParts.push(summary.micro_state);
  if (summary.state_code) metaParts.push(summary.state_code);
  if (summary.life_area) metaParts.push(summary.life_area);

  const ALIGNMENT_COLORS: Record<string, string> = {
    Aligned: "#4ADE80",
    Misaligned: "#FF6B6B",
    Unclear: T.accent,
    Testing: T.gold,
  };
  const alignColor =
    (alignment?.status && ALIGNMENT_COLORS[alignment.status]) || T.accent;

  const TRADITION_LABELS: Array<[keyof SixTraditions, string]> = [
    ["ifa", "Ifá"],
    ["kabbalah", "Kabbalah"],
    ["i_ching", "I Ching"],
    ["scripture", "Scripture"],
    ["buddhism", "Buddhism"],
    ["hermetic", "Hermetic"],
  ];

  // ─── Layer building blocks ──────────────────────────────
  const field = (label: string, value?: string | null, accent?: string) =>
    value ? (
      <div
        style={{
          padding: "18px 22px",
          background: "rgba(255,255,255,0.025)",
          borderRadius: T.radiusSm,
          borderLeft: `2px solid ${accent || "rgba(167,139,250,0.4)"}`,
        }}
      >
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "9px",
            letterSpacing: "2px",
            color: accent || T.accent,
            textTransform: "uppercase",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: T.font, fontSize: "16.5px", color: T.text, lineHeight: 1.65 }}>
          {value}
        </div>
      </div>
    ) : null;

  const sectionHeader = (label: string) => (
    <div
      style={{
        fontFamily: T.fontMono,
        fontSize: "10px",
        letterSpacing: "2.5px",
        color: T.gold,
        textTransform: "uppercase",
        fontWeight: 700,
        textAlign: "center",
        padding: "10px 0 4px",
        opacity: 0.85,
      }}
    >
      — {label} —
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* ════════ TAB STRIP ════════ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", borderBottom: `1px solid ${T.border}`, paddingBottom: "14px", marginBottom: "4px" }}>
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "999px", padding: "3px", gap: "2px" }}>
          {(["reading", "perception"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveReadingTab(tab)}
              disabled={tab === "perception" && !perception}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                fontFamily: T.fontMono,
                fontSize: "10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                background: activeReadingTab === tab ? T.gradGold : "transparent",
                color: activeReadingTab === tab ? "#1a1206" : (tab === "perception" && !perception ? T.textMuted : T.textDim),
                border: "none",
                cursor: tab === "perception" && !perception ? "default" : "pointer",
                transition: "all 0.25s " + T.ease,
                opacity: tab === "perception" && !perception && !perceptionLoading ? 0.5 : 1,
              }}
            >
              {tab === "reading" ? "Reading" : "✦ Intelligent Order"}
            </button>
          ))}
        </div>
        {/* Perception trigger button — only when reading tab is active and no perception yet */}
        {activeReadingTab === "reading" && !perception && (
          <button
            onClick={runPerception}
            disabled={perceptionLoading}
            style={{
              padding: "7px 18px",
              borderRadius: "999px",
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              background: perceptionLoading ? "rgba(167,139,250,0.10)" : "rgba(167,139,250,0.12)",
              color: perceptionLoading ? T.textMuted : T.accent,
              border: `1px solid ${T.accent}44`,
              cursor: perceptionLoading ? "wait" : "pointer",
              transition: "all 0.25s " + T.ease,
            }}
          >
            {perceptionLoading ? "Reading the law…" : "Reveal Intelligent Order →"}
          </button>
        )}
        {perceptionError && (
          <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: "#FF9B9B", letterSpacing: "0.5px" }}>{perceptionError}</span>
        )}
      </div>

      {/* ════════ PERCEPTION TAB ════════ */}
      {activeReadingTab === "perception" && perception && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* The Law */}
          <div style={{ padding: "24px 26px", background: "linear-gradient(135deg, rgba(167,139,250,0.10), rgba(251,191,36,0.06))", border: `1px solid ${T.accent}33`, borderRadius: T.radius }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2.5px", color: T.gold, textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>The Intelligent Order</div>
            <div style={{ fontFamily: T.font, fontSize: "clamp(18px, 3vw, 24px)", fontStyle: "italic", color: T.text, lineHeight: 1.5, marginBottom: "16px" }}>{perception.law}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: T.gold, textTransform: "uppercase" }}>{perception.tradition}</span>
              <span style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim }}>{perception.tradition_note}</span>
            </div>
          </div>

          {/* Everywhere */}
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2.5px", color: T.textMuted, textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>This Law Everywhere</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
              {DOMAIN_LABELS.map(([key, label, color]) => (
                <div key={key} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: `1px solid ${color}22`, borderRadius: T.radiusSm, borderLeft: `2px solid ${color}` }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color, textTransform: "uppercase", marginBottom: "6px", fontWeight: 700 }}>{label}</div>
                  <div style={{ fontFamily: T.font, fontSize: "14px", color: T.text, lineHeight: 1.55 }}>{perception.everywhere[key]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Corresponding Structures */}
          {perception.corresponding_structures?.length > 0 && (
            <div>
              <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2.5px", color: T.textMuted, textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>Corresponding Structures</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {perception.corresponding_structures.map((s) => (
                  <div key={s.structure_id} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm }}>
                    <div style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "10px", background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.fontMono, fontSize: "11px", color: T.accent }}>
                      {s.structure_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "0.5px", color: T.accent, fontWeight: 700 }}>{s.structure_name}</span>
                        <a href="/portal" target="_blank" rel="noopener noreferrer" style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1px", color: T.gold, textDecoration: "none", opacity: 0.8 }}>Study in Portal →</a>
                      </div>
                      <div style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim, lineHeight: 1.55 }}>{s.correspondence}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articulation */}
          <div style={{ padding: "20px 22px", background: "rgba(251,191,36,0.05)", border: `1px solid rgba(251,191,36,0.20)`, borderRadius: T.radiusSm }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2.5px", color: T.gold, textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>Name the Law</div>
            <div style={{ fontFamily: T.font, fontSize: "15px", fontStyle: "italic", color: T.text, lineHeight: 1.65, marginBottom: "14px" }}>{perception.articulation_prompt}</div>
            <textarea
              value={articulationText}
              onChange={(e) => { setArticulationText(e.target.value); setArticulationSaved(false); }}
              rows={3}
              placeholder="Write the law as you understand it from your own experience…"
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: "15px", padding: "12px 14px", resize: "vertical", outline: "none", lineHeight: 1.6 }}
            />
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
              <button
                onClick={() => {
                  if (!articulationText.trim()) return;
                  try { localStorage.setItem(`tfi-articulation-${summary.state_code || summary.phase}`, JSON.stringify({ text: articulationText, ts: new Date().toISOString(), law: perception.law_short })); } catch {}
                  setArticulationSaved(true);
                }}
                disabled={!articulationText.trim()}
                style={{ padding: "8px 20px", borderRadius: "999px", fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", background: articulationSaved ? "rgba(74,222,128,0.15)" : T.gradGold, color: articulationSaved ? "#4ADE80" : "#1a1206", border: articulationSaved ? "1px solid rgba(74,222,128,0.3)" : "none", cursor: articulationText.trim() ? "pointer" : "not-allowed", opacity: articulationText.trim() ? 1 : 0.5 }}>
                {articulationSaved ? "✓ Saved" : "Save articulation"}
              </button>
              <span style={{ fontFamily: T.fontMono, fontSize: "9px", color: T.textMuted, letterSpacing: "0.5px" }}>Saved locally · becomes your grimoire over time</span>
            </div>
          </div>

          {/* Recurrence signature */}
          <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm }}>
            <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2.5px", color: T.textMuted, textTransform: "uppercase", marginBottom: "8px", fontWeight: 700 }}>Recognize it next time</div>
            <div style={{ fontFamily: T.font, fontSize: "14.5px", color: T.textDim, lineHeight: 1.65, fontStyle: "italic" }}>{perception.recurrence_signature}</div>
          </div>

        </div>
      )}

      {/* ════════ READING TAB — original tiers ════════ */}
      {activeReadingTab === "reading" && (
      <Fragment>

      {/* ════════ LAYER 1: PATTERN SUMMARY (felt layer) ════════ */}
      {tier(
        1,
        <div style={{ textAlign: "center", paddingBottom: "8px" }}>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "2px",
              color: T.gold,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Your pattern
          </div>
          <div
            style={{
              fontFamily: T.font,
              fontSize: "clamp(30px, 6vw, 42px)",
              fontStyle: "italic",
              color: T.text,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            {summary.pattern_name}
          </div>
          {summary.archetype && (
            <div
              style={{
                fontFamily: T.font,
                fontSize: "15px",
                fontStyle: "italic",
                color: T.textDim,
                marginTop: "6px",
              }}
            >
              {summary.archetype}
            </div>
          )}
          {metaParts.length > 0 && (
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: T.textDim,
                marginTop: "14px",
                textTransform: "uppercase",
              }}
            >
              {metaParts.join(" · ")}
            </div>
          )}
        </div>
      )}

      {/* ════════ LAYER 2: RECOGNITION ════════ */}
      {hasV10 && recognition?.what_is_happening && (
        <>
          {tier(2, sectionHeader("What's Happening"))}
          {tier(
            2,
            <div
              style={{
                padding: "22px 24px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: T.radiusSm,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "17px",
                  fontStyle: "italic",
                  color: T.text,
                  lineHeight: 1.7,
                }}
              >
                {recognition.what_is_happening}
              </div>
              {recognition.evidence_from_their_words && recognition.evidence_from_their_words.length > 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      color: T.textMuted,
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    From your words
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {recognition.evidence_from_their_words.map((quote, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: T.font,
                          fontSize: "14px",
                          color: T.textDim,
                          fontStyle: "italic",
                          paddingLeft: "12px",
                          borderLeft: `2px solid ${T.gold}40`,
                        }}
                      >
                        &ldquo;{quote}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ════════ LAYER 3: TEACHING ════════ */}
      {hasV10 && teaching && (
        <>
          {tier(3, sectionHeader("The Teaching"))}
          {tier(3, field("Core teaching", teaching.core_teaching))}
          {tier(4, field("What is being asked", teaching.what_is_being_asked, T.gold))}
          {tier(4, field("Tradition wisdom", teaching.tradition_wisdom))}
          {tier(
            5,
            teaching.existential_permission && (
              <div
                style={{
                  padding: "20px 24px",
                  background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(251,191,36,0.04))",
                  borderRadius: T.radiusSm,
                  border: "1px solid rgba(167,139,250,0.15)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: T.font,
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: T.text,
                    lineHeight: 1.65,
                  }}
                >
                  {teaching.existential_permission}
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* ════════ LAYER 4: ALIGNMENT ════════ */}
      {hasV10 && alignment?.status && (
        <>
          {tier(6, sectionHeader("Alignment"))}
          {tier(
            6,
            <div
              style={{
                padding: "18px 22px",
                background: `${alignColor}0d`,
                borderRadius: T.radiusSm,
                border: `1px solid ${alignColor}30`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: alignment.reading ? "12px" : 0,
                }}
              >
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "2px",
                    color: alignColor,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    padding: "5px 14px",
                    borderRadius: "999px",
                    background: `${alignColor}15`,
                    border: `1px solid ${alignColor}40`,
                    fontFamily: T.fontMono,
                    fontSize: "11px",
                    color: alignColor,
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {alignment.status}
                </div>
              </div>
              {alignment.reading && (
                <div
                  style={{
                    fontFamily: T.font,
                    fontSize: "15.5px",
                    color: T.text,
                    lineHeight: 1.6,
                  }}
                >
                  {alignment.reading}
                </div>
              )}
              {(alignment.signs_of_alignment || alignment.signs_of_misalignment) && (
                <div style={{ marginTop: "14px" }}>
                  <button
                    onClick={() => setShowAlignment((s) => !s)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: alignColor,
                      fontFamily: T.fontMono,
                      fontSize: "10px",
                      letterSpacing: "1.5px",
                      cursor: "pointer",
                      padding: "4px 0",
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}
                  >
                    {showAlignment ? "↑ Hide signs" : "↓ Show signs of each"}
                  </button>
                  {showAlignment && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "10px",
                      }}
                    >
                      {alignment.signs_of_alignment && (
                        <div
                          style={{
                            padding: "12px 14px",
                            background: "rgba(74,222,128,0.05)",
                            borderRadius: "8px",
                            borderLeft: "2px solid #4ADE80",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: T.fontMono,
                              fontSize: "9px",
                              color: "#4ADE80",
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              marginBottom: "6px",
                              fontWeight: 700,
                            }}
                          >
                            ✓ Cooperation
                          </div>
                          <div style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim, lineHeight: 1.55 }}>
                            {alignment.signs_of_alignment}
                          </div>
                        </div>
                      )}
                      {alignment.signs_of_misalignment && (
                        <div
                          style={{
                            padding: "12px 14px",
                            background: "rgba(255,107,107,0.05)",
                            borderRadius: "8px",
                            borderLeft: "2px solid #FF6B6B",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: T.fontMono,
                              fontSize: "9px",
                              color: "#FF6B6B",
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              marginBottom: "6px",
                              fontWeight: 700,
                            }}
                          >
                            ✗ Resistance
                          </div>
                          <div style={{ fontFamily: T.font, fontSize: "14px", color: T.textDim, lineHeight: 1.55 }}>
                            {alignment.signs_of_misalignment}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ════════ LAYER 5: PARTICIPATION ════════ */}
      {hasV10 && participation && (
        <>
          {tier(7, sectionHeader("Recommended Participation"))}
          {tier(7, field("This week", participation.recommended_participation, T.gold))}
          {tier(7, field("What to avoid", participation.what_to_avoid, "#FF6B6B"))}
          {tier(
            7,
            participation.pattern_rule && (
              <div
                style={{
                  padding: "20px 24px",
                  background: "rgba(251,191,36,0.05)",
                  borderRadius: T.radiusSm,
                  border: "1px solid rgba(251,191,36,0.18)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "9px",
                    letterSpacing: "2px",
                    color: T.gold,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    fontWeight: 700,
                  }}
                >
                  The pattern rule
                </div>
                <div
                  style={{
                    fontFamily: T.font,
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: T.text,
                    lineHeight: 1.6,
                  }}
                >
                  {participation.pattern_rule}
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* ════════ LEGACY: TECHNICAL READING (only for old readings) ════════ */}
      {!hasV10 && hasTechnical && technical && (
        <>
          {tier(3, sectionHeader("Technical reading"))}
          {tier(3, field("Phase nature", technical.phase_nature))}
          {tier(4, field("Micro-state work", technical.micro_state_work, T.gold))}
          {tier(4, field("What to do", technical.what_to_do))}
          {tier(5, field("What to avoid", technical.what_to_avoid, "#FF6B6B"))}
          {tier(5, field("The unseen", technical.the_unseen))}
        </>
      )}

      {/* ════════ LAYER 6: SIX TRADITIONS ════════ */}
      {hasTraditions && (
        <>
          {tier(8, sectionHeader("Six Traditions"))}
          {tier(
            8,
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px" }}>
                {TRADITION_LABELS.map(([key, label]) => {
                  const value = traditions?.[key];
                  if (!value) return null;
                  const isOpen = openTradition === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setOpenTradition((o) => (o === key ? null : key))}
                      style={{
                        background: isOpen ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.025)",
                        border: `1px solid ${isOpen ? "rgba(251,191,36,0.30)" : T.border}`,
                        borderRadius: T.radiusSm,
                        padding: "12px 14px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s " + T.ease,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: T.fontMono,
                          fontSize: "10px",
                          letterSpacing: "1.5px",
                          color: isOpen ? T.gold : T.textDim,
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {label}
                      </div>
                      {isOpen && (
                        <div
                          style={{
                            fontFamily: T.font,
                            fontSize: "14px",
                            color: T.text,
                            lineHeight: 1.55,
                            marginTop: "8px",
                          }}
                        >
                          {value}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {!openTradition && (
                <div
                  style={{
                    marginTop: "10px",
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "1px",
                    color: T.textMuted,
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  Tap any tradition to see how it names this pattern state.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Closing line */}
      {tier(
        8,
        <div
          style={{
            marginTop: "10px",
            textAlign: "center",
            fontFamily: T.font,
            fontStyle: "italic",
            fontSize: "14px",
            color: T.textMuted,
            lineHeight: 1.5,
          }}
        >
          Your reading is saved. Return any time to see how the pattern moves.
        </div>
      )}

      </Fragment>
      )}

    </div>
  );
}

// ─── History item card ───────────────────────────────────────
function HistoryCard({ item, onClick, active }: { item: HistoryItem; onClick: () => void; active: boolean }) {
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "14px 16px",
        background: active ? "rgba(167,139,250,0.10)" : "rgba(255,255,255,0.025)",
        border: active ? "1px solid rgba(167,139,250,0.35)" : `1px solid ${T.border}`,
        borderRadius: T.radiusSm,
        cursor: "pointer",
        transition: "all 0.2s " + T.ease,
        width: "100%",
        display: "block",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.025)";
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "9px",
          letterSpacing: "1.5px",
          color: T.textMuted,
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        {dateStr}
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "16px",
          fontStyle: "italic",
          color: active ? T.gold : T.text,
          marginBottom: "4px",
        }}
      >
        {item.patternName || "Unnamed pattern"}
      </div>
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "10px",
          letterSpacing: "1px",
          color: T.textDim,
        }}
      >
        {item.phase || "—"}
        {item.microState ? ` · ${item.microState}` : ""}
      </div>
    </button>
  );
}

// ─── Dream reading display ───────────────────────────────────
// Dream-specific structure: summary hero → symbols → tone →
// phase commentary → waking-life bridge → teaching → participation
// → six traditions. Shares the visual language of ReadingDisplay.
function DreamDisplay({ dream }: { dream: DreamResult }) {
  const s = dream.summary;
  const d = dream.dream;
  const sectionLabel = (text: string) => (
    <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2.5px", color: T.accent, textTransform: "uppercase", fontWeight: 700, textAlign: "center", margin: "26px 0 14px" }}>
      — {text} —
    </div>
  );
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", paddingBottom: "20px", borderBottom: `1px solid ${T.border}`, marginBottom: "8px" }}>
        <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "2px", color: T.gold, textTransform: "uppercase", marginBottom: "10px" }}>☾ Dream reading</div>
        {s?.pattern_name && (
          <div style={{ fontFamily: T.font, fontSize: "clamp(28px, 5vw, 38px)", fontStyle: "italic", color: T.text, lineHeight: 1.1, letterSpacing: "-0.4px" }}>{s.pattern_name}</div>
        )}
        {s?.phase && (
          <div style={{ fontFamily: T.fontMono, fontSize: "11px", letterSpacing: "1.5px", color: T.textDim, marginTop: "12px", textTransform: "uppercase" }}>
            {s.phase}{s.micro_state ? ` · ${s.micro_state}` : ""}{s.state_code ? ` · ${s.state_code}` : ""}
          </div>
        )}
      </div>

      {/* Symbols */}
      {d?.symbols && d.symbols.length > 0 && (
        <>
          {sectionLabel("The symbols")}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {d.symbols.map((sym, i) => (
              <div key={i} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, borderLeft: `2px solid ${T.accent}` }}>
                <div style={{ fontFamily: T.font, fontSize: "16px", fontStyle: "italic", color: T.gold, marginBottom: "4px" }}>{sym.image}</div>
                <div style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.55 }}>{sym.meaning}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Emotional tone */}
      {d?.emotional_tone && (
        <>
          {sectionLabel("Emotional tone")}
          <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm }}>
            <div style={{ fontFamily: T.font, fontSize: "16px", color: T.text, lineHeight: 1.65, fontStyle: "italic" }}>{d.emotional_tone}</div>
          </div>
        </>
      )}

      {/* Phase commentary */}
      {d?.phase_commentary && (
        <>
          {sectionLabel("What the dream is saying")}
          <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, borderLeft: `2px solid ${T.accent}` }}>
            <div style={{ fontFamily: T.font, fontSize: "16.5px", color: T.text, lineHeight: 1.65 }}>{d.phase_commentary}</div>
          </div>
        </>
      )}

      {/* Waking life bridge */}
      {d?.waking_life_bridge && (
        <>
          {sectionLabel("In waking life")}
          <div style={{ padding: "18px 22px", background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(251,191,36,0.04))", borderRadius: T.radiusSm, border: "1px solid rgba(167,139,250,0.15)" }}>
            <div style={{ fontFamily: T.font, fontSize: "16.5px", color: T.text, lineHeight: 1.65 }}>{d.waking_life_bridge}</div>
          </div>
        </>
      )}

      {/* Teaching */}
      {dream.teaching?.core_teaching && (
        <>
          {sectionLabel("The teaching")}
          <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, borderLeft: `2px solid ${T.accent}`, marginBottom: "10px" }}>
            <div style={{ fontFamily: T.font, fontSize: "16px", color: T.text, lineHeight: 1.65 }}>{dream.teaching.core_teaching}</div>
          </div>
          {dream.teaching.existential_permission && (
            <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(251,191,36,0.04))", borderRadius: T.radiusSm, textAlign: "center" }}>
              <div style={{ fontFamily: T.font, fontSize: "15.5px", fontStyle: "italic", color: T.text, lineHeight: 1.6 }}>{dream.teaching.existential_permission}</div>
            </div>
          )}
        </>
      )}

      {/* Participation */}
      {dream.participation?.recommended_participation && (
        <>
          {sectionLabel("Carry it into waking life")}
          <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, borderLeft: `2px solid ${T.gold}`, marginBottom: "10px" }}>
            <div style={{ fontFamily: T.font, fontSize: "16px", color: T.text, lineHeight: 1.65 }}>{dream.participation.recommended_participation}</div>
          </div>
          {dream.participation.pattern_rule && (
            <div style={{ padding: "18px 22px", background: "rgba(251,191,36,0.05)", borderRadius: T.radiusSm, border: "1px solid rgba(251,191,36,0.18)", textAlign: "center" }}>
              <div style={{ fontFamily: T.font, fontSize: "15.5px", fontStyle: "italic", color: T.text, lineHeight: 1.6 }}>{dream.participation.pattern_rule}</div>
            </div>
          )}
        </>
      )}

      {/* Six traditions */}
      {dream.traditions && (
        <>
          {sectionLabel("Six traditions")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
            {([
              ["Ifá", dream.traditions.ifa],
              ["Kabbalah", dream.traditions.kabbalah],
              ["I Ching", dream.traditions.i_ching],
              ["Scripture", dream.traditions.scripture],
              ["Buddhism", dream.traditions.buddhism],
              ["Hermetic", dream.traditions.hermetic],
            ] as [string, string | undefined][]).filter(([, v]) => v).map(([name, body]) => (
              <div key={name} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.025)", borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1.5px", color: T.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>{name}</div>
                <div style={{ fontFamily: T.font, fontSize: "13.5px", color: T.textDim, lineHeight: 1.55 }}>{body}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Recurrence digest ───────────────────────────────────────
// Aggregates the reading history by phase to surface what keeps
// recurring. Pure analytics over the existing history array — no new
// AI, no new fetch. Renders only when there are enough readings to
// say something meaningful (3+).
function RecurrenceDigest({ history }: { history: HistoryItem[] }) {
  // Tally phases. We normalize on the phase string as it appears in
  // history (e.g. "Scorpio (Transformation)" or "Taurus"). Readings
  // with no phase are skipped.
  const tally = new Map<string, { count: number; lastAt: string; patternNames: Set<string> }>();
  for (const item of history) {
    if (!item.phase) continue;
    const key = item.phase;
    const existing = tally.get(key);
    if (existing) {
      existing.count += 1;
      if (item.createdAt > existing.lastAt) existing.lastAt = item.createdAt;
      if (item.patternName) existing.patternNames.add(item.patternName);
    } else {
      tally.set(key, {
        count: 1,
        lastAt: item.createdAt,
        patternNames: new Set(item.patternName ? [item.patternName] : []),
      });
    }
  }

  // Only phases seen more than once are "recurring" — that's the point.
  const recurring = Array.from(tally.entries())
    .filter(([, v]) => v.count >= 2)
    .sort((a, b) => b[1].count - a[1].count);

  // Need at least 3 total readings AND at least one recurring phase to
  // be worth showing. Below that, the digest would be noise.
  if (history.length < 3 || recurring.length === 0) return null;

  const topPhase = recurring[0];
  const totalReadings = history.length;

  return (
    <div
      style={{
        padding: "18px 18px",
        background: "linear-gradient(135deg, rgba(167,139,250,0.07), rgba(251,191,36,0.04))",
        border: "1px solid rgba(167,139,250,0.18)",
        borderRadius: T.radiusSm,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "9px",
          letterSpacing: "2px",
          color: T.gold,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        ✦ Recurrence
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "15px",
          color: T.text,
          lineHeight: 1.5,
          marginBottom: "14px",
        }}
      >
        Across {totalReadings} readings, the phase that keeps returning is{" "}
        <span style={{ fontStyle: "italic", color: T.gold }}>{topPhase[0]}</span>
        {" "}— {topPhase[1].count} times.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {recurring.slice(0, 4).map(([phase, v]) => {
          const pct = Math.round((v.count / totalReadings) * 100);
          return (
            <div key={phase}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "0.5px", color: T.textDim }}>{phase}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textMuted }}>{v.count}×</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #A78BFA, #FBBF24)", borderRadius: "999px" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "12.5px",
          fontStyle: "italic",
          color: T.textMuted,
          lineHeight: 1.5,
          marginTop: "12px",
        }}
      >
        A phase that keeps returning is a curriculum that hasn&rsquo;t completed. The lesson is still being offered.
      </div>
    </div>
  );
}

// ─── The app ─────────────────────────────────────────────────
export default function ReadAppClient() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<FullReading | null>(null);
  // Input type: a waking situation (the default) or a dream. Dream
  // readings use a dream-tuned prompt and a dream-specific display.
  const [readingType, setReadingType] = useState<"situation" | "dream" | "coordinate">("situation");
  const [dreamReading, setDreamReading] = useState<DreamResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  // ─── Master mode state ──────────────────────────────────────
  const [mode, setMode] = useState<Mode>("personal");

  // Honor ?mode=master in the URL on mount. The server gate at
  // /read/app/page.tsx has already verified this user is a paid
  // certified practitioner, so we don't need a client-side check.
  // The portal sidebar's "Client Readings" item navigates here
  // with ?mode=master to land directly in practitioner mode.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "master") {
      setMode("practitioner");
    }
  }, []);
  const [clientList, setClientList] = useState<ClientRecord[]>([]);
  const [activeClient, setActiveClient] = useState<ClientRecord | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);

  // Client edit state — `editingClientId` is the id of the client whose
  // inline editor is currently open (null means none open).
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // State for emailing the active reading to its client
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<string | null>(null); // ISO string of the most recent send

  // Stars memoized so they don't re-randomize on every render
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.4 + 0.5,
        delay: Math.random() * 6,
        dur: Math.random() * 4 + 4,
        op: Math.random() * 0.4 + 0.15,
      })),
    []
  );

  // Reload history whenever mode or active client changes.
  // - Personal mode: own readings (client_id IS NULL)
  // - Practitioner mode, no client selected: empty (you must select a client)
  // - Practitioner mode, client selected: that client's readings
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      try {
        let url = "/api/readings";
        if (mode === "practitioner") {
          if (!activeClient) {
            // No client selected yet — show nothing.
            if (!cancelled) {
              setHistory([]);
              setHistoryLoading(false);
            }
            return;
          }
          url = `/api/readings?clientId=${encodeURIComponent(activeClient.id)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Could not load history");
        const data = await res.json();
        if (!cancelled) setHistory(data.readings || []);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, activeClient]);

  // Load client list when entering practitioner mode (cached afterwards)
  useEffect(() => {
    if (mode !== "practitioner") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error("Could not load clients");
        const data = await res.json();
        if (!cancelled) setClientList(data.clients || []);
      } catch (e) {
        if (!cancelled) console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  async function createClient() {
    if (!newClientName.trim() || creatingClient) return;
    setCreatingClient(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName.trim(),
          email: newClientEmail.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not save client");
      }
      const data = await res.json();
      setClientList((prev) => [data.client, ...prev]);
      setActiveClient(data.client);
      setNewClientName("");
      setNewClientEmail("");
      setShowNewClientForm(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not save client");
    } finally {
      setCreatingClient(false);
    }
  }

  function openEditClient(client: ClientRecord) {
    setEditingClientId(client.id);
    setEditName(client.name);
    setEditEmail(client.email || "");
    setEditNotes(client.notes || "");
    setConfirmDeleteId(null);
  }

  function closeEditClient() {
    setEditingClientId(null);
    setEditName("");
    setEditEmail("");
    setEditNotes("");
    setConfirmDeleteId(null);
  }

  async function saveEditClient(id: string) {
    if (!editName.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim() || null,
          notes: editNotes.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not save changes");
      }
      const data = await res.json();
      // Update in client list
      setClientList((prev) => prev.map((c) => (c.id === id ? data.client : c)));
      // If this is the active client, refresh that reference too
      if (activeClient?.id === id) setActiveClient(data.client);
      closeEditClient();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not save changes");
    } finally {
      setSavingEdit(false);
    }
  }

  async function archiveClient(id: string) {
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not archive");
      }
      // Remove from active list (the GET defaults to non-archived)
      setClientList((prev) => prev.filter((c) => c.id !== id));
      if (activeClient?.id === id) {
        setActiveClient(null);
        setReading(null);
        setActiveHistoryId(null);
      }
      closeEditClient();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not archive");
    }
  }

  async function deleteClient(id: string) {
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not delete");
      }
      setClientList((prev) => prev.filter((c) => c.id !== id));
      if (activeClient?.id === id) {
        setActiveClient(null);
        setReading(null);
        setActiveHistoryId(null);
      }
      closeEditClient();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete");
    }
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setActiveClient(null);
    setReading(null);
    setActiveHistoryId(null);
    setInput("");
    setError(null);
    setSentAt(null);
    setSendError(null);
  }

  async function runReading() {
    if (!input.trim() || loading) return;
    if (mode === "practitioner" && !activeClient) {
      setError("Select a client first.");
      return;
    }
    setLoading(true);
    setError(null);
    setReading(null);
    setDreamReading(null);
    setActiveHistoryId(null);
    setSentAt(null);
    setSendError(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: input.trim(),
          depth: readingType === "dream" ? "dream" : "full",
          clientId: mode === "practitioner" && activeClient ? activeClient.id : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Reading service unavailable");
      }
      const data = await res.json();
      if (readingType === "dream") {
        setDreamReading({
          summary: data.summary,
          dream: data.dream,
          teaching: data.teaching,
          participation: data.participation,
          traditions: data.traditions,
        });
      } else {
        setReading({
          summary: data.summary,
          recognition: data.recognition,
          teaching: data.teaching,
          alignment: data.alignment,
          participation: data.participation,
          traditions: data.traditions,
          // legacy field — preserved for backward-compat
          technical: data.technical,
        });
      }
      // Refresh history (mode-aware effect handles the rest)
      try {
        const url =
          mode === "practitioner" && activeClient
            ? `/api/readings?clientId=${encodeURIComponent(activeClient.id)}`
            : "/api/readings";
        const hRes = await fetch(url);
        if (hRes.ok) {
          const hData = await hRes.json();
          setHistory(hData.readings || []);
        }
      } catch {
        // History refresh failure is non-critical
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something interrupted the reading.");
    } finally {
      setLoading(false);
    }
  }

  function selectHistory(item: HistoryItem) {
    setActiveHistoryId(item.id);
    // Prefer the full reading from raw if it exists; fall back to flat columns
    const raw = item.raw as {
      summary?: PatternSummary;
      recognition?: Recognition;
      teaching?: Teaching;
      alignment?: Alignment;
      participation?: Participation;
      traditions?: SixTraditions;
      technical?: TechnicalReading;
      dream?: DreamLayer;
      kind?: string;
    } | null;

    // Dream readings are tagged kind:"dream" in raw — render the dream display.
    if (raw && raw.kind === "dream" && raw.summary && raw.dream) {
      setReadingType("dream");
      setReading(null);
      setDreamReading({
        summary: raw.summary,
        dream: raw.dream,
        teaching: raw.teaching,
        participation: raw.participation,
        traditions: raw.traditions,
      });
      setInput(item.input);
      setMobileHistoryOpen(false);
      setSentAt(item.sentToClientAt ?? null);
      setSendError(null);
      return;
    }

    // Non-dream — clear any dream state and render the standard reading.
    setReadingType("situation");
    setDreamReading(null);

    if (raw && raw.summary) {
      // New v10-parity shape OR legacy with technical/traditions
      setReading({
        summary: raw.summary,
        recognition: raw.recognition,
        teaching: raw.teaching,
        alignment: raw.alignment,
        participation: raw.participation,
        traditions: raw.traditions,
        technical: raw.technical,
      });
    } else {
      // Oldest shape — just the flat columns
      setReading({
        summary: {
          pattern_name: item.patternName ?? undefined,
          phase: item.phase ?? undefined,
          micro_state: item.microState ?? undefined,
          likely_curriculum: item.curriculum ?? undefined,
          active_lesson: item.activeLesson ?? undefined,
          recommended_participation: item.recommendedParticipation ?? undefined,
        },
      });
    }
    setInput(item.input);
    setMobileHistoryOpen(false);
    // Load send state for this past reading
    setSentAt(item.sentToClientAt ?? null);
    setSendError(null);
    // Scroll reading into view on mobile
    setTimeout(() => {
      const el = document.getElementById("reading-pane");
      if (el && window.innerWidth < 960) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function newReading() {
    setReading(null);
    setDreamReading(null);
    setActiveHistoryId(null);
    setInput("");
    setError(null);
    setSentAt(null);
    setSendError(null);
  }

  // Email the currently-viewed reading to its client.
  // Only valid in practitioner mode, when viewing a past reading that has
  // an id (activeHistoryId is set) AND that reading was for the active client.
  async function sendReadingToClient() {
    if (!activeHistoryId || !activeClient) {
      setSendError("Select a reading from this client's history to send.");
      return;
    }
    if (!activeClient.email) {
      setSendError(`${activeClient.name} has no email on file. Add one to send.`);
      return;
    }
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/readings/${encodeURIComponent(activeHistoryId)}/send`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not send the reading.");
      }
      const data = await res.json();
      setSentAt(data.sentAt);
      // Refresh history so the list reflects the new sent state
      try {
        const url = `/api/readings?clientId=${encodeURIComponent(activeClient.id)}`;
        const hRes = await fetch(url);
        if (hRes.ok) {
          const hData = await hRes.json();
          setHistory(hData.readings || []);
        }
      } catch {
        // Non-critical
      }
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: T.font,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pos-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.6; } }
        .pos-star { animation: pos-twinkle ease-in-out infinite; }

        .pos-shell { display: grid; grid-template-columns: 280px 1fr; gap: 0; min-height: calc(100vh - 64px); }
        .pos-history-btn { display: none; }
        @media (max-width: 960px) {
          .pos-shell { grid-template-columns: 1fr; }
          .pos-history-panel { display: none; }
          .pos-history-panel.open { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 30; background: rgba(6,6,15,0.97); backdrop-filter: blur(20px); padding: 20px; overflow-y: auto; }
          .pos-history-btn { display: inline-flex !important; }
        }
      `}</style>

      {/* Starfield */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {stars.map((s, i) => (
          <span
            key={i}
            className="pos-star"
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: i % 7 === 0 ? T.gold : "#fff",
              opacity: s.op,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Aurora */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: 540,
          height: 540,
          top: -160,
          left: -120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.30), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: 460,
          height: 460,
          bottom: -140,
          right: -120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.20), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px clamp(16px, 4vw, 32px)",
            gap: "14px",
            background: "rgba(6,6,15,0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <a href="/" style={{ textDecoration: "none", fontFamily: T.fontMono, fontSize: "14px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: T.text }}>Twelvefold</span> <span style={{ color: T.accent }}>·</span>{" "}
            <span style={{ color: T.gold, fontFamily: T.font, fontStyle: "italic", fontSize: "16px" }}>PatternOS</span>
          </a>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Mode toggle */}
            <div
              className="pos-mode-toggle"
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border}`,
                borderRadius: "999px",
                padding: "3px",
                gap: "2px",
              }}
            >
              {(["personal", "practitioner"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontFamily: T.fontMono,
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    background: mode === m ? T.gradGold : "transparent",
                    color: mode === m ? "#1a1206" : T.textDim,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.25s " + T.ease,
                  }}
                >
                  {m === "personal" ? "Personal" : "Master"}
                </button>
              ))}
            </div>
            <Btn variant="ghost" className="pos-history-btn" onClick={() => setMobileHistoryOpen((o) => !o)} style={{ padding: "9px 14px", fontSize: "11px" }}>
              {mobileHistoryOpen ? "Close" : mode === "practitioner" ? "Clients" : "History"}
            </Btn>
            <Btn variant="ghost" onClick={newReading} style={{ padding: "9px 18px", fontSize: "11px" }}>
              + New
            </Btn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                variables: { colorPrimary: "#A78BFA" },
                elements: { avatarBox: { width: 34, height: 34, border: `1px solid ${T.border}` } },
              }}
            />
          </div>
        </nav>

        <div className="pos-shell">
          {/* History sidebar */}
          <aside
            className={`pos-history-panel${mobileHistoryOpen ? " open" : ""}`}
            style={{
              borderRight: `1px solid ${T.border}`,
              padding: "24px 18px",
              overflowY: "auto",
              maxHeight: "calc(100vh - 64px)",
              position: "sticky",
              top: 64,
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Eyebrow>{mode === "practitioner" ? "Your clients" : "Your readings"}</Eyebrow>
            </div>

            {mode === "practitioner" && (
              <div style={{ marginBottom: "16px" }}>
                {!showNewClientForm ? (
                  <button
                    onClick={() => setShowNewClientForm(true)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: T.gradGold,
                      border: "none",
                      borderRadius: T.radiusSm,
                      color: "#1a1206",
                      fontFamily: T.fontMono,
                      fontSize: "11px",
                      letterSpacing: "1px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    + New client
                  </button>
                ) : (
                  <div
                    style={{
                      padding: "14px",
                      background: "rgba(251,191,36,0.06)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      borderRadius: T.radiusSm,
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Client name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      autoFocus
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 10px",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${T.border}`,
                        borderRadius: "6px",
                        color: T.text,
                        fontFamily: T.font,
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 10px",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${T.border}`,
                        borderRadius: "6px",
                        color: T.text,
                        fontFamily: T.font,
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={createClient}
                        disabled={!newClientName.trim() || creatingClient}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: T.gradGold,
                          color: "#1a1206",
                          border: "none",
                          borderRadius: "6px",
                          fontFamily: T.fontMono,
                          fontSize: "10px",
                          letterSpacing: "1px",
                          cursor: !newClientName.trim() || creatingClient ? "not-allowed" : "pointer",
                          opacity: !newClientName.trim() || creatingClient ? 0.5 : 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {creatingClient ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewClientForm(false);
                          setNewClientName("");
                          setNewClientEmail("");
                        }}
                        style={{
                          padding: "8px 14px",
                          background: "transparent",
                          color: T.textDim,
                          border: `1px solid ${T.border}`,
                          borderRadius: "6px",
                          fontFamily: T.fontMono,
                          fontSize: "10px",
                          letterSpacing: "1px",
                          cursor: "pointer",
                          textTransform: "uppercase",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Client list (practitioner mode) */}
            {mode === "practitioner" && clientList.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                {clientList.map((c) => (
                  <Fragment key={c.id}>
                    {editingClientId === c.id ? (
                      // Inline editor
                      <div
                        style={{
                          padding: "14px",
                          background: "rgba(167,139,250,0.06)",
                          border: "1px solid rgba(167,139,250,0.25)",
                          borderRadius: T.radiusSm,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
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
                          }}
                        >
                          Editing {c.name}
                        </div>
                        <input
                          type="text"
                          placeholder="Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "8px 10px",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${T.border}`,
                            borderRadius: "6px",
                            color: T.text,
                            fontFamily: T.font,
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "8px 10px",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${T.border}`,
                            borderRadius: "6px",
                            color: T.text,
                            fontFamily: T.font,
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                        <textarea
                          placeholder="Notes (optional)"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "8px 10px",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${T.border}`,
                            borderRadius: "6px",
                            color: T.text,
                            fontFamily: T.font,
                            fontSize: "14px",
                            outline: "none",
                            resize: "vertical",
                            lineHeight: 1.5,
                          }}
                        />
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => saveEditClient(c.id)}
                            disabled={!editName.trim() || savingEdit}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: T.gradGold,
                              color: "#1a1206",
                              border: "none",
                              borderRadius: "6px",
                              fontFamily: T.fontMono,
                              fontSize: "10px",
                              letterSpacing: "1px",
                              cursor: !editName.trim() || savingEdit ? "not-allowed" : "pointer",
                              opacity: !editName.trim() || savingEdit ? 0.5 : 1,
                              textTransform: "uppercase",
                            }}
                          >
                            {savingEdit ? "Saving…" : "Save"}
                          </button>
                          <button
                            onClick={closeEditClient}
                            style={{
                              padding: "8px 14px",
                              background: "transparent",
                              color: T.textDim,
                              border: `1px solid ${T.border}`,
                              borderRadius: "6px",
                              fontFamily: T.fontMono,
                              fontSize: "10px",
                              letterSpacing: "1px",
                              cursor: "pointer",
                              textTransform: "uppercase",
                            }}
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Destructive actions — separated */}
                        <div
                          style={{
                            marginTop: "4px",
                            paddingTop: "10px",
                            borderTop: `1px dashed ${T.border}`,
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {confirmDeleteId === c.id ? (
                            <>
                              <div style={{ flexBasis: "100%", fontFamily: T.fontMono, fontSize: "10px", color: "#FF9B9B", letterSpacing: "1px", marginBottom: "4px" }}>
                                Delete {c.name} permanently?
                              </div>
                              <button
                                onClick={() => deleteClient(c.id)}
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  background: "rgba(255,107,107,0.15)",
                                  color: "#FF9B9B",
                                  border: "1px solid rgba(255,107,107,0.4)",
                                  borderRadius: "6px",
                                  fontFamily: T.fontMono,
                                  fontSize: "10px",
                                  letterSpacing: "1px",
                                  cursor: "pointer",
                                  textTransform: "uppercase",
                                }}
                              >
                                Yes, delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                style={{
                                  padding: "8px 14px",
                                  background: "transparent",
                                  color: T.textDim,
                                  border: `1px solid ${T.border}`,
                                  borderRadius: "6px",
                                  fontFamily: T.fontMono,
                                  fontSize: "10px",
                                  letterSpacing: "1px",
                                  cursor: "pointer",
                                  textTransform: "uppercase",
                                }}
                              >
                                Keep
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => archiveClient(c.id)}
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  background: "transparent",
                                  color: T.textDim,
                                  border: `1px solid ${T.border}`,
                                  borderRadius: "6px",
                                  fontFamily: T.fontMono,
                                  fontSize: "10px",
                                  letterSpacing: "1px",
                                  cursor: "pointer",
                                  textTransform: "uppercase",
                                }}
                              >
                                Archive
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(c.id)}
                                style={{
                                  padding: "8px 14px",
                                  background: "transparent",
                                  color: "#FF9B9B",
                                  border: "1px solid rgba(255,107,107,0.3)",
                                  borderRadius: "6px",
                                  fontFamily: T.fontMono,
                                  fontSize: "10px",
                                  letterSpacing: "1px",
                                  cursor: "pointer",
                                  textTransform: "uppercase",
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Normal row
                      <div
                        style={{
                          display: "flex",
                          alignItems: "stretch",
                          gap: "4px",
                        }}
                      >
                        <button
                          onClick={() => {
                            setActiveClient(c);
                            setReading(null);
                            setActiveHistoryId(null);
                            setInput("");
                            setMobileHistoryOpen(false);
                            setSentAt(null);
                            setSendError(null);
                          }}
                          style={{
                            flex: 1,
                            textAlign: "left",
                            padding: "10px 14px",
                            background:
                              activeClient?.id === c.id
                                ? "rgba(251,191,36,0.10)"
                                : "rgba(255,255,255,0.025)",
                            border:
                              activeClient?.id === c.id
                                ? "1px solid rgba(251,191,36,0.35)"
                                : `1px solid ${T.border}`,
                            borderRadius: T.radiusSm,
                            cursor: "pointer",
                            transition: "all 0.2s " + T.ease,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: T.font,
                              fontSize: "15px",
                              color: activeClient?.id === c.id ? T.gold : T.text,
                              fontWeight: 600,
                            }}
                          >
                            {c.name}
                          </div>
                          {c.email && (
                            <div style={{ fontFamily: T.fontMono, fontSize: "10px", color: T.textDim, marginTop: "2px" }}>
                              {c.email}
                            </div>
                          )}
                        </button>
                        <button
                          aria-label={`Edit ${c.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditClient(c);
                          }}
                          style={{
                            width: 38,
                            background: "transparent",
                            border: `1px solid ${T.border}`,
                            borderRadius: T.radiusSm,
                            color: T.textDim,
                            cursor: "pointer",
                            fontFamily: T.fontMono,
                            fontSize: "12px",
                            transition: "all 0.2s " + T.ease,
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = T.text;
                            e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = T.textDim;
                            e.currentTarget.style.borderColor = T.border;
                          }}
                        >
                          ✎
                        </button>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            )}

            {mode === "practitioner" && clientList.length === 0 && !showNewClientForm && (
              <div
                style={{
                  padding: "20px 18px",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.5, marginBottom: "6px" }}>
                  No clients yet.
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted }}>
                  Add your first to begin.
                </div>
              </div>
            )}

            {/* Reading history under the selected client (practitioner mode) */}
            {mode === "practitioner" && activeClient && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontFamily: T.fontMono,
                    fontSize: "9px",
                    letterSpacing: "2px",
                    color: T.accent,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Readings for {activeClient.name}
                </div>
              </div>
            )}

            {/* History list — personal mode always shows; practitioner mode requires active client */}
            {(mode === "personal" || (mode === "practitioner" && activeClient)) && (
              historyLoading ? (
                <div style={{ fontFamily: T.fontMono, fontSize: "11px", color: T.textMuted, padding: "20px 0", textAlign: "center" }}>
                  Loading…
                </div>
              ) : history.length === 0 ? (
                <div
                  style={{
                    padding: "20px 18px",
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radiusSm,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: T.font, fontSize: "15px", color: T.textDim, lineHeight: 1.5, marginBottom: "8px" }}>
                    No readings yet.
                  </div>
                  <div style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted }}>
                    {mode === "practitioner" ? "Compose one below." : "Your first one appears here."}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <RecurrenceDigest history={history} />
                  {history.map((item) => (
                    <HistoryCard key={item.id} item={item} onClick={() => selectHistory(item)} active={item.id === activeHistoryId} />
                  ))}
                </div>
              )
            )}
          </aside>

          {/* Main pane */}
          <main style={{ padding: "clamp(24px, 4vw, 48px) clamp(20px, 5vw, 64px)" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {/* Composer */}
              <section style={{ marginBottom: "36px" }}>
                <div style={{ marginBottom: "14px" }}>
                  <Eyebrow>
                    {activeHistoryId
                      ? "Viewing a past reading"
                      : mode === "practitioner"
                        ? activeClient
                          ? `Reading for ${activeClient.name}`
                          : "Select a client first"
                        : "What keeps happening?"}
                  </Eyebrow>
                </div>
                <div
                  style={{
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radius,
                    padding: "clamp(20px, 3vw, 28px)",
                  }}
                >
                  {/* Input-type toggle: Situation / Dream / Coordinate */}
                  {!activeHistoryId && (
                    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "999px", padding: "3px", gap: "2px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {(["situation", "dream", "coordinate"] as const).map((rt) => (
                        <button
                          key={rt}
                          onClick={() => { setReadingType(rt); setReading(null); setDreamReading(null); }}
                          style={{
                            padding: "6px 16px",
                            borderRadius: "999px",
                            fontFamily: T.fontMono,
                            fontSize: "10px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            background: readingType === rt ? T.gradGold : "transparent",
                            color: readingType === rt ? "#1a1206" : T.textDim,
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.25s " + T.ease,
                          }}
                        >
                          {rt === "situation" ? "Situation" : rt === "dream" ? "☾ Dream" : "⊹ Coordinate"}
                        </button>
                      ))}
                    </div>
                  )}
                  {readingType === "coordinate" && !activeHistoryId ? (
                    <CoordinateReading embedded />
                  ) : (
                  <>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    placeholder={
                      readingType === "dream"
                        ? "Describe the dream — the images, the people, the places, what happened, and how it felt. Don't tidy it up; the strange details matter most."
                        : mode === "practitioner"
                        ? activeClient
                          ? `What is ${activeClient.name} bringing? Describe what they said is repeating, in their voice or yours.`
                          : "Select a client from the sidebar to begin a reading for them."
                        : "Describe the situation that keeps repeating — what you tried, what didn't work, what you can feel underneath it. The more specific, the deeper the reading."
                    }
                    readOnly={activeHistoryId !== null}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: activeHistoryId ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radiusSm,
                      color: activeHistoryId ? T.textDim : T.text,
                      fontFamily: T.font,
                      fontSize: "17px",
                      padding: "16px",
                      resize: "vertical",
                      outline: "none",
                      lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
                    {activeHistoryId ? (
                      <Btn variant="ghost" onClick={newReading}>
                        + New reading
                      </Btn>
                    ) : (
                      <Btn variant="gold" onClick={runReading} disabled={loading || !input.trim() || (mode === "practitioner" && !activeClient)}>
                        {loading
                          ? readingType === "dream" ? "Reading the dream…" : "Reading the pattern in depth…"
                          : readingType === "dream" ? "Read my dream" : "Read my pattern"}
                      </Btn>
                    )}
                    <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted }}>
                      {activeHistoryId
                        ? "Read-only — start a new reading to compose"
                        : "Pattern Summary + Technical Reading + Six Traditions · saved to history"}
                    </span>
                  </div>
                  {error && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "12px 14px",
                        background: "rgba(255,107,107,0.08)",
                        border: "1px solid rgba(255,107,107,0.25)",
                        borderRadius: T.radiusSm,
                        fontFamily: T.font,
                        fontSize: "14px",
                        color: "#FF9B9B",
                      }}
                    >
                      {error}
                    </div>
                  )}
                  </>
                  )}
                </div>
              </section>

              {/* Reading */}
              <section id="reading-pane">
                {dreamReading ? (
                  <div
                    style={{
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                      padding: "clamp(24px, 4vw, 36px)",
                    }}
                  >
                    <DreamDisplay dream={dreamReading} />
                  </div>
                ) : reading ? (
                  <>
                    <div
                      style={{
                        background: T.bgCard,
                        border: `1px solid ${T.border}`,
                        borderRadius: T.radius,
                        padding: "clamp(24px, 4vw, 36px)",
                      }}
                    >
                      <ReadingDisplay full={reading} situation={input} onPerception={() => {}} />
                    </div>

                    {/* What to do with this — personal mode only, after reading exists */}
                    {mode === "personal" && (
                      <div style={{ marginTop: "24px", padding: "24px clamp(20px, 3vw, 28px)", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
                        <div style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "2px", color: T.textMuted, textTransform: "uppercase", marginBottom: "14px", textAlign: "center" }}>
                          What to do with this
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                          {[
                            { step: "01", label: "Read", title: "Read Chapter 1", body: "Chapter 1 of Pattern Literacy explains why this pattern keeps returning.", href: "/book#excerpt", color: T.gold },
                            { step: "02", label: "Practice", title: "Take the Initiation", body: "35-minute guided experience. Name your phase, hear what it's asking.", href: "/initiation", color: T.accent },
                            { step: "03", label: "Belong", title: "Join the community", body: "Free Observer tier. Reflect with others learning pattern literacy.", href: "/community", color: "rgba(237,233,245,0.55)" },
                          ].map((card) => (
                            <a key={card.step} href={card.href} style={{ display: "block", padding: "16px 16px", background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, textDecoration: "none", transition: "border-color 0.25s ease, transform 0.25s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "7px" }}>
                                <span style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: card.color, fontWeight: 700 }}>{card.step}</span>
                                <span style={{ fontFamily: T.fontMono, fontSize: "9px", letterSpacing: "1.5px", color: card.color, textTransform: "uppercase" }}>· {card.label}</span>
                              </div>
                              <div style={{ fontFamily: T.font, fontSize: "15px", fontWeight: 600, color: T.text, marginBottom: "5px", letterSpacing: "-0.2px" }}>{card.title}</div>
                              <div style={{ fontFamily: T.font, fontSize: "13px", color: T.textDim, lineHeight: 1.5 }}>{card.body}</div>
                              <div style={{ marginTop: "10px", fontFamily: T.fontMono, fontSize: "10px", color: card.color, letterSpacing: "0.5px" }}>→</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Email-to-client panel (Master mode + saved reading for active client) */}
                    {mode === "practitioner" && activeClient && activeHistoryId && (
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "20px 24px",
                          background: sentAt ? "rgba(74,222,128,0.06)" : "rgba(251,191,36,0.06)",
                          border: `1px solid ${sentAt ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.22)"}`,
                          borderRadius: T.radius,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "16px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ flex: "1 1 240px" }}>
                            <div
                              style={{
                                fontFamily: T.fontMono,
                                fontSize: "10px",
                                letterSpacing: "2px",
                                color: sentAt ? "#4ADE80" : T.gold,
                                textTransform: "uppercase",
                                marginBottom: "6px",
                                fontWeight: 700,
                              }}
                            >
                              {sentAt ? "✓ Sent" : "Share with client"}
                            </div>
                            <div style={{ fontFamily: T.font, fontSize: "16px", color: T.text }}>
                              {sentAt
                                ? `Sent to ${activeClient.email || activeClient.name} on ${new Date(sentAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                                : activeClient.email
                                  ? `Send this reading to ${activeClient.name} at ${activeClient.email}`
                                  : `${activeClient.name} has no email on file. Add one to send.`}
                            </div>
                          </div>
                          <Btn
                            variant={sentAt ? "ghost" : "gold"}
                            onClick={sendReadingToClient}
                            disabled={sending || !activeClient.email}
                          >
                            {sending
                              ? "Sending…"
                              : sentAt
                                ? "Send again"
                                : "Email reading"}
                          </Btn>
                        </div>
                        {sendError && (
                          <div
                            style={{
                              marginTop: "12px",
                              padding: "10px 14px",
                              background: "rgba(255,107,107,0.08)",
                              border: "1px solid rgba(255,107,107,0.25)",
                              borderRadius: T.radiusSm,
                              fontFamily: T.font,
                              fontSize: "14px",
                              color: "#FF9B9B",
                            }}
                          >
                            {sendError}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : !loading ? (
                  <div
                    style={{
                      padding: "60px 24px",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.015)",
                      border: `1px dashed ${T.border}`,
                      borderRadius: T.radius,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: T.font,
                        fontSize: "20px",
                        color: T.textDim,
                        fontStyle: "italic",
                        marginBottom: "10px",
                      }}
                    >
                      The pattern appears here.
                    </div>
                    <div
                      style={{
                        fontFamily: T.fontMono,
                        fontSize: "11px",
                        letterSpacing: "1.5px",
                        color: T.textMuted,
                        textTransform: "uppercase",
                      }}
                    >
                      Describe what keeps happening above
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
