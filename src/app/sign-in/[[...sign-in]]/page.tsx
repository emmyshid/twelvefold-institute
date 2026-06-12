import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

// ════════════════════════════════════════════════════════════════
// /sign-in — server-side device routing.
//
// Background: the themed embedded <SignIn /> component works reliably
// on desktop and iPad-class browsers (desktop-class Safari, large
// viewport). It silently fails on phone-class browsers — both iPhone
// Safari and Android browsers (Chrome / Samsung Internet) — where
// the symptom is "tap continue, nothing happens, no error." We've
// hardened the embedded path multiple times (forceRedirectUrl,
// useUser fallback, 16px inputs, 44px tap targets) without resolving
// the silent-failure cases on phones.
//
// Conclusion: the embedded iframe-style auth flow is fragile across
// mobile browsers regardless of OS. We sidestep it for phones only.
//
// Mechanism:
//   • Server-side UA sniff — runs before any client JS, no flash
//   • Phone-class detection: iPhone, OR Android with "Mobile" token
//     (Android tablets typically omit "Mobile" from their UA)
//   • iPad reports as "iPad" or "Macintosh" — falls through to embedded
//   • Desktop falls through to embedded
//
// When detected as phone:
//   • Build the Account Portal URL at accounts.twelvefold.institute
//   • Preserve the original redirect_url so users return to where
//     they were trying to go
//   • Server-side 302 redirect — fastest possible, no client render
//
// Trade-off:
//   • Phone users see a slightly different (still Twelvefold-branded
//     via Clerk's portal theming) sign-in page during the auth step
//   • They DO successfully sign in, which is the entire point
// ════════════════════════════════════════════════════════════════

// Phone-class browser detector. Captures iPhone + Android phones.
// Deliberately does NOT capture iPad (no "iPhone" token in UA,
// "Mobile" in iPadOS Safari is balanced by the absence of "Android",
// so the AND-with-Android clause keeps us safe) or Android tablets
// (which usually omit "Mobile").
const PHONE_UA = /iPhone|(?:Android.*Mobile)/i;

// Clerk's hosted Account Portal lives at accounts.<custom-domain>
// when production-mode with a custom domain configured. Verified in
// Clerk dashboard → Configure → Domains.
const ACCOUNT_PORTAL = "https://accounts.twelvefold.institute/sign-in";

interface PageProps {
  searchParams: Promise<{ redirect_url?: string; [key: string]: string | undefined }>;
}

export default async function SignInPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ua = (await headers()).get("user-agent") || "";
  const isPhone = PHONE_UA.test(ua);

  if (isPhone) {
    // Build the portal URL, preserving the original return target.
    // Default to homepage if no redirect_url was provided.
    const target = sp.redirect_url || "/";
    // Clerk's portal expects an absolute URL OR a relative path;
    // we pass relative since the portal already knows the parent app.
    const url = new URL(ACCOUNT_PORTAL);
    url.searchParams.set("redirect_url", target);
    redirect(url.toString());
  }

  // Desktop / iPad / tablet — use the themed embedded experience
  return <SignInClient />;
}
