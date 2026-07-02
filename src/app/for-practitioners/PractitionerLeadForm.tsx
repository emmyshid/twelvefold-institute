"use client";

import { useState } from "react";
import { trackLeadSubmit } from "@/lib/analytics";

const T = {
  bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.6)",
  textMuted: "rgba(237,233,245,0.34)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

type PracticeType = "therapist" | "coach" | "od_consultant" | "educator" | "other";

const PRACTICE_LABELS: Record<PracticeType, string> = {
  therapist: "Therapist / counsellor",
  coach: "Coach",
  od_consultant: "OD / consultant",
  educator: "Educator",
  other: "Other",
};

export default function PractitionerLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [practiceType, setPracticeType] = useState<PracticeType | "">("");
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError("Please include your name.");
      return;
    }
    if (!email.includes("@") || email.length < 5) {
      setError("Please include a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/certification/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          motivation: motivation.trim() || undefined,
          practiceType: practiceType || undefined,
          source: "for-practitioners",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      trackLeadSubmit("practitioner", practiceType || undefined);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        style={{
          padding: "32px 32px",
          background: "rgba(74,222,128,0.06)",
          border: "1px solid rgba(74,222,128,0.25)",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "10px",
            letterSpacing: "2.5px",
            color: "#4ADE80",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          ✓ Received
        </div>
        <h3
          style={{
            fontFamily: T.font,
            fontSize: "22px",
            fontWeight: 600,
            color: T.text,
            margin: "0 0 10px",
            lineHeight: 1.3,
          }}
        >
          Thank you — we&rsquo;ll be in touch.
        </h3>
        <p
          style={{
            fontFamily: T.font,
            fontSize: "16px",
            color: T.textDim,
            lineHeight: 1.6,
            margin: "0 auto",
            maxWidth: "440px",
          }}
        >
          We&rsquo;ll send you cohort dates, the curriculum overview, and what practising graduates say. Reply directly if you want to talk to someone first.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    color: T.text,
    fontFamily: T.font,
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  };

  return (
    <div
      style={{
        padding: "28px 32px",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "9px",
          letterSpacing: "2.5px",
          color: T.gold,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Express interest
      </div>
      <h3
        style={{
          fontFamily: T.font,
          fontSize: "22px",
          fontWeight: 600,
          color: T.text,
          margin: "0 0 6px",
          lineHeight: 1.25,
        }}
      >
        Bring pattern literacy into your practice.
      </h3>
      <p
        style={{
          fontFamily: T.font,
          fontSize: "15px",
          color: T.textDim,
          margin: "0 0 22px",
          lineHeight: 1.55,
        }}
      >
        We&rsquo;ll send cohort dates, the full curriculum, and what graduates say. No commitment.
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        <div>
          <label
            style={{
              display: "block",
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: T.textMuted,
              textTransform: "uppercase",
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: T.textMuted,
              textTransform: "uppercase",
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: T.textMuted,
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            Practice type (optional)
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(Object.keys(PRACTICE_LABELS) as PracticeType[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPracticeType(practiceType === p ? "" : p)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: `1px solid ${practiceType === p ? T.accent : T.border}`,
                  background: practiceType === p ? "rgba(167,139,250,0.12)" : "transparent",
                  color: practiceType === p ? T.accent : T.textDim,
                  fontFamily: T.fontMono,
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {PRACTICE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: T.fontMono,
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: T.textMuted,
              textTransform: "uppercase",
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            What draws you to this? (optional)
          </label>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="A line or two about what you&rsquo;re looking for."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(255,107,107,0.08)",
            border: "1px solid rgba(255,107,107,0.25)",
            fontFamily: T.font,
            fontSize: "14px",
            color: "#FF9B9B",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "14px 26px",
          background: submitting ? "rgba(251,191,36,0.4)" : T.gradGold,
          color: "#1a1206",
          border: "none",
          borderRadius: "999px",
          fontFamily: T.fontMono,
          fontSize: "12px",
          letterSpacing: "1px",
          fontWeight: 700,
          textTransform: "uppercase",
          cursor: submitting ? "wait" : "pointer",
          minHeight: "48px",
          transition: "all 0.2s ease",
        }}
      >
        {submitting ? "Sending…" : "Request cohort details →"}
      </button>

      <p
        style={{
          marginTop: "14px",
          fontFamily: T.fontMono,
          fontSize: "10px",
          color: T.textMuted,
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        We&rsquo;ll reply within two business days. No automated drip.
      </p>
    </div>
  );
}
