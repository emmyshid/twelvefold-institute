import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { universalStructuresJournal } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// GET /api/universal-structures/journal
// Returns the user's full journal state (studied, applications, invocations).
// Returns 401 for signed-out users, empty defaults for users with no saved state.
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(universalStructuresJournal)
      .where(eq(universalStructuresJournal.clerkUserId, userId))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ studied: [], applications: [], invocations: [] });
    }

    const row = rows[0];
    return NextResponse.json({
      studied: row.studied ?? [],
      applications: row.applications ?? [],
      invocations: row.invocations ?? [],
    });
  } catch (e) {
    console.error("universal-structures/journal GET failed", e);
    return NextResponse.json({ error: "Could not load journal." }, { status: 500 });
  }
}

// POST /api/universal-structures/journal
// Upserts the user's full journal state. Body: { studied, applications, invocations }
// Last-write-wins — the client always sends the full merged state.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { studied?: unknown; applications?: unknown; invocations?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const studied = Array.isArray(body.studied) ? body.studied : [];
  const applications = Array.isArray(body.applications) ? body.applications : [];
  const invocations = Array.isArray(body.invocations) ? body.invocations : [];

  try {
    await db
      .insert(universalStructuresJournal)
      .values({
        clerkUserId: userId,
        studied,
        applications,
        invocations,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: universalStructuresJournal.clerkUserId,
        set: {
          studied,
          applications,
          invocations,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("universal-structures/journal POST failed", e);
    return NextResponse.json({ error: "Could not save journal." }, { status: 500 });
  }
}
