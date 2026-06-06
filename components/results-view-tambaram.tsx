"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, ArrowLeft, Download, CheckCircle2, Loader2 } from "lucide-react"
import type { FormData } from "./form-modal"

interface ResultsViewTambaramProps {
  formData: FormData
  capturedImage: string | null
  onBack: () => void
}

const resultsData = {
  "hair-fall": {
    title: "Hair Fall Report",
    description:
      "Based on our AI analysis, we have identified specific issues. Please download the PDF to learn about the solutions.",
    docTitle: "Hair Fall Report",
    docDescription: "Detailed report with stage-wise plan and treatment recommendations for hair fall.",
  },
  "crown-thinning": {
    title: "Crown Thinning Report",
    description:
      "Hair density is reducing at the crown area, often an early sign of pattern baldness.",
    docTitle: "Crown Thinning Report",
    docDescription: "Stage-based restoration plan for crown thinning and pattern hair loss.",
  },
  "frontal-hair-loss": {
    title: "Frontal Hair Loss Report",
    description:
      "Hairline recession or thinning in the front area is noticed. This is often caused by genetics, stress, or hormonal changes.",
    docTitle: "Frontal Hair Loss Report",
    docDescription: "Focused plan to control recession and restore frontal hairline density.",
  },
  "dandruff-scalp-issues": {
    title: "Dandruff / Scalp Issues Report",
    description:
      "Flaky scalp, itching, or irritation is affecting your hair health and growth.",
    docTitle: "Dandruff / Scalp Issues Report",
    docDescription: "Scalp-focused report with therapy suggestions and stage-wise care guidance.",
  },
  "low-hair-density": {
    title: "Low Hair Density Report",
    description:
      "Hair appears thin, flat, and lacks volume due to weak or inactive follicles.",
    docTitle: "Low Hair Density Report",
    docDescription: "Comprehensive density restoration report with treatment path by stage.",
  },
}

const pdfByProblem: Record<keyof typeof resultsData, string> = {
  "hair-fall": "/Hair-Fall-Report.pdf",
  "crown-thinning": "/Crown-Thinning-Report.pdf",
  "frontal-hair-loss": "/Frontal-Hair-Loss-Report.pdf",
  "dandruff-scalp-issues": "/Dandruff-Scalp-Issues-Report.pdf",
  "low-hair-density": "/Lower-Hair-Density-Report.pdf",
}

