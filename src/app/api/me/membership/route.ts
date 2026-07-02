import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCommunityTierPricing } from "@/lib/pricing";

export const runtime = "nodejs";

// GET /api/me/membership
//
// Returns:
//   • tier            — current membership tier (observer if none / past_due)
//   • status          — active | past_due | canceled
//   • currentPeriodEnd
//   • pricing         — { tierId: displayPrice } map for the paid tiers,
//                        resolved through the admin overrides layer.
//                        Used by CommunityClient to render current prices
//                        without hardcoding them in the LEVELS constant.
//
// Tiers: observer (free) | reader | interpreter | practitioner |
//        guide (by invitation)
//
// Source of truth: the `memberships` table, updated by the Stripe webhook
// on subscription lifecycle events. Pricing is resolved from the
// product_pricing table (admin overrides) with hardcoded fallbacks.
//
// Always returns 200 — { tier: "observer", status: "active", pricing: {...} }
// when not signed in, so the UI degrades gracefully for anonymous
// visitors. Pricing is included even for signed-out users because
// the upgrade card is visible to all.
export async function GET() {
  const { userId } = await auth();

  // Fetch pricing in parallel with everything else. Failure here should
  // not block the response — the client falls back to hardcoded prices.
  const pricingPromise = getCommunityTierPricing().catch((e) => {
    console.error("community pricing lookup failed:", e);
    return {} as Record<string, string>;
  });

  if (!userId) {
    const pricing = await pricingPromise;
    return NextResponse.json({ tier: "observer", status: "active", pricing });
  }

  try {
    const [rows, pricing] = await Promise.all([
      db
        .select({
          tier: memberships.tier,
          status: memberships.status,
          currentPeriodEnd: memberships.currentPeriodEnd,
        })
        .from(memberships)
        .where(eq(memberships.clerkUserId, userId))
        .limit(1),
      pricingPromise,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ tier: "observer", status: "active", pricing });
    }

    const m = rows[0];
    // If status is canceled or past_due, the customer no longer has
    // active access to paid tiers — return observer to be safe.
    const effectiveTier = m.status === "active" ? m.tier : "observer";
    return NextResponse.json({
      tier: effectiveTier,
      status: m.status,
      currentPeriodEnd: m.currentPeriodEnd,
      pricing,
    });
  } catch (e) {
    console.error("membership lookup failed:", e);
    const pricing = await pricingPromise;
    // Fail closed — show observer/free rather than risk surfacing
    // paid content to someone we couldn't verify.
    return NextResponse.json({ tier: "observer", status: "active", pricing });
  }
}
