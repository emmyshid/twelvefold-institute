import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdmin, adminEmail } from "@/lib/admin";
import { db } from "@/lib/db";
import {
  certApplications,
  consultRequests,
  payments,
  readings,
} from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import AdminClient from "./AdminClient";

// ════════════════════════════════════════════════════════════════
// /admin — Twelvefold Institute operations dashboard.
// Server component. Two-stage auth check:
//   1. Middleware ensures signed-in (anyone signed in can reach here)
//   2. This page checks admin allowlist; non-admins redirect to home
//
// Fetches the 50 most recent rows from each operational table and
// hands them to the client component for display + status updates.
// ════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic"; // never cache admin data

export default async function AdminPage() {
  // Stage 1: must be signed in
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");

  // Stage 2: must be on admin allowlist
  if (!(await isAdmin())) redirect("/");

  const me = await adminEmail();

  // Pull recent rows from each operational table in parallel.
  //
  // NOTE on cert_applications column selection:
  // We list columns explicitly rather than `db.select().from(...)`
  // because the schema includes `practice_type` and `source` fields
  // (added in the /for-practitioners work). Production DBs that
  // haven't run `drizzle-kit push` yet will throw "column does not
  // exist" on a select-all. Listing only known-safe columns lets
  // /admin render before the migration runs. After the migration is
  // applied, switch the comment block below and run the migration.
  const [appsRows, consultsRows, paymentsRows, readingsRows] = await Promise.all([
    db
      .select({
        id: certApplications.id,
        name: certApplications.name,
        email: certApplications.email,
        motivation: certApplications.motivation,
        status: certApplications.status,
        createdAt: certApplications.createdAt,
        // practiceType: certApplications.practiceType, // uncomment after migration
        // source: certApplications.source,             // uncomment after migration
      })
      .from(certApplications)
      .orderBy(desc(certApplications.createdAt))
      .limit(50),
    db.select().from(consultRequests).orderBy(desc(consultRequests.createdAt)).limit(50),
    db.select().from(payments).orderBy(desc(payments.createdAt)).limit(50),
    db
      .select({
        id: readings.id,
        input: readings.input,
        patternName: readings.patternName,
        phase: readings.phase,
        microState: readings.microState,
        createdAt: readings.createdAt,
        clerkUserId: readings.clerkUserId,
      })
      .from(readings)
      .orderBy(desc(readings.createdAt))
      .limit(50),
  ]);

  // Backfill the new fields as null for the client component until the
  // migration runs — this keeps the AppRow shape stable for AdminClient.
  const appsRowsWithNewFields = appsRows.map((r) => ({
    ...r,
    practiceType: null as string | null,
    source: null as string | null,
  }));

  // Serialize timestamps for the client component
  const serialize = <T extends { createdAt: Date | null; paidAt?: Date | null }>(rows: T[]) =>
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      ...("paidAt" in r ? { paidAt: r.paidAt ? r.paidAt.toISOString() : null } : {}),
    }));

  return (
    <AdminClient
      adminEmail={me}
      applications={serialize(appsRowsWithNewFields)}
      consults={serialize(consultsRows)}
      payments={serialize(paymentsRows)}
      readings={serialize(readingsRows)}
    />
  );
}
