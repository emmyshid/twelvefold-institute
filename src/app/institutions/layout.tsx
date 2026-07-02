import type { Metadata } from "next";

// Metadata for the /institutions hub. The audience-specific pages at
// /for-institutions/[sector] carry their own richer metadata; this
// layout covers the general hub where all sectors are introduced.

export const metadata: Metadata = {
  title: "For Institutions",
  description:
    "Organizational diagnostics, framework licensing, and strategic partnerships for schools, healthcare systems, and mission-driven organizations. Read your institution's phase. Align with what the moment is asking.",
  openGraph: {
    title: "Twelvefold for Institutions",
    description:
      "Organizational diagnostics and framework licensing for schools, healthcare systems, and mission-driven organizations.",
    type: "website",
  },
};

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
