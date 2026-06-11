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

export type ProductKey = "certification";

export const PRICING: Record<ProductKey, {
  amount: number;
  currency: string;
  name: string;
  description: string;
  mode: "payment" | "subscription";
}> = {
  certification: {
    amount: 650000, // $6,500.00 in cents
    currency: "usd",
    name: "Twelvefold Practitioner Certification",
    description: "200-hour cohort program. Three phases. Six wisdom traditions. Supervised practicum and certification review.",
    mode: "payment",
  },
};
