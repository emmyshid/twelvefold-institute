import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { maybeWelcome } from "@/lib/welcome";

export const metadata: Metadata = {
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
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
