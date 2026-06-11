import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { certApplications, consultRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

interface StatusBody {
  table?: "cert_applications" | "consult_requests";
  id?: string;
  status?: string;
}

const VALID_STATUSES: Record<string, string[]> = {
  cert_applications: ["received", "reviewing", "admitted", "declined"],
  consult_requests: ["received", "qualified", "scheduled", "closed"],
};

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: StatusBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { table, id, status } = body;
  if (!table || !id || !status) {
    return NextResponse.json({ error: "Missing table, id, or status" }, { status: 400 });
  }
  if (!(table in VALID_STATUSES)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }
  if (!VALID_STATUSES[table].includes(status)) {
    return NextResponse.json({ error: `Invalid status for ${table}` }, { status: 400 });
  }

  try {
    if (table === "cert_applications") {
      await db.update(certApplications).set({ status }).where(eq(certApplications.id, id));
    } else if (table === "consult_requests") {
      await db.update(consultRequests).set({ status }).where(eq(consultRequests.id, id));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Status update failed", e);
    return NextResponse.json({ error: "Could not update status" }, { status: 500 });
  }
}
