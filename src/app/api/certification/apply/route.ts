import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certApplications } from "@/lib/db/schema";
import { emailCertApplicationReceived, emailAdminNotification } from "@/lib/email";

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

    // Fire emails in parallel. Failures are non-blocking — the application
    // is already safe in the database.
    Promise.all([
      emailCertApplicationReceived({ name, email }),
      emailAdminNotification({
        subject: `New cert application: ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\nMotivation:\n${motivation || "(none provided)"}`,
      }),
    ]).catch((e) => console.error("[email] cert-apply notifications failed:", e));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("apply route error:", err);
    return NextResponse.json({ error: "We couldn't submit that. Try again." }, { status: 500 });
  }
}
