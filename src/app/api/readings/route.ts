import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { readings } from "@/lib/db/schema";
import { eq, and, desc, isNull } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/readings?clientId=<uuid>
//   No clientId → returns the user's PERSONAL readings (client_id IS NULL).
//   With clientId → returns readings where client_id matches (the user must
//   still be the practitioner who owns the client, which is enforced via
//   joining on clerkUserId).
//
// Returns 401 for signed-out users.
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  try {
    const baseSelect = {
      id: readings.id,
      input: readings.input,
      patternName: readings.patternName,
      phase: readings.phase,
      microState: readings.microState,
      curriculum: readings.curriculum,
      activeLesson: readings.activeLesson,
      recommendedParticipation: readings.recommendedParticipation,
      raw: readings.raw,
      clientId: readings.clientId,
      createdAt: readings.createdAt,
    };

    const rows = clientId
      ? await db
          .select(baseSelect)
          .from(readings)
          .where(and(eq(readings.clerkUserId, userId), eq(readings.clientId, clientId)))
          .orderBy(desc(readings.createdAt))
          .limit(50)
      : await db
          .select(baseSelect)
          .from(readings)
          .where(and(eq(readings.clerkUserId, userId), isNull(readings.clientId)))
          .orderBy(desc(readings.createdAt))
          .limit(50);

    return NextResponse.json({ readings: rows });
  } catch (e) {
    console.error("Could not load reading history", e);
    return NextResponse.json({ error: "Could not load history." }, { status: 500 });
  }
}
