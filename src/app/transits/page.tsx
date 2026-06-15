import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TransitsClient from "./TransitsClient";

// ════════════════════════════════════════════════════════════════
// /transits — the Twelvefold Transit.
//
// Reads the current phase (the season) and what its timing asks of you
// today, this week, this season — in two lenses, personal and
// organizational. Timing as curriculum, not prediction.
//
// Access tier: signed-in members only, NO payment (same bar as
// /rhythms). A member benefit on the seeker/leader path.
// ════════════════════════════════════════════════════════════════

export const metadata = {
  title: "The Transit | Twelvefold Institute",
  description:
    "Read the timing. The current phase of Intelligent Order and what it asks of you — and your organization — today, this week, this season. Pattern Literacy for life, leadership, and transformation.",
};

export default async function TransitsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=%2Ftransits");
  }
  return <TransitsClient />;
}
