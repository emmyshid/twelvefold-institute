import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/me/membership
//
// Returns { tier, status } for the current user's Attuned Community tier.
// Tiers: observer (free) | reader ($200) | interpreter ($350) |
//        practitioner ($500) | guide (by invitation)
// Status: active | past_due | canceled
//
// Source of truth: the `memberships` table, updated by the Stripe webhook
// on subscription lifecycle events.
//
// Used by:
//   • /community CommunityClient — gates content per tier, shows upgrade UI
//   • Future: /portal — could surface community tier in addition to cert status
//
// Always returns 200 — { tier: "observer", status: "active" } when not
// signed in, so the UI degrades gracefully for anonymous visitors.
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ tier: "observer", status: "active" });
  }

  try {
    const rows = await db
      .select({
        tier: memberships.tier,
        status: memberships.status,
        currentPeriodEnd: memberships.currentPeriodEnd,
      })
      .from(memberships)
      .where(eq(memberships.clerkUserId, userId))
      .limit(1);

    if (rows.length === 0) {
      // No membership row yet — treat as free observer
      return NextResponse.json({ tier: "observer", status: "active" });
    }

    const m = rows[0];
    // If status is canceled or past_due, the customer no longer has
    // active access to paid tiers — return observer to be safe.
    const effectiveTier = m.status === "active" ? m.tier : "observer";
    return NextResponse.json({
      tier: effectiveTier,
      status: m.status,
      currentPeriodEnd: m.currentPeriodEnd,
    });
  } catch (e) {
    console.error("membership lookup failed:", e);
    // Fail closed — show observer/free rather than risk surfacing
    // paid content to someone we couldn't verify.
    return NextResponse.json({ tier: "observer", status: "active" });
  }
}
