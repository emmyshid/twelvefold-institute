import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { maybeWelcome } from "@/lib/welcome";

export const metadata: Metadata = {
  title: "Twelvefold Institute",
  description:
    "Pattern literacy — the ability to read the intelligent cycles governing human life and act with clarity, alignment, and purpose.",
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
