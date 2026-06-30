import "server-only";
import Stripe from "stripe";

// ════════════════════════════════════════════════════════════════
// Stripe — server-only client.
// The secret key never reaches the browser. All checkout sessions
// and webhook verification happen in API routes (Node runtime).
// ════════════════════════════════════════════════════════════════

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// ─── Pricing catalog ─────────────────────────────────────────
// Single source of truth for what costs what. Amounts in cents.
// To add a new product (community membership, book), add a key here
// and the checkout route picks it up automatically.

export type ProductKey =
  | "certification"
  | "community-reader"
  | "community-interpreter"
  | "community-practitioner";

// Community tier IDs match the LEVELS const in CommunityClient.jsx
// (observer=free, reader=$200, interpreter=$350, practitioner=$500, guide=invitation)
export const COMMUNITY_TIER_FROM_PRODUCT: Record<string, string> = {
  "community-reader": "reader",
  "community-interpreter": "interpreter",
  "community-practitioner": "practitioner",
};

export const PRICING: Record<ProductKey, {
  amount: number;
  currency: string;
  name: string;
  description: string;
  mode: "payment" | "subscription";
  interval?: "month" | "year";
}> = {
  certification: {
    amount: 650000, // $6,500.00 in cents
    currency: "usd",
    name: "Twelvefold Practitioner Certification",
    description: "200-hour cohort program. Three phases. Six wisdom traditions. Supervised practicum and certification review.",
    mode: "payment",
  },
  "community-reader": {
    amount: 20000, // $200/mo
    currency: "usd",
    name: "Attuned Community — Reader",
    description: "Pattern identification and Pattern Literacy foundations. Full community access, weekly attunements, codex.",
    mode: "subscription",
    interval: "month",
  },
  "community-interpreter": {
    amount: 35000, // $350/mo
    currency: "usd",
    name: "Attuned Community — Interpreter",
    description: "Structure analysis and rhythm analysis. Everything in Reader, plus practitioner-led interpretation circles.",
    mode: "subscription",
    interval: "month",
  },
  "community-practitioner": {
    amount: 50000, // $500/mo
    currency: "usd",
    name: "Attuned Community — Practitioner",
    description: "Conscious alignment and decision-making through pattern awareness. Highest community tier with supervised practice.",
    mode: "subscription",
    interval: "month",
  },
};
