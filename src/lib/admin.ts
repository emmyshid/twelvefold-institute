import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

// ════════════════════════════════════════════════════════════════
// Admin authorization.
// Source of truth: ADMIN_EMAILS env var (comma-separated list).
// Example: ADMIN_EMAILS=emmyshid@gmail.com,founder@twelvefold.institute
//
// To grant or revoke admin access, change the env var in Vercel and
// redeploy. No code change required.
// ════════════════════════════════════════════════════════════════

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns true if the currently signed-in user's primary email is on
 * the ADMIN_EMAILS allowlist. Returns false if not signed in, no
 * admins are configured, or the email doesn't match.
 */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return false;

  const user = await currentUser();
  if (!user) return false;

  const primary = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
  const email = primary?.emailAddress?.toLowerCase();
  if (!email) return false;

  return adminEmails.includes(email);
}

/**
 * Returns the current admin user's email, or null if not signed in
 * or not an admin. Useful for displaying who's viewing the dashboard.
 */
export async function adminEmail(): Promise<string | null> {
  if (!(await isAdmin())) return null;
  const user = await currentUser();
  const primary = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
  return primary?.emailAddress ?? null;
}
