import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { readings, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { emailReadingToClient } from "@/lib/email";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ════════════════════════════════════════════════════════════════
// POST /api/readings/[id]/send
//
// Sends a reading to the client it belongs to. Practitioner-only:
//   1. Must be signed in
//   2. Must own the reading (clerkUserId matches)
//   3. Reading must have a non-null clientId
//   4. The client must have an email on file
//
// On success: records sentToClientAt timestamp so the UI can show
// "✓ Sent on Jun 12" and prevent accidental double-sends.
// ════════════════════════════════════════════════════════════════

export async function POST(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { id } = await context.params;

  // 1. Fetch reading + verify ownership
  const readingRows = await db
    .select()
    .from(readings)
    .where(and(eq(readings.id, id), eq(readings.clerkUserId, userId)))
    .limit(1);

  if (readingRows.length === 0) {
    return NextResponse.json({ error: "Reading not found." }, { status: 404 });
  }
  const reading = readingRows[0];

  if (!reading.clientId) {
    return NextResponse.json(
      { error: "This is a personal reading, not for a client." },
      { status: 400 },
    );
  }

  // 2. Fetch client + verify it has an email
  const clientRows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, reading.clientId), eq(clients.practitionerUserId, userId)))
    .limit(1);

  if (clientRows.length === 0) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }
  const client = clientRows[0];

  if (!client.email) {
    return NextResponse.json(
      { error: `${client.name} has no email on file. Add one to their profile first.` },
      { status: 400 },
    );
  }

  // 3. Fetch practitioner info from Clerk
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Could not load your account." }, { status: 500 });
  }
  const practitionerName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    user.emailAddresses[0]?.emailAddress ||
    "Your practitioner";
  const practitionerEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
    user.emailAddresses[0]?.emailAddress;

  // 4. Extract full reading layers from `raw`. Newer readings have the
  //    v10-parity schema (recognition, teaching, alignment, participation,
  //    archetype on summary, plus traditions). Older readings only have
  //    the legacy `technical` block. We pass both — the email template
  //    detects which schema is present and renders accordingly.
  const raw = reading.raw as {
    summary?: {
      archetype?: string;
      pattern_name?: string;
      phase?: string;
      micro_state?: string;
    };
    recognition?: {
      what_is_happening?: string;
      evidence_from_their_words?: string[];
    };
    teaching?: {
      core_teaching?: string;
      what_is_being_asked?: string;
      tradition_wisdom?: string;
      existential_permission?: string;
    };
    alignment?: {
      status?: string;
      reading?: string;
      signs_of_alignment?: string;
      signs_of_misalignment?: string;
    };
    participation?: {
      recommended_participation?: string;
      what_to_avoid?: string;
      pattern_rule?: string;
    };
    technical?: {
      phase_nature?: string;
      micro_state_work?: string;
      what_to_do?: string;
      what_to_avoid?: string;
      the_unseen?: string;
    };
    traditions?: {
      ifa?: string;
      kabbalah?: string;
      i_ching?: string;
      scripture?: string;
      buddhism?: string;
      hermetic?: string;
    };
  } | null;

  // 5. Send the email
  const sent = await emailReadingToClient({
    clientName: client.name,
    clientEmail: client.email,
    practitionerName,
    practitionerEmail,
    patternName: reading.patternName ?? undefined,
    phase: reading.phase ?? undefined,
    microState: reading.microState ?? undefined,
    archetype: raw?.summary?.archetype,
    // Legacy back-compat
    curriculum: reading.curriculum ?? undefined,
    activeLesson: reading.activeLesson ?? undefined,
    recommendedParticipation: reading.recommendedParticipation ?? undefined,
    technical: raw?.technical,
    // v10 layers (rendered when present, gracefully absent on older readings)
    recognition: raw?.recognition,
    teaching: raw?.teaching,
    alignment: raw?.alignment,
    participation: raw?.participation,
    traditions: raw?.traditions,
  });

  if (!sent) {
    return NextResponse.json(
      { error: "Could not send the email. Check the Resend setup or try again." },
      { status: 502 },
    );
  }

  // 6. Record the send timestamp
  const sentAt = new Date();
  try {
    await db
      .update(readings)
      .set({ sentToClientAt: sentAt })
      .where(eq(readings.id, id));
  } catch (e) {
    // Email already sent — log but don't fail the response
    console.error("Could not record sentToClientAt:", e);
  }

  return NextResponse.json({
    ok: true,
    sentAt: sentAt.toISOString(),
    to: client.email,
    clientName: client.name,
  });
}
