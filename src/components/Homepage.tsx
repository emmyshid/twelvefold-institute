"use client";

import { useState } from "react";

// ════════════════════════════════════════════════════════════════
// REPLACE THIS with your full Homepage-v2 component.
//
// Two changes when you port it:
//   1. Add "use client" at the top (it uses hooks).
//   2. Swap the direct Anthropic fetch for the call below — POST to
//      /api/reading instead of api.anthropic.com. The server holds the
//      key; the client never sees it.
//
// This stub is intentionally tiny but live: once your env is set you can
// hit the reading endpoint end-to-end from here.
// ════════════════════════════════════════════════════════════════

type Summary = {
  pattern_name: string;
  phase: string;
  micro_state: string;
  likely_curriculum: string;
  active_lesson: string;
  recommended_participation: string;
};

export default function Homepage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something interrupted the reading.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", maxWidth: 680, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 56, fontWeight: 600, lineHeight: 1.05 }}>
        Something invisible is running your life.
      </h1>
      <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontStyle: "italic", color: "#A78BFA", marginTop: 14 }}>
        You can learn to read it.
      </p>

      <div style={{ marginTop: 40 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="What keeps happening?"
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, color: "#EDE9F5", fontFamily: "'Crimson Text', serif", fontSize: 17, padding: 15, resize: "vertical" }}
        />
        <button
          onClick={run}
          style={{ marginTop: 14, padding: "13px 28px", borderRadius: 999, border: "none", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", fontFamily: "'Space Mono', monospace", fontSize: 13, cursor: "pointer", opacity: loading || !input.trim() ? 0.6 : 1 }}
        >
          {loading ? "Reading the pattern…" : "Read my pattern"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 20, color: "#FF9B9B", fontFamily: "'Crimson Text', serif" }}>{error}</p>
      )}

      {summary && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 34, fontStyle: "italic" }}>{summary.pattern_name}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(237,233,245,0.6)", marginTop: 6 }}>
            {summary.phase} · {summary.micro_state}
          </div>
          <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, marginTop: 16, lineHeight: 1.55 }}>{summary.likely_curriculum}</p>
          <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, marginTop: 10, lineHeight: 1.55 }}>{summary.active_lesson}</p>
          <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, marginTop: 10, lineHeight: 1.55 }}>{summary.recommended_participation}</p>
        </div>
      )}
    </main>
  );
}
