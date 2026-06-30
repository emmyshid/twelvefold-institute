import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PRICING, type ProductKey } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

interface CheckoutBody {
  product?: string;
  email?: string;
  name?: string;
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const product = (body.product ?? "certification") as ProductKey;
  if (!(product in PRICING)) {
    return NextResponse.json({ error: `Unknown product: ${product}` }, { status: 400 });
  }

  const pricing = PRICING[product];
  const email = (body.email ?? "").trim();
  const name = (body.name ?? "").trim();

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  let userId: string | null = null;
  try {
    const a = await auth();
    userId = a.userId;
  } catch {
    // Auth not available — anonymous checkout is allowed
  }

  const origin = req.headers.get("origin") || "https://twelvefold.institute";

  // Subscription products use a recurring price; one-time payments do not.
  const isSubscription = pricing.mode === "subscription";
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: pricing.currency,
    product_data: {
      name: pricing.name,
      description: pricing.description,
    },
    unit_amount: pricing.amount,
    ...(isSubscription && pricing.interval
      ? { recurring: { interval: pricing.interval } }
      : {}),
  };

  // Success/cancel URLs differ per product type
  const isCommunity = product.startsWith("community-");
  const successPath = isCommunity
    ? "/community?upgraded=1&session_id={CHECKOUT_SESSION_ID}"
    : "/certification/payment-success?session_id={CHECKOUT_SESSION_ID}";
  const cancelPath = isCommunity
    ? "/community?cancelled=true"
    : "/certification?cancelled=true";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: pricing.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
      metadata: {
        product,
        clerk_user_id: userId || "",
        name: name || "",
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: {
                product,
                clerk_user_id: userId || "",
              },
            },
          }
        : {}),
    });

    // Record pending payment in our database
    await db.insert(payments).values({
      clerkUserId: userId || null,
      email,
      name: name || null,
      product,
      amount: pricing.amount,
      currency: pricing.currency,
      status: "pending",
      stripeSessionId: session.id,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("Stripe checkout creation failed", e);
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }
}
