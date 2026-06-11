"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";

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
// Phase 2 (future session): Master/Client mode, Dream Reading,
// per-phase recurrence digest.
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

interface PatternReading {
  pattern_name?: string;
  phase?: string;
  micro_state?: string;
  likely_curriculum?: string;
  active_lesson?: string;
  recommended_participation?: string;
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
  createdAt: string;
}

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

// ─── Reading display (tiered reveal) ─────────────────────────
function ReadingDisplay({ reading }: { reading: PatternReading }) {
  const [visibleTiers, setVisibleTiers] = useState(0);

  useEffect(() => {
    setVisibleTiers(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleTiers(5);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setVisibleTiers((v) => Math.max(v, i)), i * 350));
    }
    return () => timers.forEach(clearTimeout);
  }, [reading.pattern_name, reading.phase]);

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

  const field = (label: string, value?: string | null, accent?: string) =>
    value ? (
      <div
        style={{
          padding: "18px 20px",
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
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: 1.6 }}>{value}</div>
      </div>
    ) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
            {reading.pattern_name}
          </div>
          {(reading.phase || reading.micro_state) && (
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: T.textDim,
                marginTop: "12px",
                textTransform: "uppercase",
              }}
            >
              {reading.phase}
              {reading.micro_state ? ` · ${reading.micro_state}` : ""}
            </div>
          )}
        </div>
      )}
      {tier(2, field("The curriculum", reading.likely_curriculum))}
      {tier(3, field("The lesson active now", reading.active_lesson, T.gold))}
      {tier(4, field("Recommended participation", reading.recommended_participation))}
      {tier(
        5,
        <div
          style={{
            marginTop: "8px",
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

// ─── The app ─────────────────────────────────────────────────
export default function PatternOSApp() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<PatternReading | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

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

  // Load history on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/readings");
        if (!res.ok) {
          throw new Error("Could not load history");
        }
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
  }, []);

  async function runReading() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setReading(null);
    setActiveHistoryId(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: input.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Reading service unavailable");
      }
      const data = await res.json();
      setReading(data.summary);
      // Refresh history to include the new reading
      try {
        const hRes = await fetch("/api/readings");
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
    setReading({
      pattern_name: item.patternName ?? undefined,
      phase: item.phase ?? undefined,
      micro_state: item.microState ?? undefined,
      likely_curriculum: item.curriculum ?? undefined,
      active_lesson: item.activeLesson ?? undefined,
      recommended_participation: item.recommendedParticipation ?? undefined,
    });
    setInput(item.input);
    setMobileHistoryOpen(false);
    // Scroll reading into view on mobile
    setTimeout(() => {
      const el = document.getElementById("reading-pane");
      if (el && window.innerWidth < 960) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function newReading() {
    setReading(null);
    setActiveHistoryId(null);
    setInput("");
    setError(null);
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
            <Btn variant="ghost" className="pos-history-btn" onClick={() => setMobileHistoryOpen((o) => !o)} style={{ padding: "9px 14px", fontSize: "11px" }}>
              {mobileHistoryOpen ? "Close" : "History"}
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
              <Eyebrow>Your readings</Eyebrow>
            </div>

            {historyLoading ? (
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
                  Your first one appears here.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {history.map((item) => (
                  <HistoryCard key={item.id} item={item} onClick={() => selectHistory(item)} active={item.id === activeHistoryId} />
                ))}
              </div>
            )}
          </aside>

          {/* Main pane */}
          <main style={{ padding: "clamp(24px, 4vw, 48px) clamp(20px, 5vw, 64px)" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {/* Composer */}
              <section style={{ marginBottom: "36px" }}>
                <div style={{ marginBottom: "14px" }}>
                  <Eyebrow>{activeHistoryId ? "Viewing a past reading" : "What keeps happening?"}</Eyebrow>
                </div>
                <div
                  style={{
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radius,
                    padding: "clamp(20px, 3vw, 28px)",
                  }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    placeholder="Describe the situation that keeps repeating — what you tried, what didn't work, what you can feel underneath it. The more specific, the deeper the reading."
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
                      <Btn variant="gold" onClick={runReading} disabled={loading || !input.trim()}>
                        {loading ? "Reading the pattern…" : "Read my pattern"}
                      </Btn>
                    )}
                    <span style={{ fontFamily: T.fontMono, fontSize: "10px", letterSpacing: "1px", color: T.textMuted }}>
                      {activeHistoryId
                        ? "Read-only — start a new reading to compose"
                        : "Reading saved to your history when complete"}
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
                </div>
              </section>

              {/* Reading */}
              <section id="reading-pane">
                {reading ? (
                  <div
                    style={{
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                      padding: "clamp(24px, 4vw, 36px)",
                    }}
                  >
                    <ReadingDisplay reading={reading} />
                  </div>
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
