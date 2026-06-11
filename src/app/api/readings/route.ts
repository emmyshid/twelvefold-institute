import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { readings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "nodejs";

// ════════════════════════════════════════════════════════════════
// GET /api/readings — returns the signed-in user's reading history.
// Used by /read/app to populate the "your past readings" panel.
// Returns 401 for signed-out users (the app should never call this
// without auth).
// ════════════════════════════════════════════════════════════════

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        id: readings.id,
        input: readings.input,
        patternName: readings.patternName,
        phase: readings.phase,
        microState: readings.microState,
        curriculum: readings.curriculum,
        activeLesson: readings.activeLesson,
        recommendedParticipation: readings.recommendedParticipation,
        createdAt: readings.createdAt,
      })
      .from(readings)
      .where(eq(readings.clerkUserId, userId))
      .orderBy(desc(readings.createdAt))
      .limit(50);

    return NextResponse.json({ readings: rows });
  } catch (e) {
    console.error("Could not load reading history", e);
    return NextResponse.json({ error: "Could not load history." }, { status: 500 });
  }
}
