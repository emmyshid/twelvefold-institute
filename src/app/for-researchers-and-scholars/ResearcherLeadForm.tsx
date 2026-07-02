"use client";

import { useState } from "react";

// Research partnership inquiry form. Reuses the /api/institutions/consult
// endpoint with scope="research:[type]" so admin can filter research
// inquiries as their own segment while sharing infrastructure.
//
// No new schema, no new endpoint. Same pattern as Week 11's
// /for-institutions/[sector] pages.

const T = {
  bg: "#06060F",
  bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#EDE9F5",
  textDim: "rgba(237,233,245,0.65)",
  textMuted: "rgba(237,233,245,0.4)",
  accent: "#A78BFA",
  gold: "#FBBF24",
  gradGold: "linear-gradient(135deg, #FBBF24, #F59E0B)",
  font: "'Crimson Text', Georgia, serif",
  fontMono: "'Space Mono', 'Courier New', monospace",
};

type InquiryType =
  | "partnership"
  | "graduate_study"
  | "review_citation"
  | "just_learning";

const INQUIRY_LABELS: Record<InquiryType, string> = {
  partnership: "Institutional partnership",
  graduate_study: "Graduate research / PhD access",
  review_citation: "Peer review or citation",
  just_learning: "Just following the work",
};

export default function ResearcherLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [role, setRole] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType | "">("");
  const [message, setMessage] = useState("");
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
      setError("Please include a valid academic or work email.");
      return;
    }
    if (affiliation.trim().length < 2) {
      setError("Please include your affiliation (university, institute, or independent).");
      return;
    }
    setSubmitting(true);
    try {
      // Compose scope: "research:[inquiryType]" or just "research" if
      // no type selected. Admin can filter by prefix.
      const scope = inquiryType ? `research:${inquiryType}` : "research";

      const res = await fetch("/api/institutions/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: affiliation.trim(),
          role: role.trim() || undefined,
          scope,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
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
          padding: "36px 32px",
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
            fontSize: "24px",
            fontWeight: 600,
            color: T.text,
            margin: "0 0 12px",
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
            maxWidth: "460px",
          }}
        >
          One of us will reply within a week. If you&rsquo;re working on a paper or grant with a hard deadline, flag it in your reply and we&rsquo;ll prioritize.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 15px",
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
        padding: "32px 34px",
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
          marginBottom: "10px",
        }}
      >
        Research collective
      </div>
      <h3
        style={{
          fontFamily: T.font,
          fontSize: "26px",
          fontWeight: 600,
          color: T.text,
          margin: "0 0 8px",
          lineHeight: 1.25,
          letterSpacing: "-0.3px",
        }}
      >
        Get in touch.
      </h3>
      <p
        style={{
          fontFamily: T.font,
          fontSize: "16px",
          color: T.textDim,
          margin: "0 0 26px",
          lineHeight: 1.6,
        }}
      >
        We reply personally to every inquiry. If you&rsquo;re working on something adjacent — a study, a review, a curriculum — we want to know.
      </p>

      <div style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
              placeholder="you@university.edu"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
              onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
              Affiliation
            </label>
            <input
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="University, institute, or independent"
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
              Role or field (optional)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. PhD student, clinical psychology"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
              onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            />
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
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            What kind of inquiry (optional)
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(Object.keys(INQUIRY_LABELS) as InquiryType[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInquiryType(inquiryType === p ? "" : p)}
                style={{
                  padding: "9px 15px",
                  borderRadius: "999px",
                  border: `1px solid ${inquiryType === p ? T.accent : T.border}`,
                  background: inquiryType === p ? "rgba(167,139,250,0.12)" : "transparent",
                  color: inquiryType === p ? T.accent : T.textDim,
                  fontFamily: T.fontMono,
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {INQUIRY_LABELS[p]}
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
            What are you working on? (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A few sentences about your research area or interest."
            rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = T.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
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
          marginTop: "20px",
          padding: "15px 26px",
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
        {submitting ? "Sending…" : "Submit inquiry →"}
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
        We reply within one week. Personal reply, not automated.
      </p>
    </div>
  );
}
