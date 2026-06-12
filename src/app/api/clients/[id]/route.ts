import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/clients/[id]  { name?, email?, notes?, archived? }
// Updates only the fields provided. Practitioner-scoped — you cannot
// update another practitioner's client even if you know the id.
export async function PATCH(req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { id } = await context.params;

  let body: { name?: string; email?: string | null; notes?: string | null; archived?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const update: Partial<{ name: string; email: string | null; notes: string | null; archived: boolean }> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (name.length < 1) return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    update.name = name;
  }
  if ("email" in body) update.email = body.email === null ? null : (body.email ?? "").trim() || null;
  if ("notes" in body) update.notes = body.notes === null ? null : (body.notes ?? "").trim() || null;
  if (typeof body.archived === "boolean") update.archived = body.archived;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(clients)
      .set(update)
      .where(and(eq(clients.id, id), eq(clients.practitionerUserId, userId)))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json({ client: updated });
  } catch (e) {
    console.error("Could not update client", e);
    return NextResponse.json({ error: "Could not update client." }, { status: 500 });
  }
}

// DELETE /api/clients/[id]
// Hard delete. Readings tagged to this client remain in the readings
// table but their client_id becomes orphaned (we do not cascade —
// keep the data, lose the association).
export async function DELETE(_req: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { id } = await context.params;

  try {
    const [deleted] = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.practitionerUserId, userId)))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Could not delete client", e);
    return NextResponse.json({ error: "Could not delete client." }, { status: 500 });
  }
}
