import type { Metadata } from "next";

// Metadata for /about. The route's page.tsx is a client component
// and cannot export metadata directly, so we co-locate a server-side
// layout here that owns the SEO/OG properties for the route.
// Next.js merges this with the site-wide metadata from src/app/layout.tsx.

export const metadata: Metadata = {
  title: "About",
  description:
    "The Twelvefold Institute is an independent education and research organization teaching pattern literacy — the ability to read the intelligent cycles governing human life. Founded by Emanuel Shidali.",
  openGraph: {
    title: "About Twelvefold Institute",
    description:
      "An independent education and research organization teaching pattern literacy — the ability to read the intelligent cycles governing human life.",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
