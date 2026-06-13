import { ImageResponse } from "next/og";

// ════════════════════════════════════════════════════════════════
// Site-wide Open Graph image, auto-rendered by Next.js.
//
// File convention: src/app/opengraph-image.tsx is picked up by the
// App Router and served as /opengraph-image at 1200×630 (the
// standard size for Facebook, LinkedIn, Slack, iMessage, and Twitter
// summary_large_image cards). The metadata.openGraph.images config
// is NOT needed — the file convention takes care of it.
//
// Visual matches the live site: dark #06060F background, dual aurora
// blobs (purple top-left, gold bottom-right), serif typography for
// the catchphrase, monospace for the slogan, gold eyebrow above.
//
// Twitter cards inherit the OG image by default unless a separate
// twitter-image.tsx is supplied. One file is enough.
// ════════════════════════════════════════════════════════════════

export const runtime = "edge";
export const alt =
  "Twelvefold Institute — Read the Pattern. Align with the Order.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#06060F",
          color: "#EDE9F5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          fontFamily: "Georgia, serif",
          padding: "80px 100px",
          textAlign: "center",
        }}
      >
        {/* Aurora — top-left purple */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -180,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%)",
            display: "flex",
          }}
        />
        {/* Aurora — bottom-right gold */}
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(251,191,36,0.25), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 5,
            fontWeight: 700,
            color: "#FBBF24",
            textTransform: "uppercase",
            fontFamily: "monospace",
            marginBottom: 44,
            zIndex: 2,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#FBBF24",
              display: "flex",
            }}
          />
          Twelvefold Institute
        </div>

        {/* Catchphrase — the hero of the card */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -2,
            color: "#EDE9F5",
            marginBottom: 36,
            maxWidth: 1000,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Read the Pattern.</span>
          <span style={{ color: "#A78BFA" }}>Align with the Order.</span>
        </div>

        {/* Slogan — the subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(237,233,245,0.7)",
            fontStyle: "italic",
            lineHeight: 1.4,
            maxWidth: 880,
            zIndex: 2,
            display: "flex",
          }}
        >
          Pattern Literacy for Life, Leadership, and Transformation.
        </div>

        {/* URL footer */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 18,
            letterSpacing: 3,
            color: "rgba(237,233,245,0.4)",
            fontFamily: "monospace",
            textTransform: "uppercase",
            fontWeight: 700,
            zIndex: 2,
            display: "flex",
          }}
        >
          twelvefold.institute
        </div>
      </div>
    ),
    { ...size },
  );
}
