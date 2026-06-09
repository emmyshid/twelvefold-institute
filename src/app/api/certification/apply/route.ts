import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certApplications } from "@/lib/db/schema";

export const runtime = "nodejs";

// POST /api/certification/apply  { name, email, motivation? }
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = body as { name?: unknown; email?: unknown; motivation?: unknown };
  const name = String(b?.name ?? "").trim();
  const email = String(b?.email ?? "").trim();
  const motivation = String(b?.motivation ?? "").trim() || null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Please include your name." }, { status: 400 });
  }
  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Please include a valid email." }, { status: 400 });
  }

  try {
    await db.insert(certApplications).values({ name, email, motivation });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("apply route error:", err);
    return NextResponse.json({ error: "We couldn't submit that. Try again." }, { status: 500 });
  }
}
