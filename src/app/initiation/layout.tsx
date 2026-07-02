import type { Metadata } from "next";

// Metadata for /initiation — the 35-minute guided experience that
// introduces the framework and delivers a first phase reading.
// This is the highest-conversion entry point for new visitors, so
// social share metadata is worth caring about.

export const metadata: Metadata = {
  title: "The Initiation",
  description:
    "A 35-minute guided experience introducing pattern literacy. Recognize the phase you are in, hear what it is asking of you, and leave with one concrete practice for the week ahead. Free.",
  openGraph: {
    title: "Take the Initiation — Twelvefold Institute",
    description:
      "A 35-minute guided introduction to pattern literacy. Free. Recognize the phase you're in and what it's asking.",
    type: "website",
  },
};

export default function InitiationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
