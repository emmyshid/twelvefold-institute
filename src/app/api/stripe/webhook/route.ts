import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments, memberships } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { emailPaymentWelcome, emailAdminNotification } from "@/lib/email";
import { COMMUNITY_TIER_FROM_PRODUCT } from "@/lib/stripe";
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
//            customer.subscription.updated
//            customer.subscription.deleted
//            invoice.payment_failed
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

        const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
        const amount = session.amount_total ?? 0;
        const currency = session.currency ?? "usd";
        const product = (session.metadata?.product as string) || "certification";
        const clerkUserId = (session.metadata?.clerk_user_id as string) || "";

        // For community subscriptions, upsert into memberships table.
        // The subscription itself was created in subscription mode, so
        // session.subscription will be populated and we promote the
        // member from observer → their purchased tier.
        if (product.startsWith("community-") && clerkUserId) {
          const tier = COMMUNITY_TIER_FROM_PRODUCT[product];
          const subscriptionId = (session.subscription as string | null) ?? null;
          const customerId = (session.customer as string | null) ?? null;
          if (tier) {
            // Try update first; insert if no row exists.
            const updated = await db
              .update(memberships)
              .set({
                tier,
                status: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
              })
              .where(eq(memberships.clerkUserId, clerkUserId))
              .returning();
            if (updated.length === 0) {
              await db.insert(memberships).values({
                clerkUserId,
                tier,
                status: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
              });
            }
            console.log(`[stripe] community membership upserted: user=${clerkUserId} tier=${tier}`);
          }
        }

        if (customerEmail) {
          Promise.all([
            emailPaymentWelcome({ email: customerEmail, amount, currency, product }),
            emailAdminNotification({
              subject: `New payment: ${currency.toUpperCase()} $${(amount / 100).toFixed(2)} for ${product}`,
              body: `Email: ${customerEmail}\nAmount: ${currency.toUpperCase()} $${(amount / 100).toFixed(2)}\nProduct: ${product}\nStripe session: ${session.id}`,
            }),
          ]).catch((e) => console.error("[email] payment notifications failed:", e));
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const subscriptionId = sub.id;
        const newStatus = sub.status; // active | past_due | canceled | unpaid | incomplete | etc.
        // Map Stripe status → our membership status
        const dbStatus = newStatus === "active" || newStatus === "trialing" ? "active"
          : newStatus === "past_due" ? "past_due"
          : newStatus === "canceled" || newStatus === "incomplete_expired" ? "canceled"
          : newStatus;
        await db
          .update(memberships)
          .set({
            status: dbStatus,
            currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
          })
          .where(eq(memberships.stripeSubscriptionId, subscriptionId));
        console.log(`[stripe] subscription updated: id=${subscriptionId} status=${newStatus}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // Downgrade to observer (free) — preserve row for history
        await db
          .update(memberships)
          .set({ tier: "observer", status: "canceled" })
          .where(eq(memberships.stripeSubscriptionId, sub.id));
        console.log(`[stripe] subscription canceled, member downgraded to observer: id=${sub.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (subId) {
          await db
            .update(memberships)
            .set({ status: "past_due" })
            .where(eq(memberships.stripeSubscriptionId, subId));
          console.log(`[stripe] subscription marked past_due: id=${subId}`);
        }
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
