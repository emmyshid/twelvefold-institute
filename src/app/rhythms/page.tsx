import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RhythmsClient from "./RhythmsClient";

// ════════════════════════════════════════════════════════════════
// /rhythms — the Intelligent Rhythms learning app.
//
// Access tier (decision B): signed-in members only, NO payment gate.
//
// Rationale (from the Solution Architecture's audience map):
//   Rhythms sits on the Seeker's ongoing-practice path
//   (PatternOS reading → Rhythms → Community membership). Keeping it
//   free-but-gated means:
//     • It's accessible to any seeker who creates a free account
//       (no $6,500 cert barrier, unlike /read/app and /portal)
//     • We capture the account + email, which feeds the eventual
//       Community membership funnel
//     • Progress (tracked rhythms, saved reflections) persists
//       per-user across sessions and devices
//
// This is deliberately a LOWER bar than the practitioner tools
// (/read/app, /portal) which require cert payment. Rhythms is a
// member benefit, not a practitioner credential.
// ════════════════════════════════════════════════════════════════

export const metadata = {
  title: "Intelligent Rhythms | Twelvefold Institute",
  description:
    "Track the rhythms moving through your life across 11 life domains and 10 planetary intelligences. A member practice from Twelvefold Institute.",
};

export default async function RhythmsPage() {
  const { userId } = await auth();
  if (!userId) {
    // Not signed in — send to sign-in, return here afterward
    redirect("/sign-in?redirect_url=%2Frhythms");
  }

  return <RhythmsClient />;
}
