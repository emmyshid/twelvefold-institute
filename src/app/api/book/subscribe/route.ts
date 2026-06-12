import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookSubscribers } from "@/lib/db/schema";
import { emailBookSubscribeConfirmation, emailAdminNotification } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/book/subscribe  { email, motivation? }
//
// Captures interest in the Pattern Literacy book launch. Dedupes by
// email via unique constraint — subscribing twice with the same email
// is harmless (we silently no-op).
//
// Confirmation email fires only on first subscribe (insert returns a
// row only when it's a real new subscription). This avoids re-confirming
// the same person every time they happen to visit and click the button.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = body as { email?: unknown; motivation?: unknown };
  const email = String(b?.email ?? "").trim().toLowerCase();
  const motivation = String(b?.motivation ?? "").trim() || null;

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Please include a valid email." }, { status: 400 });
  }
  if (motivation && motivation.length > 2000) {
    return NextResponse.json({ error: "That message is a little long." }, { status: 400 });
  }

  try {
    const inserted = await db
      .insert(bookSubscribers)
      .values({ email, motivation })
      .onConflictDoNothing({ target: bookSubscribers.email })
      .returning();

    if (inserted.length === 1) {
      // First-time subscription — fire emails non-blocking
      Promise.all([
        emailBookSubscribeConfirmation({ email }),
        emailAdminNotification({
          subject: `New Pattern Literacy launch subscriber: ${email}`,
          body: `Email: ${email}\nMotivation: ${motivation || "(none)"}`,
        }),
      ]).catch((e) => console.error("[email] book subscribe notifications failed:", e));
    }

    // Return ok regardless — we don't want to leak whether the email
    // was already subscribed (privacy + simpler UX)
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("book subscribe error:", e);
    return NextResponse.json({ error: "We couldn't save that. Try again." }, { status: 500 });
  }
}
