import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { maybeWelcome } from "@/lib/welcome";

export const metadata: Metadata = {
  // Base URL for all OG images and Open Graph metadata across the site.
  // Without this, Next.js emits a build warning and relative image paths
  // in page-level metadata become unresolvable for link-preview crawlers.
  // The URL should match the production domain — override via
  // NEXT_PUBLIC_SITE_URL for preview deployments if needed.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://twelvefold.institute"
  ),
  // Title template: child pages can set their own title and the
  // " | Twelvefold Institute" suffix is appended automatically.
  title: {
    default: "Twelvefold Institute — Pattern Literacy",
    template: "%s | Twelvefold Institute",
  },
  // Description = formal slogan + clarifier. Used by Google, sharing,
  // browser bookmarks, and most aggregators.
  description:
    "Pattern Literacy for Life, Leadership, and Transformation. Twelvefold Institute teaches the ability to read the intelligent cycles governing human life and act with clarity, alignment, and purpose.",
  // Open Graph (Facebook, LinkedIn, Slack, iMessage, etc.) and
  // Twitter cards — both use the catchphrase as the subtitle so the
  // brand voice carries into social shares.
  openGraph: {
    title: "Twelvefold Institute — Read the Pattern. Align with the Order.",
    description:
      "Pattern Literacy for Life, Leadership, and Transformation.",
    url: "https://twelvefold.institute",
    siteName: "Twelvefold Institute",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twelvefold Institute — Read the Pattern. Align with the Order.",
    description:
      "Pattern Literacy for Life, Leadership, and Transformation.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fire the first-sight welcome check on every page load. Idempotent
  // via the profiles table primary-key constraint — the email is sent
  // exactly once per user, no matter how many times this runs.
  // Signed-out visitors are a no-op (returns immediately).
  await maybeWelcome();

  // Explicit sign-in/sign-up URLs. Without these, Clerk's SDK detects
  // the Account Portal and routes <UserButton>, middleware redirects,
  // and protected-route prompts directly to accounts.twelvefold.institute,
  // skipping our /sign-in route (which provides the themed splash).
  //
  // With these set, every Clerk SDK link goes through /sign-in first,
  // which then redirects to the hosted portal. URL bar shows our domain
  // throughout the user-visible flow.
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en">
        <body>
          {children}
          {/* Vercel Analytics: pageview and route tracking. Privacy-first —
              no cookies, no cross-site tracking, no consent banner required.
              Aggregated metrics only. Automatically enabled once the project
              is deployed on Vercel; no API key needed. */}
          <Analytics />
          {/* Vercel Speed Insights: Core Web Vitals (LCP, FID, CLS) and
              route-level performance. Complements Analytics with the
              latency picture per route so we can catch regressions on
              the audience-specific pages before conversion drops. */}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
