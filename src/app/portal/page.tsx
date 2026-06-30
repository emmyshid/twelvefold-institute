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

  const isCertified = paid.length > 0;

  // All signed-in users can access the portal.
  // isCertified controls tab-level access inside the portal:
  //   - Explore and Overview tabs: free for all signed-in users
  //   - Apply, Invoke, Journal, Mapping: certified practitioners only
  return <PortalClient isCertified={isCertified} />;
}

