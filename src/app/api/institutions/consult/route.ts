import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultRequests } from "@/lib/db/schema";
import { emailConsultReceived, emailAdminNotification } from "@/lib/email";

export const runtime = "nodejs";

interface ConsultBody {
  name?: string;
  email?: string;
  organization?: string;
  role?: string;
  scope?: string;
  message?: string;
}

export async function POST(req: Request) {
  let body: ConsultBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const organization = (body.organization ?? "").trim();
  const role = (body.role ?? "").trim();
  const scope = (body.scope ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email.includes("@") || email.length < 5) return NextResponse.json({ error: "Valid work email is required." }, { status: 400 });
  if (organization.length < 2) return NextResponse.json({ error: "Organization is required." }, { status: 400 });
  if (message.length > 4000) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

  try {
    await db.insert(consultRequests).values({
      name,
      email,
      organization,
      role: role || null,
      scope: scope || null,
      message: message || null,
      status: "received",
    });

    // Fire emails in parallel. Failures are non-blocking.
    Promise.all([
      emailConsultReceived({ name, email, organization, scope }),
      emailAdminNotification({
        subject: `New institutional consult: ${organization}`,
        body: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization}\nRole: ${role || "(none)"}\nScope: ${scope || "(none)"}\n\nMessage:\n${message || "(none)"}`,
      }),
    ]).catch((e) => console.error("[email] consult notifications failed:", e));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("consult insert failed", e);
    return NextResponse.json({ error: "Could not record request. Please email us directly." }, { status: 500 });
  }
}
