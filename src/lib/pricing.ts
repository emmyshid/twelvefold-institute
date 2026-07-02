import "server-only";
import { db } from "@/lib/db";
import { productPricing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PRICING, type ProductKey } from "@/lib/stripe";

// ════════════════════════════════════════════════════════════════
// Pricing resolver
//
// Single source of truth for what a product costs, right now.
//
//   1. Query product_pricing for an active override row for the key
//   2. If found and active=true, use those values (respecting the
//      immutable mode/interval from the hardcoded catalog)
//   3. Otherwise, fall back to the hardcoded defaults in stripe.ts
//
// The mode and interval are NEVER admin-editable — they define the
// nature of the product (subscription vs one-time payment). Only
// display fields and price are.
//
// Import surface:
//   getResolvedPricing(product)  — single product lookup for checkout
//   getAllResolvedPricing()      — full catalog for admin UI
//
// Callers must be in a server context. The `server-only` import above
// blocks any accidental bundling into a client component.
// ════════════════════════════════════════════════════════════════

export interface ResolvedPricing {
  productKey: ProductKey;
  amount: number;
  currency: string;
  name: string;
  description: string;
  mode: "payment" | "subscription";
  interval?: "month" | "year";
  active: boolean;
  isOverride: boolean;   // true = admin has customized; false = default
  updatedBy: string | null;
  updatedAt: Date | null;
}

async function fetchOverride(product: ProductKey) {
  const rows = await db
    .select()
    .from(productPricing)
    .where(eq(productPricing.productKey, product))
    .limit(1);
  return rows[0] ?? null;
}

export async function getResolvedPricing(product: ProductKey): Promise<ResolvedPricing> {
  const defaults = PRICING[product];
  const override = await fetchOverride(product);

  if (override && override.active) {
    return {
      productKey: product,
      // Admin-editable
      amount: override.amount,
      currency: override.currency,
      name: override.name,
      description: override.description,
      active: override.active,
      // Immutable — comes from the hardcoded catalog
      mode: defaults.mode,
      interval: defaults.interval,
      // Metadata
      isOverride: true,
      updatedBy: override.updatedBy,
      updatedAt: override.updatedAt,
    };
  }

  return {
    productKey: product,
    amount: defaults.amount,
    currency: defaults.currency,
    name: defaults.name,
    description: defaults.description,
    active: override?.active ?? true,
    mode: defaults.mode,
    interval: defaults.interval,
    isOverride: false,
    updatedBy: null,
    updatedAt: null,
  };
}

export async function getAllResolvedPricing(): Promise<ResolvedPricing[]> {
  const keys = Object.keys(PRICING) as ProductKey[];
  return Promise.all(keys.map(getResolvedPricing));
}

// ─── Display formatting ─────────────────────────────────────────
// Human-readable price string for UI. Handles currency symbols for
// the common cases and falls back to ISO code prefix for the rest.
// Subscription products append "/mo" or "/yr".
//
// Examples:
//   $200/mo   $350/mo   $500/mo   $6,500   €100/mo   JPY 5000/mo

const CURRENCY_SYMBOL: Record<string, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  cad: "$",
  aud: "$",
};

export function formatDisplayPrice(p: ResolvedPricing): string {
  const dollars = p.amount / 100;
  const symbol = CURRENCY_SYMBOL[p.currency.toLowerCase()];
  // Whole-dollar amounts render without decimals; everything else with 2.
  const isWhole = Number.isInteger(dollars);
  const formatted = isWhole
    ? dollars.toLocaleString("en-US")
    : dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const prefix = symbol ?? `${p.currency.toUpperCase()} `;
  const suffix =
    p.mode === "subscription" && p.interval === "month"
      ? "/mo"
      : p.mode === "subscription" && p.interval === "year"
      ? "/yr"
      : "";
  return `${prefix}${formatted}${suffix}`;
}

// ─── Community-specific helpers ─────────────────────────────────
// The community app uses tier IDs (reader/interpreter/practitioner),
// not product keys. This helper returns a {tierId: displayPrice} map
// so CommunityClient can render current prices at runtime without
// rebuilding its LEVELS constant.

export async function getCommunityTierPricing(): Promise<Record<string, string>> {
  const products: ProductKey[] = [
    "community-reader",
    "community-interpreter",
    "community-practitioner",
  ];
  const tierByProduct: Record<string, string> = {
    "community-reader": "reader",
    "community-interpreter": "interpreter",
    "community-practitioner": "practitioner",
  };
  const resolved = await Promise.all(products.map(getResolvedPricing));
  const out: Record<string, string> = {};
  for (const p of resolved) {
    // Inactive tiers still get a price string — the community client
    // decides visibility separately. Displaying "$200/mo" for an
    // inactive tier is honest; hiding it silently is not.
    out[tierByProduct[p.productKey]] = formatDisplayPrice(p);
  }
  return out;
}
