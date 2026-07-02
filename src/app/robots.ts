import type { MetadataRoute } from "next";

// ════════════════════════════════════════════════════════════════
// robots.txt
//
// Tells search engines what to index and what to skip. Under Next.js
// App Router, exporting a default function from src/app/robots.ts
// generates /robots.txt at the site root at build time.
//
// Policy:
//   • Marketing routes are indexable (homepage, book, initiation,
//     for-practitioners, for-institutions/*, for-researchers, etc.)
//   • Private product surfaces are NOT indexed:
//       /admin, /account, /portal, /read/app  — authenticated only
//       /sign-in, /sign-up                    — noise for search
//       /api/*                                — never useful in search
//       /certification/payment-success        — post-payment landing
//   • The sitemap lives at /sitemap.xml
// ════════════════════════════════════════════════════════════════

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://twelvefold.institute";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/portal",
          "/read/app",
          "/sign-in",
          "/sign-up",
          "/api/",
          "/certification/payment-success",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
