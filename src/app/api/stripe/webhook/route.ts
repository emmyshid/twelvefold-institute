import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export const runtime = "nodejs";

// ════════════════════════════════════════════════════════════════
// Stripe webhook handler.
// Stripe pings this endpoint when events happen (payment succeeded,
// failed, refunded, etc.). We verify the signature, find the matching
// row in our `payments` table, and update its status.
//
// Setup: in the Stripe Dashboard → Developers → Webhooks → Add endpoint
//   URL:     https://twelvefold.institute/api/stripe/webhook
//   Events:  checkout.session.completed
//            checkout.session.expired
//            checkout.session.async_payment_failed
//            charge.refunded
// Copy the signing secret → set STRIPE_WEBHOOK_SECRET in Vercel.
// ════════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // We need the raw body text for signature verification
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error("Webhook signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await db
          .update(payments)
          .set({
            status: "succeeded",
            stripePaymentIntentId: (session.payment_intent as string | null) ?? null,
            stripeCustomerId: (session.customer as string | null) ?? null,
            paidAt: new Date(),
          })
          .where(eq(payments.stripeSessionId, session.id));
        console.log(`[stripe] payment succeeded: session=${session.id}`);
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await db
          .update(payments)
          .set({ status: "failed" })
          .where(eq(payments.stripeSessionId, session.id));
        console.log(`[stripe] payment failed: session=${session.id} type=${event.type}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (intentId) {
          await db
            .update(payments)
            .set({ status: "refunded" })
            .where(eq(payments.stripePaymentIntentId, intentId));
          console.log(`[stripe] refund recorded: intent=${intentId}`);
        }
        break;
      }

      default:
        // Ignore other event types — but log so we know what's coming through
        console.log(`[stripe] unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
