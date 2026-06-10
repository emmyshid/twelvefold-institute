import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          top: -120,
          left: -100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.32), transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          bottom: -120,
          right: -100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <a
        href="/"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "15px",
          letterSpacing: "1px",
          fontWeight: 700,
          textDecoration: "none",
          marginBottom: "32px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
        <span style={{ color: "#A78BFA" }}>Institute</span>
      </a>

      <div style={{ position: "relative", zIndex: 2 }}>
        <SignUp
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
              card: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              },
              headerTitle: {
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "28px",
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
                "&:hover": {
                  background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                  filter: "brightness(1.08)",
                },
              },
              socialButtonsBlockButton: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'Space Mono', monospace",
              },
              dividerText: {
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "2px",
              },
              formFieldLabel: {
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              },
              footerActionLink: {
                color: "#A78BFA",
                "&:hover": { color: "#FBBF24" },
              },
            },
          }}
        />
      </div>

      <div
        style={{
          marginTop: "24px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          letterSpacing: "1px",
          color: "rgba(237,233,245,0.34)",
          position: "relative",
          zIndex: 2,
        }}
      >
        Your readings will be saved · cancel anytime
      </div>
    </div>
  );
}
