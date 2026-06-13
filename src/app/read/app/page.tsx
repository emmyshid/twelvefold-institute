import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import ReadAppClient from "./ReadAppClient";

// ════════════════════════════════════════════════════════════════
// /read/app — the practitioner reading workspace (PatternOS).
//
// Access policy:
//   • Not signed in           → /sign-in?redirect_url=/read/app
//   • Signed in, NO cert pay  → /read (the connect-with-practitioner page)
//   • Signed in, cert PAID    → render the workspace
//
// Why fully gate now:
//   Per the new policy, full pattern readings (Personal AND Master)
//   are practitioner tools. Individuals get the homepage try-it for
//   a free preview reading and are pointed at certified practitioners
//   for full readings.
//
// Match strategy for "paid":
//   We match the payments table by clerk_user_id OR email (case
//   normalised). This handles users who paid before signup and signed
//   up with the same email after.
// ════════════════════════════════════════════════════════════════

export const metadata = {
  title: "PatternOS — Twelvefold Institute",
};

export default async function ReadAppPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=%2Fread%2Fapp");
  }

  const user = await currentUser();
  const userEmail =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress?.toLowerCase() ?? "";

  const matchClauses = [eq(payments.clerkUserId, userId)];
  if (userEmail) matchClauses.push(eq(payments.email, userEmail));

  const paid = await db
    .select({ id: payments.id })
    .from(payments)
    .where(
      and(
        eq(payments.product, "certification"),
        eq(payments.status, "succeeded"),
        or(...matchClauses),
      ),
    )
    .limit(1);

  if (paid.length === 0) {
    // Non-practitioner — point them at /read which now explains the
    // practitioner model and offers the try-it on the homepage.
    redirect("/read");
  }

  return <ReadAppClient />;
}
