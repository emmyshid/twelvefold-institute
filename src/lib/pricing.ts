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
