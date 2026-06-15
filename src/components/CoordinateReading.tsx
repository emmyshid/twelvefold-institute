"use client";

import { useState } from "react";

// ════════════════════════════════════════════════════════════════
// CoordinateReading — the 60 Reality Coordinates reading mode.
//
// Shared component used by both /read/app (as a mode) and the
// practitioner portal (as a tab). Self-contained: it owns its input,
// its fetch to /api/reading?depth=coordinate, and its display.
//
// The signature element is the 5-layer × 12-phase matrix, with the
// diagnosed symptom and root coordinates lit.
//
// Layer "Architecture" (AR) is the framework's name for the
// structure/systems layer — distinct from the Capricorn PHASE
// "Structure", to avoid collision.
// ════════════════════════════════════════════════════════════════

const C = {
  bg: "#06060F", text: "#EDE9F5",
  dim: "rgba(237,233,245,0.66)", muted: "rgba(237,233,245,0.40)",
  border: "rgba(255,255,255,0.08)", card: "rgba(255,255,255,0.025)",
  accent: "#A78BFA", gold: "#FBBF24",
  font: "'Crimson Text', Georgia, serif", mono: "'Space Mono', 'Courier New', monospace",
};

const LAYERS = [
  { code: "IO", name: "Intelligent Order" },
  { code: "AR", name: "Architecture" },
  { code: "PA", name: "Pattern" },
  { code: "RH", name: "Rhythm" },
  { code: "EV", name: "Events" },
];

const PHASE_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

interface Coord {
  code: string; layer: string; layer_code: string; phase: string; phase_number: number;
}
interface CoordinateResult {
  situation_summary: string;
  symptom: Coord;
  root: Coord;
  coordinate_title: string;
  symptom_line: string;
  root_line: string;
  teaching: string;
  what_it_asks: string;
  what_to_avoid: string;
}

function layerIndex(code: string): number {
  return Math.max(0, LAYERS.findIndex((l) => l.code === code));
}

