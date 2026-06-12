"use client";

import { useEffect } from "react";

// /sign-up — see /sign-in for the full rationale. Same flow, sign-up route.
export default function SignUpPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect_url") || "/";
    const target = `https://accounts.twelvefold.institute/sign-up?redirect_url=${encodeURIComponent(redirect)}`;
    window.location.replace(target);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        color: "#EDE9F5",
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "15px",
          letterSpacing: "1px",
          fontWeight: 700,
          marginBottom: "20px",
        }}
      >
        <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
        <span style={{ color: "#A78BFA" }}>Institute</span>
      </div>
      <div
        style={{
          fontFamily: "'Crimson Text', Georgia, serif",
          fontSize: "18px",
          fontStyle: "italic",
          color: "rgba(237,233,245,0.6)",
        }}
      >
        Creating your account…
      </div>
    </div>
  );
}
