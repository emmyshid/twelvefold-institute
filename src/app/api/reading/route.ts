import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readPattern, readFullPattern, ReadingError } from "@/lib/anthropic";
import { rateLimit } from "@/lib/rateLimit";
import { db } from "@/lib/db";
import { readings } from "@/lib/db/schema";

export const runtime = "nodejs"; // Node runtime: postgres-js + SDK need it.

// POST /api/reading  { situation: string, depth?: "summary" | "full" }
//
// Public (the homepage promises "no account needed") but rate-limited.
// Signed-in users get a higher limit and their reading is saved to history.
//
// depth:
//   "summary" (default) — fast/cheap, Pattern Summary only. Used by homepage.
//   "full"              — Pattern Summary + Technical Reading + Six Traditions.
//                         Used by /read/app for signed-in users.
//
// The full reading takes longer and uses more tokens (~4000 vs ~1024).
// We allow anonymous users to request "full" but with a tighter limit
// so the homepage path stays the cheap one in practice.
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
  const depth: "summary" | "full" = depthInput === "full" ? "full" : "summary";

  // Rate limits differ by depth — full readings cost more, so cap them harder.
  const limit = userId ? (depth === "full" ? 20 : 60) : (depth === "full" ? 2 : 5);
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

  try {
    if (depth === "full") {
      const full = await readFullPattern(situation);
      if (userId) {
        await db.insert(readings).values({
          clerkUserId: userId,
          input: situation,
          patternName: full.summary.pattern_name,
          phase: full.summary.phase,
          microState: full.summary.micro_state,
          curriculum: full.summary.likely_curriculum,
          activeLesson: full.summary.active_lesson,
          recommendedParticipation: full.summary.recommended_participation,
          raw: full, // full reading (summary + technical + traditions) stored here
        });
      }
      return NextResponse.json({
        summary: full.summary,
        technical: full.technical,
        traditions: full.traditions,
      });
    }

    // Default — Pattern Summary only.
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
