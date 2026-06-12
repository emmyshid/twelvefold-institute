import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Twelvefold Institute",
  description:
    "Pattern literacy — the ability to read the intelligent cycles governing human life and act with clarity, alignment, and purpose.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
