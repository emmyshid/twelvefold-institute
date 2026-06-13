import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";

// ════════════════════════════════════════════════════════════════
// /read — the explainer + connect-with-practitioner page.
//
// Policy: full pattern readings are practitioner-led. Individuals
// get the free try-it on the homepage; for a full reading they
// connect with a certified practitioner.
//
// Three audiences route through here:
//   • Signed out                  → see the explainer + CTAs
//   • Signed in, NOT certified     → see the explainer + practitioner CTAs
//   • Signed in, IS certified      → redirect straight to /read/app
// ════════════════════════════════════════════════════════════════

export default async function ReadGateway() {
  const { userId } = await auth();

  // If signed in, check cert payment status. If they're a practitioner,
  // skip the explainer entirely and route them to their workspace.
  if (userId) {
    const user = await currentUser();
    const userEmail =
      user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress?.toLowerCase() ?? "";
    const matchClauses = [eq(payments.clerkUserId, userId)];
    if (userEmail) matchClauses.push(eq(payments.email, userEmail));
    const paid = await db
      .select({ id: payments.id })
      .from(payments)
      .where(
        and(
          eq(payments.product, "certification"),
          eq(payments.status, "succeeded"),
          or(...matchClauses),
        ),
      )
      .limit(1);
    if (paid.length > 0) {
      redirect("/read/app");
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
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { color: inherit; }
      `}</style>

      <div aria-hidden style={{ position: "fixed", width: "min(640px, 90vw)", height: "min(640px, 90vw)", top: -160, left: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.30), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "fixed", width: "min(500px, 85vw)", height: "min(500px, 85vw)", bottom: -120, right: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.14), transparent 70%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "clamp(28px, 6vw, 56px) clamp(20px, 5vw, 48px) clamp(60px, 10vw, 100px)" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(40px, 8vw, 80px)" }}>
          <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: "15px", letterSpacing: "1px", fontWeight: 700, textDecoration: "none" }}>
            <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
            <span style={{ color: "#A78BFA" }}>Institute</span>
          </Link>
          <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "rgba(237,233,245,0.5)", textTransform: "uppercase", textDecoration: "none" }}>← Home</Link>
        </nav>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "2.5px", color: "#FBBF24", textTransform: "uppercase", fontWeight: 700, marginBottom: "20px" }}>● Pattern reading</div>
        <h1 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "clamp(38px, 7vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 28px", maxWidth: 720 }}>A full reading is the work of a practitioner.</h1>
        <p style={{ fontSize: "clamp(17px, 2.5vw, 21px)", lineHeight: 1.6, color: "rgba(237,233,245,0.72)", maxWidth: 640, marginBottom: "24px", fontStyle: "italic" }}>
          Patterns are easy to glimpse. Reading them carefully — and acting on what you read — is a craft.
        </p>
        <p style={{ fontSize: "16.5px", lineHeight: 1.7, color: "rgba(237,233,245,0.62)", maxWidth: 620, marginBottom: "44px" }}>
          The brief reading on the homepage is a doorway — enough to feel that your situation has a name and a place in a larger cycle. For a full reading — the pattern named, the phase placed, the alignment read, the participation prescribed, six traditions weighed in — you work with a certified Twelvefold practitioner. They&rsquo;re trained specifically to do this with you, for you, over time.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          <Link href="/#try-it" style={{ display: "block", padding: "28px 26px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", textDecoration: "none", borderLeft: "3px solid #FBBF24" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "#FBBF24", textTransform: "uppercase", fontWeight: 700, marginBottom: "10px" }}>For yourself</div>
            <div style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#EDE9F5", marginBottom: "8px", letterSpacing: "-0.3px" }}>Try a brief reading</div>
            <div style={{ fontSize: "15px", color: "rgba(237,233,245,0.62)", lineHeight: 1.6 }}>Describe a situation on the homepage and get a pattern name, a phase, and one teaching. Free. No sign-in required.</div>
          </Link>

          <Link href="/certification" style={{ display: "block", padding: "28px 26px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", textDecoration: "none", borderLeft: "3px solid #A78BFA" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "#A78BFA", textTransform: "uppercase", fontWeight: 700, marginBottom: "10px" }}>Become the practitioner</div>
            <div style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#EDE9F5", marginBottom: "8px", letterSpacing: "-0.3px" }}>Practitioner Certification</div>
            <div style={{ fontSize: "15px", color: "rgba(237,233,245,0.62)", lineHeight: 1.6 }}>200-hour training in pattern literacy. Read patterns rigorously for yourself, your clients, your community.</div>
          </Link>
        </div>

        <div style={{ padding: "24px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "rgba(237,233,245,0.5)", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>Want a full reading?</div>
            <p style={{ fontSize: "15.5px", color: "rgba(237,233,245,0.72)", lineHeight: 1.6 }}>Certified Twelvefold practitioners offer full pattern readings. Our practitioner directory opens with the first cohort&rsquo;s graduation. In the meantime, write to us and we&rsquo;ll connect you with someone available now.</p>
          </div>
          <a href="mailto:hello@twelvefold.institute?subject=Looking%20for%20a%20practitioner" style={{ padding: "13px 26px", background: "transparent", color: "#EDE9F5", textDecoration: "none", borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.18)", minHeight: "44px", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>Email Us →</a>
        </div>

        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <Link href="/#try-it" style={{ display: "inline-flex", alignItems: "center", padding: "16px 36px", background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1a1206", textDecoration: "none", borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "1.2px", fontWeight: 700, textTransform: "uppercase", minHeight: "48px" }}>Try a reading on the homepage →</Link>
        </div>
      </div>
    </div>
  );
}
