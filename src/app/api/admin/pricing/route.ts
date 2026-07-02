import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { productPricing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAllResolvedPricing } from "@/lib/pricing";
import { PRICING, type ProductKey } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ════════════════════════════════════════════════════════════════
// /api/admin/pricing
//
// GET  — list resolved pricing for every product in the catalog.
//        Includes whether each row is a default or an admin override.
//        Admin-gated.
//
// POST — upsert a single product's override.
//        Body: { productKey, amount, currency, name, description, active }
//        Server validates: amount is a positive integer <= 10_000_000
//        (max $100k, sanity limit), currency is a 3-letter string,
//        productKey exists in the hardcoded catalog.
//        Admin-gated.
//
// NOTE: mode and interval are NOT accepted. They are structural
// properties of each product and cannot be changed via admin UI.
// ════════════════════════════════════════════════════════════════

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const pricing = await getAllResolvedPricing();
    return NextResponse.json({ pricing });
  } catch (e) {
    console.error("[admin/pricing] GET failed:", e);
    return NextResponse.json({ error: "Failed to load pricing" }, { status: 500 });
  }
}

interface UpsertBody {
  productKey?: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await auth();

  let body: UpsertBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Server-side validation — never trust the client. Every field is
  // checked before we touch the database, and product_key must match
  // the hardcoded catalog to prevent an admin from creating garbage
  // rows for nonexistent products.
  const productKey = String(body.productKey ?? "").trim();
  if (!(productKey in PRICING)) {
    return NextResponse.json(
      { error: `Unknown product key: ${productKey}` },
      { status: 400 }
    );
  }

  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount < 0 || amount > 10_000_000) {
    return NextResponse.json(
      { error: "Amount must be an integer between 0 and 10000000 (cents)." },
      { status: 400 }
    );
  }

  const currency = String(body.currency ?? "").trim().toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) {
    return NextResponse.json(
      { error: "Currency must be a 3-letter ISO code (e.g. usd)." },
      { status: 400 }
    );
  }

  const name = String(body.name ?? "").trim();
  if (name.length < 2 || name.length > 200) {
    return NextResponse.json(
      { error: "Name must be between 2 and 200 characters." },
      { status: 400 }
    );
  }

  const description = String(body.description ?? "").trim();
  if (description.length > 1000) {
    return NextResponse.json(
      { error: "Description cannot exceed 1000 characters." },
      { status: 400 }
    );
  }

  const active = body.active !== false; // default true

  try {
    // Upsert by product_key. Update if a row exists; insert otherwise.
    const existing = await db
      .select({ id: productPricing.id })
      .from(productPricing)
      .where(eq(productPricing.productKey, productKey))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(productPricing)
        .set({
          amount,
          currency,
          name,
          description,
          active,
          updatedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(productPricing.productKey, productKey));
    } else {
      await db.insert(productPricing).values({
        productKey,
        amount,
        currency,
        name,
        description,
        active,
        updatedBy: userId,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/pricing] POST failed:", e);
    return NextResponse.json({ error: "Failed to save pricing" }, { status: 500 });
  }
}

// DELETE — revert a product to defaults by removing its override row.
export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const productKey = searchParams.get("productKey")?.trim() ?? "";
  if (!(productKey in PRICING)) {
    return NextResponse.json(
      { error: `Unknown product key: ${productKey}` },
      { status: 400 }
    );
  }
  try {
    await db.delete(productPricing).where(eq(productPricing.productKey, productKey));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/pricing] DELETE failed:", e);
    return NextResponse.json({ error: "Failed to reset pricing" }, { status: 500 });
  }
}
