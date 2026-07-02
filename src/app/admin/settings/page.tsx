import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdmin, adminEmail } from "@/lib/admin";
import { getAllResolvedPricing } from "@/lib/pricing";
import SettingsClient from "./SettingsClient";

// ════════════════════════════════════════════════════════════════
// /admin/settings — admin-configurable membership and product pricing.
//
// Two-stage auth check (matches /admin main page):
//   1. Middleware ensures signed-in
//   2. This page checks admin allowlist; non-admins redirect to home
//
// Fetches the resolved pricing for every product in the catalog
// (with admin overrides applied) and passes it to the client editor.
// ════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin/settings");

  if (!(await isAdmin())) redirect("/");

  const me = await adminEmail();
  const pricing = await getAllResolvedPricing();

  // Serialize timestamps for the client
  const serialized = pricing.map((p) => ({
    ...p,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  }));

  return <SettingsClient adminEmail={me} initialPricing={serialized} />;
}
