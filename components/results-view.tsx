"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // eslint-disable-line @typescript-eslint/no-unused-vars
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, ArrowLeft, Download, CheckCircle2, Loader2 } from "lucide-react"
import type { FormData } from "./form-modal"

interface ResultsViewProps {
  formData: FormData
  capturedImage: string | null
  onBack: () => void
}

const resultsData = {
  "hair-fall": {
    title: "Hair Fall Report",
    description:
      "Based on our AI analysis, we have identified specific issues. Please download the PDF to learn about the solutions.",
    recommendations: [
      "PRP - Controls hair fall and strengthens roots",
      "GFC - Improves regrowth and thickness",
      "Mesotherapy - Nourishes scalp",
      "OLT - Supports root strength",
      "Combination treatment may be recommended",
    ],
    docTitle: "Hair Fall Report",
    docDescription: "Detailed report with stage-wise plan and treatment recommendations for hair fall.",
  },
  "crown-thinning": {
    title: "Crown Thinning Report",
    description:
      "Hair density is reducing at the crown area, often an early sign of pattern baldness.",
    recommendations: [
      "PRP - Activates weak follicles",
      "GFC - Improves crown density",
      "Mesotherapy - Strengthens scalp",
      "Hair Transplant - For advanced stages",
    ],
    docTitle: "Crown Thinning Report",
    docDescription: "Stage-based restoration plan for crown thinning and pattern hair loss.",
  },
  "frontal-hair-loss": {
    title: "Frontal Hair Loss Report",
    description:
      "Hairline recession or thinning in the front area is noticed. This is often caused by genetics, stress, or hormonal changes.",
    recommendations: [
      "PRP - Slows hairline recession",
      "GFC - Improves hair thickness",
      "Mesotherapy - Nourishes follicles",
      "Hair Transplant - Rebuilds hairline",
    ],
    docTitle: "Frontal Hair Loss Report",
    docDescription: "Focused plan to control recession and restore frontal hairline density.",
  },
  "dandruff-scalp-issues": {
    title: "Dandruff / Scalp Issues Report",
    description:
      "Flaky scalp, itching, or irritation is affecting your hair health and growth.",
    recommendations: [
      "Anti-Dandruff Therapy - Clears scalp",
      "OLT - Improves scalp health",
      "Mesotherapy - Nourishes roots",
      "Healthy scalp = Better hair growth",
    ],
    docTitle: "Dandruff / Scalp Issues Report",
    docDescription: "Scalp-focused report with therapy suggestions and stage-wise care guidance.",
  },
  "low-hair-density": {
    title: "Low Hair Density Report",
    description:
      "Hair appears thin, flat, and lacks volume due to weak or inactive follicles.",
    recommendations: [
      "GFC - Boosts density",
      "PRP - Strengthens follicles",
      "Mesotherapy - Improves nourishment",
      "Hair Transplant - For advanced thinning",
    ],
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
  const check = await fetch(pdfPath, { method: "HEAD" })
  if (!check.ok) {
    throw new Error(`PDF not found at ${pdfPath}`)
  }

  const link = document.createElement("a")
  link.href = pdfPath
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export function ResultsView({ formData, capturedImage, onBack }: ResultsViewProps) {
  const [pdfFormOpen, setPdfFormOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfForm, setPdfForm] = useState({ name: formData.name || "", phone: formData.phone || "" })

  const problem = (formData.problem || "hair-fall") as keyof typeof resultsData
  const data = resultsData[problem]

  if (!data) return null

  const handleDownload = () => {
    setPdfForm({ name: formData.name || "", phone: formData.phone || "" })
    setPdfFormOpen(true)
  }

  const handlePdfFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pdfForm.name.trim() || !pdfForm.phone.trim()) return
    setPdfGenerating(true)
    try {
      await fetch("/api/save-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pdfForm.name,
          phone: pdfForm.phone,
          problem,
          imageData: capturedImage ?? "",
        }),
      }).catch((err) => console.error("Failed to save scan:", err))
      const fileName = `${data.docTitle.replace(/\s+/g, "_")}.pdf`
      await downloadFromPublic(pdfByProblem[problem], fileName)
      setPdfFormOpen(false)
    } catch (err) {
      console.error("PDF generation failed:", err)
      if (err instanceof Error && err.message.includes("PDF not found")) {
        alert(err.message)
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
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>your AI Scan Report is Ready
</p>
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
                <Label htmlFor="pdf-name" className="text-foreground">Name</Label>
                <Input
                  id="pdf-name"
                  placeholder="Enter your name"
                  value={pdfForm.name}
                  onChange={(e) => setPdfForm({ ...pdfForm, name: e.target.value })}
                  className="border-border/50 bg-background/50 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pdf-phone" className="text-foreground">Phone Number</Label>
                <Input
                  id="pdf-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={pdfForm.phone}
                  onChange={(e) => setPdfForm({ ...pdfForm, phone: e.target.value })}
                  className="border-border/50 bg-background/50 focus:border-primary focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={!pdfForm.name.trim() || !pdfForm.phone.trim()}
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

