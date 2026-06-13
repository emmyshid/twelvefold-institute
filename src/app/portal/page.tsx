import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import PortalClient from "./PortalClient";

// ════════════════════════════════════════════════════════════════
// /portal — the certification learning portal.
//
// Gate logic (server-side, runs before any client render):
//   1. Not signed in → redirect to /sign-in?redirect_url=/portal
//   2. Signed in but no succeeded cert payment → friendly enroll page
//   3. Signed in AND has succeeded cert payment → render PortalClient
//
// Payment matching:
//   We match payments by EITHER clerk_user_id OR email. This handles
//   two cases:
//     a) User signed in BEFORE checkout: clerk_user_id is set on the
//        payment row
//     b) User signed up with the same email AFTER checkout: email
//        match catches them
//
// Defense in depth: the /api/org-diagnostic endpoint also requires
// auth, so even if someone could somehow render this page client-side
// without paying, the AI calls would still be blocked. But this gate
// is the primary access control.
// ════════════════════════════════════════════════════════════════

export const metadata = {
  title: "Practitioner Portal | Twelvefold Institute",
};

export default async function PortalPage() {
  const { userId } = await auth();
  if (!userId) {
    // Not signed in — preserve return URL so they come back after sign-in
    redirect("/sign-in?redirect_url=%2Fportal");
  }

  // Get the user's primary email for the payment lookup
  const user = await currentUser();
  const userEmail =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress?.toLowerCase() ?? "";

  // Look for a succeeded certification payment by user OR email
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

  if (paid.length === 0) {
    // Signed in but not enrolled — friendly enrollment-required page
    return <NotEnrolled email={userEmail} />;
  }

  // Enrolled — render the full portal
  return <PortalClient />;
}

// ─── NotEnrolled — friendly fallback for signed-in non-paid users ───

function NotEnrolled({ email }: { email: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        color: "#EDE9F5",
        fontFamily: "'Crimson Text', Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 6vw, 56px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Aurora blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "min(600px, 90vw)",
            height: "min(600px, 90vw)",
            top: "-20%",
            left: "-15%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "min(520px, 85vw)",
            height: "min(520px, 85vw)",
            bottom: "-10%",
            right: "-15%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            fontFamily: "'Space Mono', monospace",
            fontSize: "15px",
            letterSpacing: "1px",
            fontWeight: 700,
            textDecoration: "none",
            marginBottom: "40px",
          }}
        >
          <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
          <span style={{ color: "#A78BFA" }}>Institute</span>
        </Link>

        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "#FBBF24",
            textTransform: "uppercase",
            marginBottom: "20px",
            fontWeight: 700,
          }}
        >
          Practitioner Portal
        </div>
        <h1
          style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            fontSize: "clamp(32px, 5.5vw, 48px)",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            margin: "0 0 24px",
          }}
        >
          You&rsquo;re not enrolled yet.
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "rgba(237,233,245,0.7)",
            lineHeight: 1.65,
            marginBottom: "16px",
          }}
        >
          The portal opens to practitioners who have completed enrollment in the
          Twelvefold Practitioner Certification.
        </p>
        {email && (
          <p
            style={{
              fontSize: "14px",
              color: "rgba(237,233,245,0.45)",
              lineHeight: 1.6,
              marginBottom: "36px",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.3px",
            }}
          >
            Signed in as <span style={{ color: "#A78BFA" }}>{email}</span>.
            <br />
            If you paid using a different email, sign in with that one.
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "8px",
          }}
        >
          <Link
            href="/certification"
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
              color: "#1a1206",
              textDecoration: "none",
              borderRadius: "999px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              letterSpacing: "1px",
              fontWeight: 700,
              textTransform: "uppercase",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            See the Certification
          </Link>
          <Link
            href="/"
            style={{
              padding: "14px 28px",
              background: "transparent",
              color: "#EDE9F5",
              textDecoration: "none",
              borderRadius: "999px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              letterSpacing: "1px",
              fontWeight: 700,
              textTransform: "uppercase",
              border: "1px solid rgba(255,255,255,0.14)",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            ← Home
          </Link>
        </div>

        <p
          style={{
            marginTop: "44px",
            fontSize: "13px",
            color: "rgba(237,233,245,0.38)",
            lineHeight: 1.6,
          }}
        >
          If you believe you should have access — for example, your payment is
          under a different email — reply to your admission email and we&rsquo;ll
          link the accounts.
        </p>
      </div>
    </div>
  );
}
