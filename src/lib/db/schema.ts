import { pgTable, uuid, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

// ════════════════════════════════════════════════════════════════
// Postgres schema — Twelvefold Institute (Phase 1)
//
// This is the B1 migration target. Today the apps keep state in the
// browser (localStorage / window.storage). On the public web that
// cannot persist across devices or survive a cleared cache, so each
// key becomes a server-side table keyed to the authenticated user.
//
//   localStorage key            →  table
//   ─────────────────────────────────────────────
//   pos10-master-history        →  readings (clerk_user_id set)
//   pos10-clients               →  clients          (Phase 2)
//   pos10-client-${code}        →  client_sessions  (Phase 2)
//   pos10-role                  →  profiles.role
//   plc-progress / plc-*        →  enrollments + progress (Phase 2)
// ════════════════════════════════════════════════════════════════

// One profile row per Clerk user. Identity lives in Clerk; this holds
// app-specific fields (role = member | practitioner | admin) and the
// welcome-email idempotency timestamp.
//
// welcomedAt is set the first time we see a signed-in user, used by
// src/lib/welcome.ts to fire the welcome email exactly once. The unique
// constraint on clerk_user_id is the lock — concurrent inserts from
// multiple tabs all hit the same constraint, only one wins, only one
// email is sent.
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  role: text("role").notNull().default("member"),
  welcomedAt: timestamp("welcomed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Replaces pos10-master-history. clerk_user_id is nullable so anonymous
// free readings from the homepage can still be recorded (rate-limited);
// signed-in readings are tied to the user and show up in their history.
export const readings = pgTable("readings", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id"),
  // When non-null, this reading was created by a practitioner FOR this client.
  // When null, it's a personal reading by clerkUserId for themselves.
  clientId: uuid("client_id"),
  input: text("input").notNull(),
  patternName: text("pattern_name"),
  phase: text("phase"),
  microState: text("micro_state"),
  curriculum: text("curriculum"),
  activeLesson: text("active_lesson"),
  recommendedParticipation: text("recommended_participation"),
  raw: jsonb("raw"),
  // When non-null, this reading was emailed to the client at this timestamp.
  // Practitioners use this to avoid double-sends and to show "✓ Sent" state.
  sentToClientAt: timestamp("sent_to_client_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Practitioner-owned client records. Each row is one person the practitioner
// reads patterns for. Lightweight — name and optional email/notes. Belongs
// to a single practitioner (clerkUserId of the owner) and cannot be shared.
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  practitionerUserId: text("practitioner_user_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  notes: text("notes"),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Certification applications (the sales page form posts here).
export const certApplications = pgTable("cert_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  motivation: text("motivation"),
  status: text("status").notNull().default("received"), // received | reviewing | admitted | declined
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Membership / billing state. Tier stays "free" until Stripe is wired
// in Phase 2; the Stripe columns are here so that work is additive.
export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  tier: text("tier").notNull().default("free"), // free | community
  status: text("status").notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Institutional consult requests (the /institutions page form posts here).
// High-value leads — every row should generate a personal follow-up within
// five business days.
export const consultRequests = pgTable("consult_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  role: text("role"),
  scope: text("scope"), // diagnostic | licensing | partnership | exploring
  message: text("message"),
  status: text("status").notNull().default("received"), // received | qualified | scheduled | closed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Stripe payments — every transaction (certification, future community,
// future book sales) is recorded here. A row is created in "pending" state
// when the checkout session is created, then updated by the webhook to
// "succeeded" / "failed" / "refunded" based on what Stripe reports.
//
// Amount is stored in cents (Stripe convention). Divide by 100 for display.
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id"), // nullable for anonymous checkouts
  email: text("email").notNull(),
  name: text("name"),
  product: text("product").notNull(), // certification | community | book
  amount: integer("amount").notNull(), // cents
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull().default("pending"), // pending | succeeded | failed | refunded
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCustomerId: text("stripe_customer_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
export type CertApplication = typeof certApplications.$inferSelect;
export type ConsultRequest = typeof consultRequests.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

// Book launch interest list. People who sign up via /book to be notified
// when Pattern Literacy publishes (or has news — pre-order, signing,
// release date). Email is unique so the same person can subscribe twice
// without creating duplicates.
export const bookSubscribers = pgTable("book_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  motivation: text("motivation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BookSubscriber = typeof bookSubscribers.$inferSelect;
export type NewBookSubscriber = typeof bookSubscribers.$inferInsert;
