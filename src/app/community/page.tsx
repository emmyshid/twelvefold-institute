import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CommunityClient from "./CommunityClient";

// ════════════════════════════════════════════════════════════════
// /community — the AttunedCommunity member portal.
//
// Access tier (decision A): signed-in members only, NO payment gate.
//
// Rationale:
//   The community app has a 5-tier model (Observer free, Reader $200,
//   Interpreter $350, Practitioner $500, Guide by-invitation). Real
//   paid tiers require Stripe subscription billing, which depends on
//   the Stripe Sandbox → Live swap (see architecture § 18).
//
//   Rather than block the whole community experience on that billing
//   work, we ship it now as a free signed-in beta: forums, journal,
//   curriculum, attunement circles, phase tracking, the codex — all
//   live and usable. Tier is currently self-selected in the profile
//   editor (honest framing: free beta while billing is built).
//
//   When Stripe is Live, the follow-up build wires real subscriptions:
//   a community_subscriptions table, customer.subscription.* webhook
//   handling, upgrade buttons → Stripe Checkout, tier content gated by
//   actual paid level, a cancellation flow, and lifecycle emails. None
//   of the work shipped here is thrown away — the gate simply tightens
//   from "signed-in" to "signed-in + active subscription for paid tiers."
//
// This is the same lower-bar pattern as /rhythms — a member benefit,
// not a practitioner credential, and deliberately NOT cert-gated.
// ════════════════════════════════════════════════════════════════

export const metadata = {
  title: "Attuned Community | Twelvefold Institute",
  description:
    "The Attuned Community — a member space for living pattern literacy together. Curriculum, attunement circles, shared practice, and the codex.",
};

export default async function CommunityPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=%2Fcommunity");
  }

  return <CommunityClient />;
}
