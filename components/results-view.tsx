"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Download, CheckCircle2, Loader2 } from "lucide-react"
import type { FormData } from "./form-modal"

interface ResultsViewProps {
  formData: FormData
  onBack: () => void
}

const resultsData = {
  acne: {
    title: "Acne Treatment Plan",
    description:
      "Based on our AI analysis, we've identified specific acne patterns on your skin. Here's your personalized treatment plan designed by dermatology experts.",
    recommendations: [
      "Daily cleansing with salicylic acid-based cleanser",
      "Apply benzoyl peroxide spot treatment",
      "Use oil-free, non-comedogenic moisturizer",
      "Weekly clay mask for deep pore cleansing",
      "Consider retinoid treatment (consult dermatologist)",
    ],
    docTitle: "Complete Acne Treatment Guide",
    docDescription: "Detailed PDF guide with step-by-step skincare routine, product recommendations, and lifestyle tips.",
  },
  pigmentation: {
    title: "Pigmentation Care Guide",
    description:
      "Our AI detected areas of uneven skin tone and pigmentation. Here's your customized care plan to help restore radiant, even-toned skin.",
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
  const teal: [number, number, number] = [0, 201, 167]
  const dark: [number, number, number] = [13, 27, 42]
  const muted: [number, number, number] = [107, 114, 128]
  const lightBg: [number, number, number] = [240, 253, 249]

  // ── Header band ──
  doc.setFillColor(...dark)
  doc.rect(0, 0, pageW, 100, "F")

  doc.setTextColor(...teal)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text(guide.title, margin, 38)

  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(guide.subtitle, margin, 58)

  doc.setTextColor(...teal)
  doc.setFontSize(9)
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  doc.text(`Prepared for: ${name}`, margin, 80)
  doc.text(`Date: ${date}`, pageW - margin, 80, { align: "right" })

  let y = 118

  // ── Sections ──
  for (const section of guide.sections) {
    // Check if we need a new page (leave room for heading + at least one line)
    if (y + 60 > pageH - margin) {
      doc.addPage()
      y = margin
    }

    // Section heading background
    doc.setFillColor(...lightBg)
    doc.roundedRect(margin, y, contentW, 22, 3, 3, "F")

    doc.setTextColor(...teal)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text(section.heading, margin + 8, y + 15)

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

export function ResultsView({ formData, onBack }: ResultsViewProps) {
  const [loading, setLoading] = useState(false)
  const problem = formData.problem as keyof typeof resultsData
  const data = resultsData[problem]

  if (!data) return null

  const handleDownload = async () => {
    setLoading(true)
    try {
      await downloadPDF(problem, formData.name, data.docTitle)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/20 p-3">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{data.title}</h1>
          <p className="text-muted-foreground">Personalized for {formData.name}</p>
        </div>

        {/* Description */}
        <Card className="mb-6 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">{data.description}</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recommended Actions</CardTitle>
            <CardDescription>Follow these steps for optimal results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-foreground/90">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Document section */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-card/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{data.docTitle}</h3>
              <p className="text-sm text-muted-foreground">{data.docDescription}</p>
            </div>
            <Button
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating…" : "Download PDF"}
            </Button>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Want to speak with a specialist about your results?
          </p>
          <Button
            size="lg"
            className="bg-primary px-8 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,255,200,0.4)]"
          >
            Book a Consultation
          </Button>
        </div>
      </div>
    </div>
  )
}
