import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignUpClient from "./SignUpClient";

// ════════════════════════════════════════════════════════════════
// /sign-up — server-side device routing (mirrors /sign-in).
// See SignInPage for the full rationale. In short: embedded Clerk
// component works on desktop + iPad, fails silently on phone-class
// browsers. We redirect phone users to the hosted Account Portal.
// ════════════════════════════════════════════════════════════════

const PHONE_UA = /iPhone|(?:Android.*Mobile)/i;
const ACCOUNT_PORTAL = "https://accounts.twelvefold.institute/sign-up";
const APP_ORIGIN = "https://twelvefold.institute";

interface PageProps {
  searchParams: Promise<{ redirect_url?: string; [key: string]: string | undefined }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ua = (await headers()).get("user-agent") || "";
  const isPhone = PHONE_UA.test(ua);

  if (isPhone) {
    // Absolute return URL — see SignInPage rationale.
    const requested = sp.redirect_url || "/";
    const absoluteTarget = requested.startsWith("http")
      ? requested
      : `${APP_ORIGIN}${requested.startsWith("/") ? requested : "/" + requested}`;

    const url = new URL(ACCOUNT_PORTAL);
    url.searchParams.set("redirect_url", absoluteTarget);
    redirect(url.toString());
  }

  return <SignUpClient />;
}
