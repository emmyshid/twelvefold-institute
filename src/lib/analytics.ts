"use client";

import { track } from "@vercel/analytics";

// ════════════════════════════════════════════════════════════════
// Analytics — funnel conversion events.
//
// Wraps Vercel Analytics' track() with a small type-safe API so
// event names and property shapes stay consistent across the three
// audience-specific pages. All events are anonymous and aggregated.
//
// Convention: event names use verb_noun format ("submit_lead"), and
// the audience is always a top-level property so the dashboard can
// filter by segment without touching the event name.
// ════════════════════════════════════════════════════════════════

export type Audience =
  | "practitioner"
  | "institution"
  | "researcher"
  | "community"
  | "general";

// Fired when an audience-specific lead form submits successfully.
// The 'audience' is the primary segment; 'subtype' is the picked
// practice type / sector / inquiry type (may be undefined if the
// visitor left it blank).
export function trackLeadSubmit(audience: Audience, subtype?: string) {
  try {
    track("submit_lead", {
      audience,
      subtype: subtype || "unspecified",
    });
  } catch {
    // track() throws in preview environments without Analytics
    // configured. Silent failure is correct — we never want an
    // analytics failure to break the user-visible flow.
  }
}

// Fired when the user clicks a "See the full program" or similar
// cross-audience CTA. Helpful for understanding whether the
// audience-specific pages funnel into the generic conversion pages
// or steal from them.
export function trackCTAClick(source: Audience, destination: string) {
  try {
    track("cta_click", { source, destination });
  } catch {
    // See trackLeadSubmit note above.
  }
}
