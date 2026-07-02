import type { Metadata } from "next";

// Metadata for /pattern-literacy — the framework explainer page that
// shows how six wisdom traditions independently converged on the same
// 12-phase structure of transformation.

export const metadata: Metadata = {
  title: "Pattern Literacy",
  description:
    "The framework behind Twelvefold Institute. Six wisdom traditions — Ifá, Kabbalah, I Ching, scripture, Buddhism, Hermetic philosophy — independently mapped the same 12 phases of transformation. Pattern literacy is the skill of reading which phase you are in and cooperating with it.",
  openGraph: {
    title: "Pattern Literacy — The Framework",
    description:
      "Six wisdom traditions, one convergent structure. The 12 phases of transformation and how to read them.",
    type: "website",
  },
};

export default function PatternLiteracyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
