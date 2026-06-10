import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        color: "#EDE9F5",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Aurora */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: 540,
          height: 540,
          top: -140,
          left: -110,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.32), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: 460,
          height: 460,
          top: 320,
          right: -130,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px clamp(20px, 5vw, 64px)",
            gap: "16px",
            background: "rgba(6,6,15,0.78)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "15px",
              letterSpacing: "1px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
            <span style={{ color: "#A78BFA" }}>Institute</span>
          </a>
          <a
            href="/"
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12.5px",
              letterSpacing: "0.8px",
              color: "#EDE9F5",
              textDecoration: "none",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            ← Back to home
          </a>
        </nav>

        <main
          style={{
            padding: "clamp(36px, 6vw, 60px) clamp(20px, 5vw, 64px)",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#A78BFA",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#FBBF24",
                  display: "inline-block",
                }}
              />
              Your account
            </div>
            <h1
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 600,
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Profile & settings
            </h1>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <UserProfile
              appearance={{
                variables: {
                  colorPrimary: "#A78BFA",
                  colorBackground: "#0c0c1a",
                  colorInputBackground: "rgba(255,255,255,0.05)",
                  colorInputText: "#EDE9F5",
                  colorText: "#EDE9F5",
                  colorTextSecondary: "rgba(237,233,245,0.6)",
                  colorNeutral: "#EDE9F5",
                  colorDanger: "#FF6B6B",
                  colorSuccess: "#FBBF24",
                  borderRadius: "11px",
                  fontFamily: "'Crimson Text', Georgia, serif",
                },
                elements: {
                  rootBox: { width: "100%" },
                  card: {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    width: "100%",
                  },
                  navbar: {
                    background: "transparent",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                  },
                  navbarButton: {
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                  },
                  headerTitle: {
                    fontFamily: "'Crimson Text', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 600,
                  },
                  headerSubtitle: {
                    fontFamily: "'Crimson Text', Georgia, serif",
                    color: "rgba(237,233,245,0.6)",
                  },
                  formButtonPrimary: {
                    background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    color: "#1a1206",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12.5px",
                    letterSpacing: "0.8px",
                    textTransform: "none",
                  },
                  profileSectionTitle: {
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#A78BFA",
                  },
                  formFieldLabel: {
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  },
                },
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
