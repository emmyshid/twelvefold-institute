import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

// GET /api/me/admin
//
// Returns { isAdmin: boolean } indicating whether the current user's
// primary Clerk email is on the ADMIN_EMAILS allowlist (configured in
// Vercel env vars, not in user-editable profile data).
//
// Used by:
//   • /community CommunityClient — gates the Admin Console toggle so
//     only allowlisted users see admin pages, regardless of their
//     local profile.role field.
//
// Always returns 200 — { isAdmin: false } when not signed in, no admins
// are configured, or the email doesn't match. The UI degrades silently
// for non-admins.
export async function GET() {
  const ok = await isAdmin();
  return NextResponse.json({ isAdmin: ok });
}
