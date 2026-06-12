import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06060F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 6vw, 40px) clamp(12px, 4vw, 20px)",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "min(480px, 90vw)",
            height: "min(480px, 90vw)",
            top: "-15%",
            left: "-20%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.32), transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "min(400px, 85vw)",
            height: "min(400px, 85vw)",
            bottom: "-15%",
            right: "-20%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <a
        href="/"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "15px",
          letterSpacing: "1px",
          fontWeight: 700,
          textDecoration: "none",
          marginBottom: "clamp(20px, 4vw, 32px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span style={{ color: "#EDE9F5" }}>Twelvefold</span>{" "}
        <span style={{ color: "#A78BFA" }}>Institute</span>
      </a>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 440,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
          fallbackRedirectUrl="/"
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
                maxWidth: "100%",
                padding: "clamp(20px, 5vw, 32px)",
              },
              headerTitle: {
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 600,
              },
              headerSubtitle: {
                fontFamily: "'Crimson Text', Georgia, serif",
                color: "rgba(237,233,245,0.6)",
                fontSize: "clamp(14px, 3vw, 15px)",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                color: "#1a1206",
                fontFamily: "'Space Mono', monospace",
                fontSize: "12.5px",
                letterSpacing: "0.8px",
                textTransform: "none",
                minHeight: "44px",
              },
              socialButtonsBlockButton: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'Space Mono', monospace",
                minHeight: "44px",
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
              formFieldInput: {
                fontSize: "16px",
                minHeight: "44px",
              },
              footerActionLink: {
                color: "#A78BFA",
              },
            },
          }}
        />
      </div>

      <div
        style={{
          marginTop: "clamp(16px, 3vw, 24px)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          letterSpacing: "1px",
          color: "rgba(237,233,245,0.34)",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        Pattern literacy · for the long arc
      </div>
    </div>
  );
}
