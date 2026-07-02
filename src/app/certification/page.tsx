import type { Metadata } from "next";
import CertificationPage from "@/components/CertificationPage";
import { getResolvedPricing, formatDisplayPrice } from "@/lib/pricing";

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

// Server-render the current certification price so any admin update
// via /admin/settings takes effect on the next page view without a
// code deploy. Fails safe: if resolution errors, the client falls
// back to its own default price string.
export const dynamic = "force-dynamic";

export default async function Page() {
  let priceLabel = "$6,500";
  try {
    const resolved = await getResolvedPricing("certification");
    priceLabel = formatDisplayPrice(resolved);
  } catch (e) {
    console.error("certification price resolution failed:", e);
  }
  return <CertificationPage priceLabel={priceLabel} />;
}
