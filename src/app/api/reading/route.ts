import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readPattern, ReadingError } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { readings } from "@/lib/db/schema";

export const runtime = "nodejs"; // Node runtime: postgres-js + SDK need it.

// POST /api/reading  { situation: string }  ->  { summary: PatternSummary }
//
// Public (the homepage promises "no account needed") but rate-limited.
// Signed-in users get a higher limit and their reading is saved to history.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = userId ?? ip;
  const limit = userId ? 60 : 5; // per minute
  const rl = rateLimit(`reading:${key}`, limit, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "You've reached the limit for now. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const situation = String((body as { situation?: unknown })?.situation ?? "").trim();
  if (situation.length < 4) {
    return NextResponse.json({ error: "Describe the situation in a sentence or two." }, { status: 400 });
  }
  if (situation.length > 2000) {
    return NextResponse.json({ error: "That's a bit long — keep it under 2000 characters." }, { status: 400 });
  }

  try {
    const summary = await readPattern(situation);

    if (userId) {
      await db.insert(readings).values({
        clerkUserId: userId,
        input: situation,
        patternName: summary.pattern_name,
        phase: summary.phase,
        microState: summary.micro_state,
        curriculum: summary.likely_curriculum,
        activeLesson: summary.active_lesson,
        recommendedParticipation: summary.recommended_participation,
        raw: summary,
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
