import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// ════════════════════════════════════════════════════════════════
// /read — the gateway to PatternOS.
// Signed-in users go straight through to /read/app.
// Signed-out users see a short pitch and a sign-in CTA.
// ════════════════════════════════════════════════════════════════

export default async function ReadGateway() {
  const { userId } = await auth();
  if (userId) {
    redirect("/read/app");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        color: "#EDE9F5",
        fontFamily: "'Crimson Text', Georgia, serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>

      {/* Aurora */}
      <div aria-hidden style={{ position: "fixed", width: 560, height: 560, top: -160, left: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.34), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", width: 460, height: 460, bottom: -120, right: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.16), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px clamp(20px, 5vw, 64px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Space Mono', monospace", fontSize: "15px", letterSpacing: "1px", fontWeight: 700 }}>
            <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
            <span style={{ color: "#A78BFA" }}>Institute</span>
          </Link>
          <Link
            href="/"
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.8px",
              background: "transparent",
              color: "#EDE9F5",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </nav>

        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)",
          }}
        >
          <div
            style={{
              maxWidth: 680,
              width: "100%",
              padding: "clamp(36px, 6vw, 56px)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              backdropFilter: "blur(20px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#A78BFA",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FBBF24", display: "inline-block" }} />
              PatternOS
            </div>

            <h1
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 600,
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              The reading app.
            </h1>

            <p style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "clamp(17px, 2.4vw, 20px)", color: "rgba(237,233,245,0.7)", lineHeight: 1.6, marginBottom: "32px", maxWidth: 540, margin: "0 auto 32px" }}>
              Read your patterns in depth. Every reading saved to your history. Watch how the patterns move across time.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "32px",
              }}
            >
              <Link
                href="/sign-in?redirect_url=/read/app"
                style={{
                  padding: "14px 30px",
                  borderRadius: "999px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12.5px",
                  letterSpacing: "0.8px",
                  background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                  color: "#1a1206",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up?redirect_url=/read/app"
                style={{
                  padding: "14px 30px",
                  borderRadius: "999px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12.5px",
                  letterSpacing: "0.8px",
                  background: "transparent",
                  color: "#EDE9F5",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Create account
              </Link>
            </div>

            <div
              style={{
                padding: "20px 22px",
                background: "rgba(167,139,250,0.06)",
                border: "1px solid rgba(167,139,250,0.18)",
                borderRadius: "11px",
                textAlign: "left",
              }}
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "#A78BFA", textTransform: "uppercase", marginBottom: "10px" }}>
                Not ready for an account?
              </div>
              <div style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "15px", color: "rgba(237,233,245,0.7)", lineHeight: 1.55, marginBottom: "12px" }}>
                You can try a single reading free on the homepage — no account needed. Sign in only when you want to save your history.
              </div>
              <Link
                href="/#try-it"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "#FBBF24",
                  textDecoration: "none",
                }}
              >
                Try a free reading →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
