"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // eslint-disable-line @typescript-eslint/no-unused-vars
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ArrowLeft, Download, CheckCircle2, Loader2 } from "lucide-react"
import type { FormData } from "./form-modal"

interface ResultsViewProps {
  formData: FormData
  capturedImage: string | null
  onBack: () => void
}

const resultsData = {
  acne: {
    title: "Acne Treatment Plan",
    description:
      "Based on our AI analysis, we've identified specific acne patterns on your hair and scalp. Here's your personalized treatment plan designed by hair care experts.",
    recommendations: [
      "Daily cleansing with salicylic acid-based cleanser",
      "Apply benzoyl peroxide spot treatment",
      "Use oil-free, non-comedogenic moisturizer",
      "Weekly clay mask for deep pore cleansing",
      "Consider retinoid treatment (consult dermatologist)",
    ],
    docTitle: "Complete Acne Treatment Guide",
    docDescription: "Detailed PDF guide with step-by-step hair care routine, product recommendations, and lifestyle tips.",
  },
  pigmentation: {
    title: "Pigmentation Care Guide",
    description:
      "Our AI detected uneven pigmentation affecting your scalp and hair. Here's your customized care plan to help restore healthy, even-toned hair.",
    recommendations: [
      "Daily SPF 50+ broad-spectrum sunscreen",
      "Vitamin C serum application (morning routine)",
      "Niacinamide-based products for tone evening",
      "Chemical exfoliation with AHA/BHA (2-3x weekly)",
      "Consider professional treatments (consult specialist)",
    ],
    docTitle: "Pigmentation Recovery Protocol",
    docDescription: "Comprehensive guide covering causes, prevention, and advanced treatment options.",
  },
  "hair-loss": {
    title: "Hair Loss Recovery Plan",
    description:
      "Based on our analysis of your scalp condition, we've created a personalized recovery plan to help promote healthier hair growth.",
    recommendations: [
      "Gentle, sulfate-free shampoo formula",
      "Scalp massage routine (5 mins daily)",
      "Biotin and zinc supplementation",
      "Minoxidil application (as directed)",
      "Balanced diet rich in proteins and vitamins",
    ],
    docTitle: "Hair Restoration Guide",
    docDescription: "Expert guide on hair growth cycles, treatments, and maintenance routines.",
  },
}

async function downloadPDF(problem: string, name: string, docTitle: string) {
  // Fetch guide content from API
  const res = await fetch(`/api/download-guide?problem=${problem}`)
  if (!res.ok) throw new Error("Failed to fetch guide")
  const guide = await res.json()

  // Dynamically import jsPDF (avoids SSR issues)
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 50
  const contentW = pageW - margin * 2

  // ── Colours ──
  const teal: [number, number, number] = [221, 185, 90]
  const dark: [number, number, number] = [8, 11, 18]
  const muted: [number, number, number] = [138, 138, 138]
  const lightBg: [number, number, number] = [22, 27, 38]

  // ── Header ──
  doc.setTextColor(...teal)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text(guide.title, margin, 38)

  doc.setTextColor(...muted)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(guide.subtitle, margin, 58)

  doc.setTextColor(...teal)
  doc.setFontSize(9)
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  doc.text(`Prepared for: ${name}`, margin, 76)
  doc.text(`Date: ${date}`, pageW - margin, 76, { align: "right" })

  // thin gold divider line under header
  doc.setDrawColor(...teal)
  doc.setLineWidth(0.5)
  doc.line(margin, 88, pageW - margin, 88)

  let y = 104

  // ── Sections ──
  for (const section of guide.sections) {
    // Check if we need a new page (leave room for heading + at least one line)
    if (y + 60 > pageH - margin) {
      doc.addPage()
      y = margin
    }

    doc.setTextColor(...teal)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text(section.heading, margin, y + 15)

    y += 28

    doc.setTextColor(...dark)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    for (const item of section.items) {
      const lines = doc.splitTextToSize(`  ${item}`, contentW - 10)
      if (y + lines.length * 14 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(lines, margin + 8, y)
      y += lines.length * 14 + 2
    }

    y += 10
  }

  // ── Divider ──
  if (y + 30 > pageH - margin) {
    doc.addPage()
    y = margin
  }
  doc.setDrawColor(...teal)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageW - margin, y)
  y += 10

  // ── Disclaimer ──
  doc.setTextColor(...muted)
  doc.setFont("helvetica", "italic")
  doc.setFontSize(8)
  const disclaimerLines = doc.splitTextToSize(`Disclaimer: ${guide.disclaimer}`, contentW)
  doc.text(disclaimerLines, margin, y)

  // ── Save ──
  const filename = `${docTitle.replace(/\s+/g, "_")}.pdf`
  doc.save(filename)
}

