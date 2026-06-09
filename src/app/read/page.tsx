// The free reading lives on the homepage. This route is the host for the
// full PatternOS app (the existing PatternOS-v10 component, mounted here
// with "use client" and its localStorage calls swapped for /api/* calls).
// The /read/app sub-route is auth-protected in middleware.ts.

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div>
        <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 40, fontWeight: 600 }}>PatternOS</h1>
        <p style={{ fontFamily: "'Crimson Text', serif", color: "rgba(237,233,245,0.6)", marginTop: 12, maxWidth: 480 }}>
          Mount the PatternOS-v10 component here. See the README for how to
          port it: add &quot;use client&quot;, and replace its direct Anthropic
          fetch with a call to <code>/api/reading</code>.
        </p>
      </div>
    </main>
  );
}
