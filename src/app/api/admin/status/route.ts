import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { certApplications, consultRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  emailCertApplicationReviewing,
  emailCertApplicationAdmitted,
  emailCertApplicationDeclined,
  emailConsultQualified,
  emailConsultScheduled,
  emailConsultClosed,
} from "@/lib/email";

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

// ════════════════════════════════════════════════════════════════
// POST /api/admin/status — admin-only status flip + email side effect.
//
// On every status change (except setting back to "received", which
// would duplicate the on-submission ack), the corresponding email
// template is fired. Emails are non-blocking — the status update
// succeeds even if the email fails, and the failure is logged.
//
// "Anti-double-send": if the existing status equals the new status,
// we still respond OK but skip the email. This avoids spamming
// applicants if an admin clicks the dropdown but doesn't actually
// change the value.
// ════════════════════════════════════════════════════════════════

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
      // Fetch current row so we can detect no-op updates and have email context.
      const rows = await db
        .select()
        .from(certApplications)
        .where(eq(certApplications.id, id))
        .limit(1);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      const before = rows[0];

      await db.update(certApplications).set({ status }).where(eq(certApplications.id, id));

      // Email side effect — non-blocking, only on real status change
      if (before.status !== status) {
        fireCertEmail(status, { name: before.name, email: before.email }).catch((e) =>
          console.error("[email] cert status email failed:", e),
        );
      }
    } else if (table === "consult_requests") {
      const rows = await db
        .select()
        .from(consultRequests)
        .where(eq(consultRequests.id, id))
        .limit(1);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Consult not found" }, { status: 404 });
      }
      const before = rows[0];

      await db.update(consultRequests).set({ status }).where(eq(consultRequests.id, id));

      if (before.status !== status) {
        fireConsultEmail(status, {
          name: before.name,
          email: before.email,
          organization: before.organization,
        }).catch((e) => console.error("[email] consult status email failed:", e));
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Status update failed", e);
    return NextResponse.json({ error: "Could not update status" }, { status: 500 });
  }
}

// ─── Email dispatchers ───────────────────────────────────────
// Map a status string to its template. Unknown statuses (including
// "received", which was already emailed on submission) are no-ops.

async function fireCertEmail(
  status: string,
  args: { name: string; email: string },
): Promise<void> {
  switch (status) {
    case "reviewing":
      await emailCertApplicationReviewing(args);
      return;
    case "admitted":
      await emailCertApplicationAdmitted(args);
      return;
    case "declined":
      await emailCertApplicationDeclined(args);
      return;
    default:
      return; // "received" or anything else — no email
  }
}

async function fireConsultEmail(
  status: string,
  args: { name: string; email: string; organization: string },
): Promise<void> {
  switch (status) {
    case "qualified":
      await emailConsultQualified(args);
      return;
    case "scheduled":
      await emailConsultScheduled(args);
      return;
    case "closed":
      await emailConsultClosed(args);
      return;
    default:
      return;
  }
}
