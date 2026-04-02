"use client"

import dynamic from "next/dynamic"
import { Smartphone, FlaskConical, Leaf, Zap, Users, Award, MapPin, Phone, CalendarDays } from "lucide-react"

const VideoCarousel = dynamic(() => import("./videosection"), { ssr: false })

interface InfoSectionProps {
  onStartScan: () => void
}

export function InfoSection({ onStartScan }: InfoSectionProps) {
  return (
    <div style={{ background: "#080b12", color: "#f2f0eb" }}>
      <style>{`
        .info-section { padding: 40px 16px; }
        .info-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .info-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 60px; align-items: center; }
        .info-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .info-cta-card { padding: 36px 32px; }
        .info-cta-btns { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
        .info-cta-btn { width: auto; }
        .info-side-images { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin: 0 auto 28px; maxWidth: 560px; }
        .info-side-image { width: 100%; height: 180px; object-fit: cover; border-radius: 16px; border: 1px solid rgba(221,185,90,0.25); box-shadow: 0 6px 24px rgba(0,0,0,0.35); }

        @media (max-width: 1024px) {
          .info-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .info-section { padding: 28px 16px; }
          .info-grid-3 { grid-template-columns: 1fr; }
          .info-grid-2 { grid-template-columns: 1fr; gap: 36px; }
          .info-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .info-cta-card { padding: 24px 16px; }
          .info-side-images { maxWidth: 440px; }
          .info-side-image { height: 150px; }
        }
        @media (max-width: 480px) {
          .info-section { padding: 20px 12px; }
          .info-grid-4 { grid-template-columns: 1fr 1fr; gap: 12px; }
          .info-cta-btns { flex-direction: column; align-items: stretch; }
          .info-cta-btn { justify-content: center; }
          .info-side-images { grid-template-columns: 1fr; gap: 12px; max-width: 280px; }
          .info-side-image { height: 140px; }
        }
      `}</style>

      {/* ══ TOP DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #ddb95a55, transparent)" }} />

      {/* ══════════════════════════════════
          SECTION 1 — INTRO
      ══════════════════════════════════ */}
      <section className="info-section" style={{ position: "relative", overflow: "hidden" }}>
        {/* bg glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(221,185,90,0.08), transparent)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1px solid rgba(221,185,90,0.35)", borderRadius: "999px",
            background: "rgba(221,185,90,0.08)", padding: "6px 18px",
            fontSize: "13px", fontWeight: 600, color: "#ddb95a",
            marginBottom: "28px", boxShadow: "0 0 20px rgba(221,185,90,0.1)"
          }}>
            <Award style={{ width: 14, height: 14 }} />
            Trusted by  50k+ Clients Across Tamil Nadu
          </div>

          <div className="info-side-images">
            <img
              src="before4.webp"
              alt="Hair scan left view"
              className="info-side-image"
            />
            <img
              src="before5.webp"
              alt="Hair scan right view"
              className="info-side-image"
            />
          </div>

          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "20px", letterSpacing: "-0.02em" }}>
            Hair Fall Problems?{" "}
            <span style={{ background: "linear-gradient(90deg, #ddb95a, #f5e199)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Bonitaa HQ Has the Solution! 🌟
            </span>
          </h2>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#8a8a8a", maxWidth: "680px", margin: "0 auto" }}>
            Is hair fall increasing every day? Using products but seeing no results? Without understanding the root cause,
            it&apos;s a waste to keep trying treatments. At Bonitaa HQ, we&apos;ll analyze your hair roots online and identify the{" "}
            <span style={{ color: "#ddb95a", fontWeight: 600 }}>real reason</span> behind your hair loss.
          </p>
        </div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.2), transparent)" }} />

     <VideoCarousel />
      {/* ══════════════════════════════════
          SECTION 2 — 3 FEATURE CARDS
      ══════════════════════════════════ */}
      <section className="info-section" style={{ position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>How It Works</p>
            <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>Three Steps to Healthier Hair</h2>
          </div>

          <div className="info-grid-3">
            {[
              { icon: <Smartphone style={{ width: 28, height: 28, color: "#ddb95a" }} />, step: "01", title: "Scan It Yourself Online! 📱", desc: "Wherever you are, analyze your hair using your phone and instantly download a personalized report designed just for you." },
              { icon: <FlaskConical style={{ width: 28, height: 28, color: "#ddb95a" }} />, step: "02", title: "Only the Best Technology! 🔬", desc: "PRP, GFC, or Hair Transplant? We guide you to the right treatment, decided scientifically based on your condition." },
              { icon: <Leaf style={{ width: 28, height: 28, color: "#ddb95a" }} />, step: "03", title: "Natural Solutions Too! 🌿", desc: "Not every treatment is necessary. Simple natural solutions with proper doctor guidance to improve hair health." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "linear-gradient(145deg, #0e1118, #0a0d15)",
                border: "1px solid rgba(221,185,90,0.22)",
                borderRadius: "20px", padding: "36px 32px",
                position: "relative", overflow: "hidden",
                boxShadow: "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(221,185,90,0.08)"
              }}>
                {/* top gold line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />

                {/* step watermark */}
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: "56px", fontWeight: 900, color: "rgba(221,185,90,0.07)", lineHeight: 1, userSelect: "none" }}>{item.step}</div>

                {/* icon box */}
                <div style={{
                  width: 56, height: 56, borderRadius: "14px",
                  border: "1px solid rgba(221,185,90,0.3)",
                  background: "rgba(221,185,90,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "22px", boxShadow: "0 0 18px rgba(221,185,90,0.12)"
                }}>
                  {item.icon}
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", color: "#f2f0eb" }}>{item.title}</h3>
                <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#8a8a8a" }}>{item.desc}</p>

                {/* bottom accent */}
                <div style={{ marginTop: "24px", height: "1px", background: "linear-gradient(90deg, rgba(221,185,90,0.4), transparent)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.2), transparent)" }} />

      {/* ══════════════════════════════════
          SECTION 3 — WHAT YOU GET (2-col)
      ══════════════════════════════════ */}
      <section className="info-section" style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 60% at 80% 50%, rgba(221,185,90,0.05), transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div className="info-grid-2">

            {/* left */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "14px" }}>Your Benefits</p>
              <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "18px" }}>
                What Will You Get at{" "}
                <span style={{ background: "linear-gradient(90deg, #ddb95a, #f5e199)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Bonitaa HQ?
                </span>
              </h2>
              <p style={{ color: "#8a8a8a", lineHeight: 1.8, fontSize: "1rem" }}>
                Every client gets a tailored experience — no generic solutions, only what works for your specific hair condition.
              </p>
              <div style={{ marginTop: "28px", display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ width: 48, height: 3, borderRadius: 4, background: "#ddb95a" }} />
                <div style={{ width: 24, height: 3, borderRadius: 4, background: "rgba(221,185,90,0.4)" }} />
                <div style={{ width: 12, height: 3, borderRadius: 4, background: "rgba(221,185,90,0.2)" }} />
              </div>
            </div>

            {/* right */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: <Zap style={{ width: 18, height: 18, color: "#ddb95a" }} />, title: "Fast & Accurate Results", desc: "Using the latest technology, we identify the cause of your hair loss with precision." },
                { icon: <Users style={{ width: 18, height: 18, color: "#ddb95a" }} />, title: "Personalized Care", desc: "Special plans tailored for your hair type — no generic advice, only what works." },
                { icon: <Award style={{ width: 18, height: 18, color: "#ddb95a" }} />, title: "Expert Guidance", desc: "Home remedies or advanced treatments — professional advice at every step." },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: "16px",
                  background: "linear-gradient(145deg, #0e1118, #0a0d15)",
                  border: "1px solid rgba(221,185,90,0.18)",
                  borderRadius: "14px", padding: "20px 22px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(221,185,90,0.06)"
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "10px", flexShrink: 0,
                    border: "1px solid rgba(221,185,90,0.28)",
                    background: "rgba(221,185,90,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px", color: "#f2f0eb" }}>{item.title}</p>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "#8a8a8a" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.2), transparent)" }} />

      {/* ══════════════════════════════════
          SECTION 4 — STATS
      ══════════════════════════════════ */}
      <section className="info-section" style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(221,185,90,0.05), transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>Why Choose Us</p>
            <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              What Makes{" "}
              <span style={{ background: "linear-gradient(90deg, #ddb95a, #f5e199)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Bonitaa HQ Different?
              </span>
            </h2>
          </div>

          <div className="info-grid-4">
            {[
              { icon: <Award style={{ width: 32, height: 32, color: "#ddb95a" }} />, stat: "FDA Approved", sub: "Treatments", desc: "Only FDA-approved technologies for safe, effective hair restoration." },
              { icon: <Users style={{ width: 32, height: 32, color: "#ddb95a" }} />, stat: "10,000+", sub: "Happy Clients", desc: "Clients who have experienced life-changing hair restoration." },
              { icon: <Zap style={{ width: 32, height: 32, color: "#ddb95a" }} />, stat: "15+ Years", sub: "of Experience", desc: "Tailored treatments specifically for Indian hair needs." },
              { icon: <MapPin style={{ width: 32, height: 32, color: "#ddb95a" }} />, stat: "22+ Clinics", sub: "Tamil Nadu", desc: "Trusted services easily accessible near you." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "linear-gradient(160deg, #0e1118, #080b12)",
                border: "1px solid rgba(221,185,90,0.22)",
                borderRadius: "20px", padding: "32px 24px",
                textAlign: "center", position: "relative", overflow: "hidden",
                boxShadow: "0 4px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(221,185,90,0.08)"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />

                <div style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 18px",
                  border: "1px solid rgba(221,185,90,0.3)",
                  background: "rgba(221,185,90,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(221,185,90,0.15)"
                }}>
                  {item.icon}
                </div>

                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ddb95a", lineHeight: 1 }}>{item.stat}</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f2f0eb", margin: "4px 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.sub}</p>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.65, color: "#8a8a8a" }}>✔️ {item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.2), transparent)" }} />

      {/* ══════════════════════════════════
          SECTION 5 — CTA
      ══════════════════════════════════ */}
      <section className="info-section" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(221,185,90,0.08), transparent)", pointerEvents: "none" }} />

        {/* big outer card */}
        <div className="info-cta-card" style={{
          maxWidth: "860px", margin: "0 auto", position: "relative",
          background: "linear-gradient(145deg, #0e1118, #0a0d15)",
          border: "1px solid rgba(221,185,90,0.3)",
          borderRadius: "28px",
          textAlign: "center",
          boxShadow: "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(221,185,90,0.1)"
        }}>
          {/* top accent */}
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)", borderRadius: "2px" }} />

          <p style={{ color: "#8a8a8a", lineHeight: 1.8, fontSize: "1rem", marginBottom: "32px", maxWidth: "640px", margin: "0 auto 32px" }}>
            At Bonitaa HQ, we understand the unique hair problems faced by Indians. With over 15 years of expertise,
            we specialize in FDA-approved treatments — be it PRP, GFC, or Hair Transplant — based on scientific analysis.
          </p>

          {/* gold dot divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{ height: "1px", width: 48, background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.5))" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ddb95a", boxShadow: "0 0 8px rgba(221,185,90,0.8)" }} />
            <div style={{ height: "1px", width: 48, background: "linear-gradient(270deg, transparent, rgba(221,185,90,0.5))" }} />
          </div>

          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "12px" }}>
            Ready to{" "}
            <span style={{ background: "linear-gradient(90deg, #ddb95a, #f5e199)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Restore Your Hair?
            </span>
          </h2>
          <p style={{ color: "#8a8a8a", marginBottom: "36px", fontSize: "1rem" }}>
            Don&apos;t let hair loss hold you back. Experience expert care tailored to Indian hair problems.
          </p>

          <div className="info-cta-btns">
            {/* <button
              onClick={onStartScan}
              className="info-cta-btn"
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#ddb95a", color: "#080b12",
                border: "none", borderRadius: "12px",
                padding: "14px 32px", fontSize: "1rem", fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(221,185,90,0.35)",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(221,185,90,0.55)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(221,185,90,0.35)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)" }}
            >
              <CalendarDays style={{ width: 20, height: 20 }} />
              Book Consultation Now
            </button> */}

            <a
              href="tel:9363707090"
              className="info-cta-btn"
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "transparent", color: "#ddb95a",
                border: "1px solid rgba(221,185,90,0.4)",
                borderRadius: "12px", padding: "14px 32px",
                fontSize: "1rem", fontWeight: 700,
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(221,185,90,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(221,185,90,0.7)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(221,185,90,0.4)" }}
            >
              <Phone style={{ width: 20, height: 20 }} />
              9363707090
            </a>
          </div>

          <p style={{ marginTop: "20px", fontSize: "0.82rem", color: "rgba(221,185,90,0.5)", fontStyle: "italic" }}>
            A call... for a clear solution!
          </p>
        </div>
      </section>

      {/* ══ BOTTOM DIVIDER ══ */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #ddb95a55, transparent)" }} />
    </div>
  )
}
