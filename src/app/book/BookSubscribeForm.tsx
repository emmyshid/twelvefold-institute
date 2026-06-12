"use client";

import { useState } from "react";

const T = {
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.6)",
  textMuted: "rgba(237,233,245,0.34)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.14)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export default function BookSubscribeForm() {
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/book/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          motivation: motivation.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Could not save that.");
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          padding: "32px 28px",
          background: "rgba(74,222,128,0.05)",
          border: "1px solid rgba(74,222,128,0.20)",
          borderRadius: "14px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "11px",
            letterSpacing: "2px",
            color: "#4ADE80",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          ✓ You're on the list
        </div>
        <div style={{ fontFamily: T.font, fontSize: "17px", color: T.text, lineHeight: 1.6 }}>
          We'll write when there's news. In the meantime, the framework is already practicable —
          start at{" "}
          <a href="/read" style={{ color: T.accent, textDecoration: "underline" }}>
            twelvefold.institute/read
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "clamp(24px, 4vw, 36px)",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${T.border}`,
        borderRadius: "14px",
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: "10px",
          letterSpacing: "2px",
          color: T.gold,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Launch list
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "clamp(20px, 3.5vw, 26px)",
          color: T.text,
          fontWeight: 600,
          marginBottom: "10px",
          letterSpacing: "-0.3px",
        }}
      >
        Be notified when <em>Pattern Literacy</em> publishes
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: "15px",
          color: T.textDim,
          marginBottom: "22px",
          lineHeight: 1.6,
        }}
      >
        Currently with publishers. We'll write when there's a pre-order link, a release date, or
        meaningful news — and not before.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 18px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.borderLight}`,
            borderRadius: "10px",
            color: T.text,
            fontFamily: T.font,
            fontSize: "16px",
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.borderLight)}
        />
        <textarea
          placeholder="Optional: what drew you to this book?"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 18px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.borderLight}`,
            borderRadius: "10px",
            color: T.text,
            fontFamily: T.font,
            fontSize: "15px",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.55,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.borderLight)}
        />

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: "10px",
              fontFamily: T.font,
              fontSize: "14px",
              color: "#FF9B9B",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!email.trim() || submitting}
          style={{
            padding: "14px 24px",
            background: T.gradGold,
            color: "#1a1206",
            border: "none",
            borderRadius: "10px",
            fontFamily: T.fontMono,
            fontSize: "12px",
            letterSpacing: "1px",
            fontWeight: 700,
            cursor: !email.trim() || submitting ? "not-allowed" : "pointer",
            opacity: !email.trim() || submitting ? 0.5 : 1,
            textTransform: "uppercase",
            transition: "all 0.2s " + T.ease,
            minHeight: "48px",
          }}
        >
          {submitting ? "Saving…" : "Add me to the list"}
        </button>

        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: "10px",
            color: T.textMuted,
            letterSpacing: "0.5px",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          We don't share your email. We don't write often. Unsubscribe in any message.
        </div>
      </div>
    </div>
  );
}
