import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/me/cert-status
//
// Returns { isCertified: boolean } indicating whether the current user
// has a succeeded payment for product='certification'. Used by:
//   • /read/app — decides whether to show the Master-mode toggle
//   • Portal sidebar (future) — decides whether to show practitioner nav items
//
// Match strategy mirrors /portal/page.tsx: clerk_user_id OR email,
// so payments made before-signup or after-signup both count.
//
// Always returns 200 — { isCertified: false } when not signed in,
// rather than 401. This lets the UI silently degrade for anonymous
// users without showing error states.
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ isCertified: false });
  }

  const user = await currentUser();
  const email =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress?.toLowerCase() ?? "";

  const matchClauses = [eq(payments.clerkUserId, userId)];
  if (email) matchClauses.push(eq(payments.email, email));

  try {
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
    return NextResponse.json({ isCertified: paid.length > 0 });
  } catch (e) {
    console.error("cert-status check failed:", e);
    // Fail closed — assume not certified rather than showing
    // practitioner features to someone we couldn't verify
    return NextResponse.json({ isCertified: false });
  }
}
