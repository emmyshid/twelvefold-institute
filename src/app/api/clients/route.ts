import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const runtime = "nodejs";

// ════════════════════════════════════════════════════════════════
// /api/clients — practitioner's client list.
// All endpoints require auth and only return rows owned by the
// signed-in practitioner. There is no cross-practitioner sharing.
// ════════════════════════════════════════════════════════════════

// GET /api/clients?archived=true|false (default: only active)
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const url = new URL(req.url);
  const includeArchived = url.searchParams.get("archived") === "true";

  try {
    const rows = await db
      .select()
      .from(clients)
      .where(
        includeArchived
          ? eq(clients.practitionerUserId, userId)
          : and(eq(clients.practitionerUserId, userId), eq(clients.archived, false))
      )
      .orderBy(desc(clients.createdAt));
    return NextResponse.json({ clients: rows });
  } catch (e) {
    console.error("Could not list clients", e);
    return NextResponse.json({ error: "Could not load clients." }, { status: 500 });
  }
}

// POST /api/clients  { name, email?, notes? }
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: { name?: string; email?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (name.length < 1) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (name.length > 120) return NextResponse.json({ error: "Name is too long." }, { status: 400 });

  const email = (body.email ?? "").trim() || null;
  const notes = (body.notes ?? "").trim() || null;

  try {
    const [created] = await db
      .insert(clients)
      .values({
        practitionerUserId: userId,
        name,
        email,
        notes,
      })
      .returning();
    return NextResponse.json({ client: created });
  } catch (e) {
    console.error("Could not create client", e);
    return NextResponse.json({ error: "Could not save client." }, { status: 500 });
  }
}