export function ResultsView({ formData, capturedImage, onBack }: ResultsViewProps) {
  const [pdfFormOpen, setPdfFormOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfForm, setPdfForm] = useState({ name: formData.name || "", phone: formData.phone || "", problem: formData.problem || "" })

  const problem = (formData.problem || "acne") as keyof typeof resultsData
  const data = resultsData[problem]

  if (!data) return null

  const handleDownload = () => {
    setPdfForm({ name: formData.name || "", phone: formData.phone || "", problem: formData.problem || "" })
    setPdfFormOpen(true)
  }

  const handlePdfFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pdfForm.name.trim() || !pdfForm.problem) return
    setPdfGenerating(true)
    try {
      await fetch("/api/save-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pdfForm.name,
          phone: pdfForm.phone,
          problem: pdfForm.problem,
          imageData: capturedImage ?? "",
        }),
      }).catch((err) => console.error("Failed to save scan:", err))
      const selectedData = resultsData[pdfForm.problem as keyof typeof resultsData]
      await downloadPDF(pdfForm.problem, pdfForm.name, selectedData.docTitle)
      setPdfFormOpen(false)
    } catch (err) {
      console.error("PDF generation failed:", err)
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
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "10px" }}>Analysis Summary</p>
          <p style={{ lineHeight: 1.8, color: "#9a9a9a", fontSize: "0.95rem" }}>{data.description}</p>
        </div>

        {/* ── Recommendations ── */}
        <div style={{
          background: "linear-gradient(145deg, #0e1118, #0a0d15)",
          border: "1px solid rgba(221,185,90,0.2)",
          borderRadius: "18px", padding: "28px",
          marginBottom: "20px", position: "relative", overflow: "hidden",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(221,185,90,0.07)"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #ddb95a, transparent)" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ddb95a", marginBottom: "6px" }}>Recommended Actions</p>
          <p style={{ fontSize: "0.82rem", color: "#8a8a8a", marginBottom: "20px" }}>Follow these steps for optimal results</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.recommendations.map((rec, index) => (
              <div key={index} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  border: "1px solid rgba(221,185,90,0.35)",
                  background: "rgba(221,185,90,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700, color: "#ddb95a"
                }}>
                  {index + 1}
                </div>
                <p style={{ lineHeight: 1.7, color: "#c8c4bc", fontSize: "0.93rem", paddingTop: "4px" }}>{rec}</p>
              </div>
            ))}
          </div>
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
              {pdfGenerating ? "Generating your PDF, please wait…" : "Enter your details to generate the PDF"}
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="pdf-problem" className="text-foreground">Hair Concern</Label>
                <Select
                  value={pdfForm.problem}
                  onValueChange={(value) => setPdfForm({ ...pdfForm, problem: value })}
                >
                  <SelectTrigger className="border-border/50 bg-background/50 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Choose a hair concern" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    <SelectItem value="acne">Acne</SelectItem>
                    <SelectItem value="pigmentation">Pigmentation</SelectItem>
                    <SelectItem value="hair-loss">Hair Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={!pdfForm.name.trim() || !pdfForm.problem}
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
