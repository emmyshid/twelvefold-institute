"use client";

import { useState } from "react";

// REPLACE with your full CertificationPage component (add "use client").
// Its ApplyPanel should POST to /api/certification/apply, as shown here.

export default function CertificationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      const res = await fetch("/api/certification/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, motivation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't submit.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't submit.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", maxWidth: 600, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 48, fontWeight: 600 }}>Learn to read patterns for others.</h1>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#FBBF24", marginTop: 16 }}>200 hours · 8–16 weeks · $6,500</p>

      {sent ? (
        <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontStyle: "italic", marginTop: 40 }}>Your application is in. We read every one.</p>
      ) : (
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Your name", name, setName], ["Email", email, setEmail]].map(([ph, val, set]) => (
            <input key={ph as string} value={val as string} onChange={(e) => (set as (s: string) => void)(e.target.value)} placeholder={ph as string}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, color: "#EDE9F5", fontFamily: "'Crimson Text', serif", fontSize: 16, padding: "13px 15px" }} />
          ))}
          <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={3} placeholder="Why do you want to learn to read patterns?"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, color: "#EDE9F5", fontFamily: "'Crimson Text', serif", fontSize: 16, padding: "13px 15px", resize: "vertical" }} />
          {error && <p style={{ color: "#FF9B9B", fontFamily: "'Crimson Text', serif" }}>{error}</p>}
          <button onClick={submit} style={{ padding: "14px 30px", borderRadius: 999, border: "none", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", fontFamily: "'Space Mono', monospace", fontSize: 13, cursor: "pointer" }}>Submit application</button>
        </div>
      )}
    </main>
  );
}
