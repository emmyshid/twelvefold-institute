"use client";

import { useEffect } from "react";

// ════════════════════════════════════════════════════════════════
// /sign-in — redirect to Clerk-hosted Account Portal.
//
// IMPORTANT: the redirect_url query param sent to the hosted Portal
// MUST be a fully-qualified URL (https://twelvefold.institute/…).
// If we send a relative path like "/", Clerk's hosted page resolves
// it against its own origin (accounts.twelvefold.institute/) and
// after auth the user gets stuck on Clerk's user dashboard instead
// of returning to our app.
// ════════════════════════════════════════════════════════════════

export default function SignInPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect_url") || "/";
    // Resolve to an absolute URL against our origin, no matter what
    // the source query param looked like.
    const absolute = redirect.startsWith("http")
      ? redirect
      : `${window.location.origin}${redirect.startsWith("/") ? redirect : "/" + redirect}`;
    const target = `https://accounts.twelvefold.institute/sign-in?redirect_url=${encodeURIComponent(absolute)}`;
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
        Taking you to sign in…
      </div>
    </div>
  );
}
