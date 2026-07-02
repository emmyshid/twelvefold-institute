import type { Metadata } from "next";
import CertificationPage from "@/components/CertificationPage";

export const metadata: Metadata = {
  title: "Practitioner Certification",
  description:
    "The Twelvefold practitioner certification program. 200 hours over 24 weeks. Small cohorts. Three phases: foundations, applied pattern reading, practice and certification. For therapists, coaches, consultants, and educators.",
  openGraph: {
    title: "Practitioner Certification — Twelvefold Institute",
    description:
      "A 200-hour certification program in pattern literacy for therapists, coaches, and consultants. Small cohorts. Live sessions. Supervised practicums.",
    type: "website",
  },
};

export default function Page() {
  return <CertificationPage />;
}
