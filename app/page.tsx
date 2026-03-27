"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { FormModal, type FormData } from "@/components/form-modal"
import { CameraModal } from "@/components/camera-modal"
import { ScanLoader } from "@/components/scan-loader"

const ResultsView = dynamic(
  () => import("@/components/results-view").then((m) => m.ResultsView),
  { ssr: false }
)

type AppState = "landing" | "form" | "camera" | "scanning" | "results"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    problem: "",
  })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleStartScan = () => {
    setAppState("form")
  }

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setAppState("camera")
  }

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setAppState("scanning")
  }

  const handleScanComplete = async () => {
    if (capturedImage) {
      await fetch("/api/save-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          problem: formData.problem,
          imageData: capturedImage,
        }),
      }).catch((err) => console.error("Failed to save scan:", err))
    }
    setAppState("results")
  }

  const handleBackToHome = () => {
    setAppState("landing")
    setFormData({ name: "", phone: "", problem: "" })
    setCapturedImage(null)
  }

  if (appState === "results") {
    return <ResultsView formData={formData} onBack={handleBackToHome} />
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onStartScan={handleStartScan} />

      {/* Form Modal */}
      <FormModal
        open={appState === "form"}
        onOpenChange={(open) => !open && setAppState("landing")}
        onSubmit={handleFormSubmit}
      />

      {/* Camera Modal */}
      <CameraModal
        open={appState === "camera"}
        onOpenChange={(open) => !open && setAppState("form")}
        onCapture={handleCapture}
      />

      {/* Scan Loader */}
      <ScanLoader
        open={appState === "scanning"}
        onOpenChange={() => {}}
        capturedImage={capturedImage}
        onComplete={handleScanComplete}
      />
    </main>
  )
}
