export default function ThankYouPage() {
  return (
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
      </div>
    </main>
  )
}
