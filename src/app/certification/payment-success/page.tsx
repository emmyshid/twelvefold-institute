import { stripe } from "@/lib/stripe";
import Link from "next/link";

interface SearchParams {
  session_id?: string;
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let customerEmail: string | null = null;
  let amount: string | null = null;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
      if (session.amount_total) {
        amount = `$${(session.amount_total / 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    } catch (e) {
      console.error("Could not retrieve session", e);
    }
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
      <div aria-hidden style={{ position: "fixed", width: 540, height: 540, top: -140, left: -110, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.32), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", width: 460, height: 460, top: 320, right: -130, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.18), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

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
              maxWidth: 640,
              width: "100%",
              padding: "clamp(32px, 6vw, 56px)",
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
                color: "#FBBF24",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FBBF24", display: "inline-block" }} />
              Payment Received
            </div>

            <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "16px" }}>✓</div>

            <h1 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: "18px" }}>
              Your spot is reserved.
            </h1>

            <p style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "clamp(17px, 2.4vw, 19px)", color: "rgba(237,233,245,0.7)", lineHeight: 1.6, marginBottom: "28px" }}>
              Welcome to the Twelvefold Practitioner Certification. {customerEmail ? `A receipt has been sent to ${customerEmail}. ` : ""}We will be in touch within five business days with cohort details, the preparatory reading list, and your enrollment paperwork.
            </p>

            {amount && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 22px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "999px", marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.5px", color: "rgba(237,233,245,0.6)", textTransform: "uppercase" }}>Paid</span>
                <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "20px", fontWeight: 600, color: "#FBBF24" }}>{amount}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.03)", borderRadius: "11px", textAlign: "left" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "#A78BFA", textTransform: "uppercase", marginBottom: "8px" }}>What happens next</div>
                <ol style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "16px", color: "rgba(237,233,245,0.85)", lineHeight: 1.75, paddingLeft: "20px" }}>
                  <li>You will receive a welcome email within 24 hours.</li>
                  <li>Cohort enrollment paperwork and the preparatory reading list within five business days.</li>
                  <li>Phase I (Foundation) materials are released two weeks before your cohort begins.</li>
                  <li>Your supervised practicum opens after Phase II is complete.</li>
                </ol>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "30px" }}>
              <Link
                href="/"
                style={{
                  padding: "12px 24px",
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
                ← Back to home
              </Link>
              <Link
                href="/account"
                style={{
                  padding: "12px 24px",
                  borderRadius: "999px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12.5px",
                  letterSpacing: "0.8px",
                  background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
                  color: "#fff",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Go to my account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