async function downloadFromPublic(pdfPath: string, fileName: string) {
  const response = await fetch(pdfPath)
  if (!response.ok) {
    throw new Error(`PDF not found at ${pdfPath}`)
  }

  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = blobUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

export function ResultsViewTambaram({ formData, capturedImage, onBack }: ResultsViewTambaramProps) {
  const [pdfFormOpen, setPdfFormOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfForm, setPdfForm] = useState({ name: formData.name || "", phone: formData.phone || "" })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [clinicVisit, setClinicVisit] = useState<"" | "yes" | "no">("")

  const problem = (formData.problem || "hair-fall") as keyof typeof resultsData
  const data = resultsData[problem]

  if (!data) return null

  const handleDownload = () => {
    setPdfForm({ name: formData.name || "", phone: formData.phone || "" })
    setSubmitError(null)
    setClinicVisit("")
    setPdfFormOpen(true)
  }

  const handlePdfFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pdfForm.name.trim() || !pdfForm.phone.trim()) return
    setPdfGenerating(true)
    try {
      // Save to Tambaram database only
      const saveRes = await fetch("/api/save-scan-tambaram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pdfForm.name,
          phone: pdfForm.phone,
          location: "Tambaram",
          problem,
          imageData: capturedImage ?? "",
          pageUrl: window.location.href,
        }),
      })
      if (!saveRes.ok) {
        const payload = await saveRes.json().catch(() => ({ error: "Failed to save scan" }))
        throw new Error(payload?.error || "Failed to save scan")
      }

      const fileName = `${data.docTitle.replace(/\s+/g, "_")}.pdf`
      await downloadFromPublic(pdfByProblem[problem], fileName)
      setPdfFormOpen(false)
      // Redirect to Tambaram-specific thank-you page
      window.location.assign("/thankyou-tambaram")
    } catch (err) {
      console.error("Submit/download failed:", err)
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg.includes("already been used")) {
        setSubmitError("This mobile number has already submitted a lead. Please use a different number.")
      } else if (msg.includes("PDF not found")) {
        setSubmitError(msg)
      } else {
        setSubmitError("Something went wrong. Please try again.")
      }
    } finally {
      setPdfGenerating(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080b12", color: "#f2f0eb", padding: "0" }}>

      {/* ── Top glow ── */}
      <style>{`
        .pdf-card-inner { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .pdf-dl-btn { display: flex; flex-shrink: 0; }
        .mobile-dl-btn { display: none; }
        @media (max-width: 480px) {
          .pdf-card-inner { flex-direction: column; align-items: stretch; }
          .pdf-dl-btn { display: none; }
          .mobile-dl-btn { display: flex; }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(221,185,90,0.07), transparent)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "32px 16px 60px" }}>

        {/* ── Back button ── */}
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#8a8a8a", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", marginBottom: "32px", padding: "0" }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Home
        </button>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
            border: "1px solid rgba(221,185,90,0.4)",
            background: "rgba(221,185,90,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(221,185,90,0.2)"
          }}>
            <CheckCircle2 style={{ width: 30, height: 30, color: "#ddb95a" }} />
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>{data.title}</h1>
          {formData.name && (
            <p style={{ color: "#8a8a8a", fontSize: "0.95rem" }}>Personalized for <span style={{ color: "#ddb95a", fontWeight: 600 }}>{formData.name}</span></p>
          )}
          <div style={{ margin: "20px auto 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ height: "1px", width: 40, background: "linear-gradient(90deg, transparent, rgba(221,185,90,0.5))" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ddb95a", boxShadow: "0 0 6px rgba(221,185,90,0.8)" }} />
            <div style={{ height: "1px", width: 40, background: "linear-gradient(270deg, transparent, rgba(221,185,90,0.5))" }} />
          </div>
        </div>

        {/* ── Mobile-only Download Button ── */}
        <button
          onClick={handleDownload}
          disabled={pdfGenerating}
          className="mobile-dl-btn"
          style={{
            alignItems: "center", justifyContent: "center", gap: "8px",
            width: "100%", marginBottom: "20px",
            background: "#ddb95a", color: "#080b12",
            border: "none", borderRadius: "12px",
            padding: "14px", fontSize: "1rem", fontWeight: 700,
            cursor: pdfGenerating ? "not-allowed" : "pointer",
            opacity: pdfGenerating ? 0.7 : 1,
            boxShadow: "0 0 24px rgba(221,185,90,0.3)"
          }}
        >
          {pdfGenerating
            ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
            : <Download style={{ width: 18, height: 18 }} />}
          {pdfGenerating ? "Generating…" : "Download PDF"}
        </button>

        {/* ── Analysis Summary ── */}
        <div style={{
          background: "linear-gradient(145deg, #0e1118, #0a0d15)",
          border: "1px solid rgba(221,185,90,0.2)",
          borderRadius: "18px", padding: "28px",
          marginBottom: "20px", position: "relative", overflow: "hidden",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(221,185,90,0.07)"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>your AI Scan Report is Ready</p>
          <p style={{ lineHeight: 1.8, color: "#9a9a9a", fontSize: "0.95rem" }}>{data.description}</p>
        </div>

        {/* ── PDF Download card ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(221,185,90,0.12), rgba(221,185,90,0.04))",
          border: "1px solid rgba(221,185,90,0.35)",
          borderRadius: "18px", padding: "24px 28px",
          marginBottom: "20px", position: "relative", overflow: "hidden",
          boxShadow: "0 4px 30px rgba(221,185,90,0.08)"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />
          <div className="pdf-card-inner">
            <div style={{
              width: 52, height: 52, borderRadius: "14px", flexShrink: 0,
              border: "1px solid rgba(221,185,90,0.4)",
              background: "rgba(221,185,90,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(221,185,90,0.15)"
            }}>
              <FileText style={{ width: 24, height: 24, color: "#ddb95a" }} />
            </div>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <p style={{ fontWeight: 700, fontSize: "0.97rem", color: "#f2f0eb", marginBottom: "4px" }}>{data.docTitle}</p>
              <p style={{ fontSize: "0.82rem", color: "#8a8a8a", lineHeight: 1.5 }}>{data.docDescription}</p>
            </div>
            <button
              onClick={handleDownload}
              disabled={pdfGenerating}
              className="pdf-dl-btn"
              style={{
                alignItems: "center", gap: "8px",
                background: "#ddb95a", color: "#080b12",
                border: "none", borderRadius: "10px",
                padding: "11px 22px", fontSize: "0.9rem", fontWeight: 700,
                cursor: pdfGenerating ? "not-allowed" : "pointer",
                opacity: pdfGenerating ? 0.7 : 1,
                boxShadow: "0 0 20px rgba(221,185,90,0.3)",
                transition: "all 0.2s"
              }}
            >
              {pdfGenerating
                ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                : <Download style={{ width: 16, height: 16 }} />}
              {pdfGenerating ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: "linear-gradient(145deg, #0e1118, #0a0d15)",
          border: "1px solid rgba(221,185,90,0.15)",
          borderRadius: "18px", padding: "28px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}>
          <p style={{ color: "#8a8a8a", fontSize: "0.9rem", marginBottom: "16px" }}>
            Want to speak with a specialist about your results?
          </p>
          <a
            href="tel:9363707090"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#ddb95a", color: "#080b12",
              borderRadius: "10px", padding: "12px 28px",
              fontSize: "1rem", fontWeight: 700, textDecoration: "none",
              boxShadow: "0 0 24px rgba(221,185,90,0.3)",
              transition: "all 0.2s"
            }}
          >
            Book a Consultation
          </a>
        </div>
      </div>

      {/* ── PDF Form Dialog ── */}
      <Dialog open={pdfFormOpen} onOpenChange={(open) => !pdfGenerating && setPdfFormOpen(open)}>
        <DialogContent data-pdf-dialog className="border-primary/20 bg-card/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-foreground">Download Your Guide</DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              {pdfGenerating ? "Generating your PDF, please wait…" : "Enter your name and phone number to generate the PDF"}
            </DialogDescription>
          </DialogHeader>

          {pdfGenerating ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Building your personalized guide…</p>
            </div>
          ) : (
            <form onSubmit={handlePdfFormSubmit} className="mt-4 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pdf-name-tambaram" className="text-foreground">Name</Label>
                <Input
                  id="pdf-name-tambaram"
                  placeholder="Enter your name"
                  value={pdfForm.name}
                  onChange={(e) => setPdfForm({ ...pdfForm, name: e.target.value })}
                  className="border-border/50 bg-background/50 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pdf-phone-tambaram" className="text-foreground">Phone Number</Label>
                <Input
                  id="pdf-phone-tambaram"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={pdfForm.phone}
                  onChange={(e) => { setSubmitError(null); setPdfForm({ ...pdfForm, phone: e.target.value }) }}
                  className={submitError ? "border-destructive bg-background/50 focus:border-destructive focus:ring-destructive" : "border-border/50 bg-background/50 focus:border-primary focus:ring-primary"}
                />
                {submitError && (
                  <p className="text-xs font-medium text-destructive">{submitError}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Are you willing to visit Bonitaa hair and skin clinic?</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setClinicVisit("yes")}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem",
                      border: clinicVisit === "yes" ? "2px solid #ddb95a" : "2px solid rgba(221,185,90,0.25)",
                      background: clinicVisit === "yes" ? "rgba(221,185,90,0.18)" : "rgba(221,185,90,0.05)",
                      color: clinicVisit === "yes" ? "#ddb95a" : "#9a9a9a",
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClinicVisit("no"); setPdfFormOpen(false) }}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem",
                      border: clinicVisit === "no" ? "2px solid #ef4444" : "2px solid rgba(239,68,68,0.25)",
                      background: clinicVisit === "no" ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.04)",
                      color: clinicVisit === "no" ? "#ef4444" : "#9a9a9a",
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    No
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!pdfForm.name.trim() || !pdfForm.phone.trim() || clinicVisit !== "yes"}
                className="mt-2 w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(221,185,90,0.4)] disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate & Download PDF
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
