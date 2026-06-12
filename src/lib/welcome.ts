import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { emailWelcomeNewUser, emailAdminNotification } from "@/lib/email";

// ════════════════════════════════════════════════════════════════
// First-sight welcome dispatcher.
//
// Design: every authenticated page load calls maybeWelcome(). It checks
// if the current user has a profile row. If not, it inserts one AND
// fires the welcome email. The insert is the lock — even if the user
// has ten tabs open and ten requests fire simultaneously, only one
// insert wins (Postgres primary-key constraint enforces this) and only
// one email is sent.
//
// Why this instead of a Clerk webhook:
//   - No webhook secret/signature plumbing
//   - No risk of missing signups if the webhook is misconfigured
//   - "First time we see you authenticated" is the right trigger
//     anyway, not "first time Clerk processed signup"
//
// Cost: one tiny SELECT per authenticated page load. The profile row
// is keyed by clerk_user_id (the same key Clerk uses), so the lookup
// is an index hit. Negligible.
//
// Failure modes:
//   - Email fails: profile still created, no retry. Acceptable —
//     welcome is nice-to-have, not critical.
//   - DB fails: this function silently no-ops. The user's session is
//     unaffected.
// ════════════════════════════════════════════════════════════════

export async function maybeWelcome(): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) return; // not signed in — nothing to do

    // Try to insert a profile row. If it already exists (the common
    // case after the first visit), Postgres throws a unique-violation
    // and we silently bail.
    const user = await currentUser();
    if (!user) return;

    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;

    if (!primaryEmail) return; // can't email without an address

    // onConflictDoNothing: if a row with this clerk_user_id already
    // exists, the insert is a no-op and we don't fire the email again.
    const inserted = await db
      .insert(profiles)
      .values({
        clerkUserId: userId,
        email: primaryEmail,
      })
      .onConflictDoNothing()
      .returning();

    // If insert returned a row, this was the first sight — send welcome.
    if (inserted.length === 1) {
      const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        null;

      // Fire emails non-blocking. We don't await — the user's page
      // shouldn't wait for email delivery.
      Promise.all([
        emailWelcomeNewUser({ name: displayName, email: primaryEmail }),
        emailAdminNotification({
          subject: `New signup: ${displayName || primaryEmail}`,
          body: `Email: ${primaryEmail}\nName: ${displayName || "(none provided)"}\nClerk user ID: ${userId}`,
        }),
      ]).catch((e) => console.error("[welcome] email send failed:", e));
    }
  } catch (e) {
    // Next.js pre-renders some built-in routes (notably /_not-found) at
    // BUILD TIME, before any real request exists. During that pass, our
    // layout still runs and tries to call auth() → headers(), which
    // throws "Dynamic server usage" because those APIs require a real
    // runtime request context.
    //
    // This is expected, NOT an error. At runtime, when a real user
    // hits a real route, the layout re-renders dynamically and the
    // welcome check works normally. So we recognize this specific
    // build-time signal and silently no-op without log noise.
    //
    // Any OTHER error is genuinely unexpected and worth logging.
    const msg = e instanceof Error ? e.message : String(e);
    if (
      msg.includes("Dynamic server usage") ||
      msg.includes("couldn't be rendered statically") ||
      msg.includes("DYNAMIC_SERVER_USAGE")
    ) {
      return;
    }
    console.error("[welcome] dispatcher error:", e);
  }
}