function Matrix({ symptom, root }: { symptom: Coord; root: Coord }) {
  const [hover, setHover] = useState<{ l: number; p: number } | null>(null);
  const symL = layerIndex(symptom.layer_code), symP = symptom.phase_number - 1;
  const rootL = layerIndex(root.layer_code), rootP = root.phase_number - 1;
  const info = hover ? `${LAYERS[hover.l].code}-${hover.p + 1} · ${LAYERS[hover.l].name} at phase ${hover.p + 1}` : null;

  return (
    <div style={{ padding: "clamp(14px,2.5vw,22px)", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase" }}>Reality matrix · 5 layers × 12 phases</div>
        <div style={{ display: "flex", gap: 14, fontFamily: C.mono, fontSize: 8.5, letterSpacing: 0.5, textTransform: "uppercase", flexWrap: "wrap" }}>
          <span style={{ color: C.accent }}>◆ Symptom</span>
          <span style={{ color: C.gold }}>◆ Root</span>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 560 }}>
          <div style={{ display: "grid", gridTemplateColumns: "84px repeat(12, 1fr)", gap: 4, marginBottom: 4 }}>
            <div />
            {PHASE_GLYPHS.map((g, i) => (
              <div key={i} style={{ textAlign: "center", fontFamily: C.mono, fontSize: 12, color: hover && hover.p === i ? C.gold : C.muted }}>{g}</div>
            ))}
          </div>
          {LAYERS.map((L, li) => (
            <div key={L.code} style={{ display: "grid", gridTemplateColumns: "84px repeat(12, 1fr)", gap: 4, marginBottom: 4, alignItems: "center" }}>
              <div style={{ fontFamily: C.mono, fontSize: 8.5, color: hover && hover.l === li ? C.accent : C.dim, textAlign: "right", paddingRight: 5, lineHeight: 1.1 }}>
                <span style={{ color: C.gold, fontWeight: 700 }}>{L.code}</span> {L.name}
              </div>
              {PHASE_GLYPHS.map((_, pi) => {
                const isRoot = li === rootL && pi === rootP;
                const isSym = li === symL && pi === symP;
                const isHov = hover && hover.l === li && hover.p === pi;
                let bg = "transparent", bd = "rgba(255,255,255,0.05)", col = C.muted;
                if (isRoot) { bg = "rgba(251,191,36,0.18)"; bd = C.gold; col = C.gold; }
                else if (isSym) { bg = "rgba(167,139,250,0.10)"; bd = "rgba(167,139,250,0.4)"; col = C.accent; }
                else if (isHov) { bg = "rgba(255,255,255,0.04)"; bd = "rgba(255,255,255,0.15)"; col = C.dim; }
                return (
                  <div key={pi}
                    onMouseEnter={() => setHover({ l: li, p: pi })}
                    onMouseLeave={() => setHover(null)}
                    style={{ aspectRatio: "1", borderRadius: 6, background: bg, border: `1px solid ${bd}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontSize: 8, color: col, fontWeight: isRoot || isSym ? 700 : 400, transition: "all 0.15s ease", position: "relative" }}>
                    {L.code}-{pi + 1}
                    {isRoot && <span style={{ position: "absolute", top: -5, right: -5, width: 12, height: 12, borderRadius: "50%", background: C.gold, color: "#1a1206", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, minHeight: 20, fontFamily: C.font, fontSize: 13, color: info ? C.text : C.muted, fontStyle: info ? "normal" : "italic" }}>
        {info || "Hover a cell to read its coordinate."}
      </div>
    </div>
  );
}

export default function CoordinateReading({ embedded = false }: { embedded?: boolean }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoordinateResult | null>(null);

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: input.trim(), depth: "coordinate" }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "The coordinate reading is unavailable right now.");
      }
      setResult((await res.json()) as CoordinateResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something interrupted the reading.");
    } finally {
      setLoading(false);
    }
  }

  const r = result;

  return (
    <div style={{ fontFamily: C.font, color: C.text, maxWidth: 760, margin: "0 auto" }}>
      {!embedded && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>● Coordinate reading · the 60 reality coordinates</div>
          <h2 style={{ fontFamily: C.font, fontSize: "clamp(26px,4vw,38px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.5px", margin: "0 0 14px" }}>
            Don&rsquo;t ask what is happening. <span style={{ fontStyle: "italic", color: C.accent }}>Ask where.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.dim, fontStyle: "italic", margin: 0 }}>
            Every situation sits at a coordinate — one of twelve phases, at one of five layers. Most people read only the Events layer. A coordinate reading finds the layer beneath the symptom.
          </p>
        </div>
      )}

      {/* composer */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "clamp(18px,3vw,26px)", marginBottom: 16 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Describe the situation — a crisis, a stall, a shift in an individual, a team, an organization. The reading will locate which layer the real change is on."
          style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", color: C.text, fontFamily: C.font, fontSize: 16, lineHeight: 1.5, resize: "vertical", outline: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button onClick={run} disabled={loading || !input.trim()}
            style={{ padding: "12px 26px", background: loading || !input.trim() ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#FBBF24,#F59E0B)", color: loading || !input.trim() ? C.muted : "#1a1206", border: "none", borderRadius: 999, fontFamily: C.mono, fontSize: 11, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", cursor: loading || !input.trim() ? "default" : "pointer" }}>
            {loading ? "Locating the coordinate…" : "Locate the coordinate →"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "16px 20px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 14, fontFamily: C.font, fontSize: 15, color: "#FF9B9B", marginBottom: 16 }}>{error}</div>
      )}

      {r && (
        <>
          <Matrix symptom={r.symptom} root={r.root} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(135deg, rgba(167,139,250,0.07), rgba(251,191,36,0.05))", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16 }}>
              <div style={{ fontFamily: C.mono, fontSize: 30, fontWeight: 700, color: C.gold, letterSpacing: 2 }}>{r.root.code}</div>
              <div style={{ fontFamily: C.font, fontSize: 21, fontStyle: "italic", color: C.text, marginTop: 4 }}>{r.coordinate_title}</div>
            </div>
            <div style={{ padding: "18px 22px", background: "rgba(167,139,250,0.06)", borderRadius: 12, borderLeft: `2px solid ${C.accent}` }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: C.accent, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>The visible symptom · {r.symptom.code}</div>
              <p style={{ fontFamily: C.font, fontSize: 16, color: C.text, lineHeight: 1.6, margin: 0 }}>{r.symptom_line}</p>
            </div>
            <div style={{ padding: "18px 22px", background: "rgba(251,191,36,0.06)", borderRadius: 12, borderLeft: `2px solid ${C.gold}` }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>The root coordinate · {r.root.code}</div>
              <p style={{ fontFamily: C.font, fontSize: 16, color: C.text, lineHeight: 1.6, margin: 0 }}>{r.root_line}</p>
            </div>
            <div style={{ padding: "18px 22px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>The teaching</div>
              <p style={{ fontFamily: C.font, fontSize: 16, color: C.text, lineHeight: 1.65, margin: 0 }}>{r.teaching}</p>
            </div>
            <div style={{ padding: "18px 22px", background: C.card, borderRadius: 12, borderLeft: `2px solid ${C.gold}` }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>What this coordinate asks</div>
              <p style={{ fontFamily: C.font, fontSize: 16, color: C.text, lineHeight: 1.65, margin: 0 }}>{r.what_it_asks}</p>
            </div>
            <div style={{ padding: "18px 22px", background: C.card, borderRadius: 12, borderLeft: "2px solid #FF6B6B" }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 1.5, color: "#FF6B6B", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>What to avoid</div>
              <p style={{ fontFamily: C.font, fontSize: 16, color: C.text, lineHeight: 1.65, margin: 0 }}>{r.what_to_avoid}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
