import type { MetadataRoute } from "next";
import { ESSAYS } from "./research/essays";
import { SECTOR_KEYS } from "./for-institutions/[sector]/sectorConfig";

// ════════════════════════════════════════════════════════════════
// sitemap.xml
//
// Under Next.js App Router, exporting a default function from
// src/app/sitemap.ts generates /sitemap.xml at build time.
//
// Every public marketing route is enumerated here. Priorities reflect
// funnel importance:
//   1.0 — homepage
//   0.9 — audience-specific conversion pages (Phase 3)
//   0.8 — high-value marketing (book, initiation, certification)
//   0.7 — secondary marketing (about, method, research, rhythms, transits)
//   0.6 — research essays (individual)
//
// The sitemap regenerates on every deploy, so lastModified reflects
// deploy time. If content changes without a deploy, that's fine —
// crawlers re-fetch periodically regardless.
// ════════════════════════════════════════════════════════════════

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://twelvefold.institute";
  const now = new Date();

  // Static marketing routes with priority weights.
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    // Audience-specific conversion pages (Phase 3)
    { path: "/for-practitioners", priority: 0.9, changeFrequency: "monthly" },
    { path: "/for-researchers-and-scholars", priority: 0.9, changeFrequency: "monthly" },
    // High-value marketing
    { path: "/book", priority: 0.8, changeFrequency: "weekly" },
    { path: "/initiation", priority: 0.8, changeFrequency: "monthly" },
    { path: "/certification", priority: 0.8, changeFrequency: "monthly" },
    { path: "/community", priority: 0.8, changeFrequency: "weekly" },
    { path: "/read", priority: 0.8, changeFrequency: "monthly" },
    // Institutional hub + framework explainer
    { path: "/institutions", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pattern-literacy", priority: 0.8, changeFrequency: "monthly" },
    // Secondary marketing
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/method", priority: 0.7, changeFrequency: "monthly" },
    { path: "/research", priority: 0.7, changeFrequency: "weekly" },
    { path: "/rhythms", priority: 0.7, changeFrequency: "monthly" },
    { path: "/transits", priority: 0.7, changeFrequency: "monthly" },
  ];

  // Dynamic: audience-specific institutional sectors
  const sectorRoutes = SECTOR_KEYS.map((sector) => ({
    path: `/for-institutions/${sector}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  // Dynamic: individual research essays
  const essayRoutes = ESSAYS.map((essay) => ({
    path: `/research/${essay.slug}`,
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...sectorRoutes, ...essayRoutes].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
