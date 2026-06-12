"use client";

import { useEffect } from "react";

// ════════════════════════════════════════════════════════════════
// /sign-in — redirect to Clerk-hosted Account Portal.
//
// Why this exists instead of an embedded <SignIn /> component:
// Clerk's free tier sets session cookies on the subdomain
// (clerk.twelvefold.institute) which mobile browsers reject as
// cross-site cookies during the post-auth redirect back to the main
// app. The hosted Account Portal at accounts.twelvefold.institute
// uses Clerk's own first-party cookie + transfer flow that works
// reliably on every browser including iOS Safari and mobile Chrome.
//
// Trade-off: users see Clerk's default white-themed sign-in instead
// of our dark-themed component. Worth it for guaranteed mobile auth.
// If/when Clerk plan is upgraded to Pro, this can revert to the
// embedded component with a cookie-domain config change.
// ════════════════════════════════════════════════════════════════

export default function SignInPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Preserve the post-auth destination if the user was sent here
    // by middleware (e.g. they tried to reach /read/app while signed out).
    const redirect = params.get("redirect_url") || "/";
    const target = `https://accounts.twelvefold.institute/sign-in?redirect_url=${encodeURIComponent(redirect)}`;
    window.location.replace(target);
  }, []);

  // Brief landing screen shown for the ~100ms before the redirect fires.
  // Matches site design so the user doesn't see a white flash.
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
