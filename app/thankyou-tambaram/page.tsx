import Script from "next/script"
import { useEffect } from "react"

export default function ThankYouTambaramPage() {
  useEffect(() => {
    // Track SubmitApplication event when the page loads
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'SubmitApplication');
    }
  }, []);

  return (
    <>
      {/* Meta Pixel SubmitApplication Event */}
      <Script id="meta-pixel-submit-application-tambaram" strategy="afterInteractive">
        {`
          if (typeof fbq !== 'undefined') {
            fbq('track', 'SubmitApplication');
          }
        `}
      </Script>
      
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background:
            "radial-gradient(circle at top, rgba(221,185,90,0.14), transparent 38%), #080b12",
          color: "#f2f0eb",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            borderRadius: "24px",
            padding: "40px 28px",
            textAlign: "center",
            background: "linear-gradient(145deg, #0e1118, #0a0d15)",
            border: "1px solid rgba(221,185,90,0.22)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 18px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(221,185,90,0.12)",
              border: "1px solid rgba(221,185,90,0.35)",
              color: "#ddb95a",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 800 }}>
            Thank You
          </h1>
          <p style={{ margin: "0 auto", maxWidth: "420px", lineHeight: 1.7, color: "#bdb8ae" }}>
            Your details have been submitted successfully and your PDF should already be downloading.
            Our team will connect with you soon.
          </p>

          {/* Call CTA */}
          <a
            href="tel:9500663866"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "24px",
              padding: "14px 32px",
              borderRadius: "12px",
              background: "#ddb95a",
              color: "#080b12",
              fontSize: "1.05rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 0 28px rgba(221,185,90,0.35)",
              letterSpacing: "0.02em",
            }}
          >
            📞 9500663866
          </a>

          {/* Promo code section */}
          <div
            style={{
              marginTop: "28px",
              padding: "22px 20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(221,185,90,0.14), rgba(221,185,90,0.05))",
              border: "1px solid rgba(221,185,90,0.4)",
              boxShadow: "0 0 30px rgba(221,185,90,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>
              Exclusive Offers
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: "10px",
                background: "rgba(221,185,90,0.15)",
                border: "2px dashed rgba(221,185,90,0.6)",
                fontSize: "1.5rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#ddb95a",
                marginBottom: "14px",
                fontFamily: "monospace",
              }}
            >
              Bonitaa@2026
            </div>
            <p
              style={{
                margin: "0 auto",
                maxWidth: "380px",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#f2f0eb",
                background: "linear-gradient(90deg, rgba(221,185,90,0.18), rgba(221,185,90,0.08))",
                borderLeft: "3px solid #ddb95a",
                padding: "10px 14px",
                borderRadius: "0 8px 8px 0",
                textAlign: "left",
              }}
            >
              If you visit the clinic with this code you will receive an{" "}
              <span style={{ color: "#ddb95a", fontWeight: 800 }}>additional discount up to 20%</span>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}