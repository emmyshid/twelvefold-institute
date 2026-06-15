import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { readPattern, readFullPattern, readDream, readCoordinate, ReadingError } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { readings, payments } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";

export const runtime = "nodejs"; // Node runtime: postgres-js + SDK need it.

// POST /api/reading  { situation: string, depth?: "summary" | "full" }
//
// depth:
//   "summary" (default) — fast/cheap, Pattern Summary only. PUBLIC.
//                         Used by the homepage try-it; no account needed.
//   "full"              — Pattern Summary + Recognition + Teaching + Alignment
//                         + Participation + Six Traditions. PRACTITIONER-ONLY.
//                         Used by /read/app for certified practitioners.
//
// Access policy:
//   Full readings are a practitioner tool. The /read/app page is server-
//   gated to cert-paid users only. We also gate this endpoint server-
//   side so that the API can't be called from outside the workspace by
//   non-practitioners. Defense in depth.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = userId ?? ip;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const situation = String((body as { situation?: unknown })?.situation ?? "").trim();
  const depthInput = String((body as { depth?: unknown })?.depth ?? "summary");
  const depth: "summary" | "full" | "dream" | "coordinate" =
    depthInput === "full" ? "full" : depthInput === "dream" ? "dream" : depthInput === "coordinate" ? "coordinate" : "summary";

  // ─── Practitioner gate for deep readings ───────────────────
  // full, dream, and coordinate are all deep, practitioner-only
  // readings. They require a signed-in user with a succeeded
  // certification payment.
  if (depth === "full" || depth === "dream" || depth === "coordinate") {
    if (!userId) {
      return NextResponse.json(
        { error: "Deep readings require sign-in as a certified practitioner." },
        { status: 401 },
      );
    }
    const user = await currentUser();
    const email =
      user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress?.toLowerCase() ?? "";
    const matchClauses = [eq(payments.clerkUserId, userId)];
    if (email) matchClauses.push(eq(payments.email, email));

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
      return NextResponse.json(
        {
          error:
            "Full readings are offered through certified practitioners. Try the brief reading on the homepage, or visit /read to connect with a practitioner.",
        },
        { status: 403 },
      );
    }
  }

  // Optional: practitioner tagging this reading to a specific client.
  // The clientId is only honored if it's a UUID-shaped string AND the
  // signed-in user owns that client (verified by the DB constraint —
  // a wrong id will simply insert null since the column is nullable).
  const clientIdRaw = (body as { clientId?: unknown })?.clientId;
  const clientId = typeof clientIdRaw === "string" && clientIdRaw.length >= 32 ? clientIdRaw : null;

  // Rate limits differ by depth — deep readings (full, dream, coordinate) cost more.
  const isDeep = depth === "full" || depth === "dream" || depth === "coordinate";
  const limit = userId ? (isDeep ? 20 : 60) : (isDeep ? 2 : 5);
  const rl = rateLimit(`reading:${depth}:${key}`, limit, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "You've reached the limit for now. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  if (situation.length < 4) {
    return NextResponse.json({ error: "Describe the situation in a sentence or two." }, { status: 400 });
  }
  if (situation.length > 2000) {
    return NextResponse.json({ error: "That's a bit long — keep it under 2000 characters." }, { status: 400 });
  }

  // If clientId provided, verify the signed-in user actually owns it.
  // Otherwise it would be possible to write a reading into someone
  // else's client record by guessing IDs.
  let verifiedClientId: string | null = null;
  if (clientId && userId) {
    try {
      const { clients } = await import("@/lib/db/schema");
      const { eq, and } = await import("drizzle-orm");
      const rows = await db
        .select({ id: clients.id })
        .from(clients)
        .where(and(eq(clients.id, clientId), eq(clients.practitionerUserId, userId)))
        .limit(1);
      if (rows.length === 1) verifiedClientId = clientId;
    } catch {
      // If ownership check fails, save as personal (clientId stays null)
    }
  }

  try {
    if (depth === "dream") {
      const dreamReading = await readDream(situation);
      if (userId) {
        await db.insert(readings).values({
          clerkUserId: userId,
          clientId: verifiedClientId,
          input: situation,
          patternName: dreamReading.summary.pattern_name,
          phase: dreamReading.summary.phase,
          microState: dreamReading.summary.micro_state,
          curriculum: dreamReading.teaching?.core_teaching ?? null,
          activeLesson: dreamReading.teaching?.what_is_being_asked ?? null,
          recommendedParticipation: dreamReading.participation?.recommended_participation ?? null,
          raw: { ...dreamReading, kind: "dream" }, // tag so the UI can render the dream structure
        });
      }
      return NextResponse.json(dreamReading);
    }

    if (depth === "coordinate") {
      const coord = await readCoordinate(situation);
      if (userId) {
        await db.insert(readings).values({
          clerkUserId: userId,
          clientId: verifiedClientId,
          input: situation,
          patternName: coord.coordinate_title,
          phase: coord.root?.phase ?? null,
          microState: coord.root?.layer ?? null, // store the root LAYER here
          curriculum: coord.teaching ?? null,
          activeLesson: coord.what_it_asks ?? null,
          recommendedParticipation: coord.what_it_asks ?? null,
          raw: { ...coord, kind: "coordinate" },
        });
      }
      return NextResponse.json(coord);
    }

    if (depth === "full") {
      const full = await readFullPattern(situation);
      if (userId) {
        await db.insert(readings).values({
          clerkUserId: userId,
          clientId: verifiedClientId,
          input: situation,
          patternName: full.summary.pattern_name,
          phase: full.summary.phase,
          microState: full.summary.micro_state,
          // Legacy flat columns — populated for back-compat with old UI/email
          // paths that read these. The full v10 layers live in raw below.
          curriculum: full.teaching?.core_teaching ?? null,
          activeLesson: full.teaching?.what_is_being_asked ?? null,
          recommendedParticipation: full.participation?.recommended_participation ?? null,
          raw: full, // FULL v10-shape reading lives here
        });
      }
      return NextResponse.json(full);
    }

    // Default — Pattern Summary only (homepage demo path).
    const summary = await readPattern(situation);
    if (userId) {
      await db.insert(readings).values({
        clerkUserId: userId,
        clientId: verifiedClientId,
        input: situation,
        patternName: summary.pattern_name,
        phase: summary.phase,
        microState: summary.micro_state,
        curriculum: summary.likely_curriculum,
        activeLesson: summary.active_lesson,
        recommendedParticipation: summary.recommended_participation,
        raw: { summary },
      });
    }
    return NextResponse.json({ summary });
  } catch (err) {
    if (err instanceof ReadingError) {
      return NextResponse.json({ error: err.publicMessage }, { status: 502 });
    }
    console.error("reading route error:", err);
    return NextResponse.json({ error: "Something interrupted the reading. Try again." }, { status: 500 });
  }
}
