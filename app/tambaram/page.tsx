"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { HeroSectionTambaram } from "@/components/hero-section-tambaram"
import { InfoSectionTambaram } from "@/components/info-section-tambaram"
import type { FormData } from "@/components/form-modal"
import { CameraModal } from "@/components/camera-modal"
import { ScanLoader } from "@/components/scan-loader"

const ResultsViewTambaram = dynamic(
  () => import("@/components/results-view-tambaram").then((m) => m.ResultsViewTambaram),
  { ssr: false }
)

type AppState = "landing" | "camera" | "scanning" | "results"

export default function TambaramPage() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    problem: "",
  })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleStartScanFromHero = (data: FormData) => {
    setFormData(data)
    setAppState("camera")
  }

  const handleStartScan = () => {
    setAppState("camera")
  }

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setAppState("scanning")
  }

  const handleScanComplete = () => {
    setAppState("results")
  }

  const handleBackToHome = () => {
    setAppState("landing")
    setFormData({ name: "", phone: "", problem: "" })
    setCapturedImage(null)
  }

  if (appState === "results") {
    return <ResultsViewTambaram formData={formData} capturedImage={capturedImage} onBack={handleBackToHome} />
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSectionTambaram onStartScan={handleStartScanFromHero} />
      <InfoSectionTambaram onStartScan={handleStartScan} />

      <CameraModal
        open={appState === "camera"}
        onOpenChange={(open) => !open && setAppState("landing")}
        onCapture={handleCapture}
      />

      <ScanLoader
        open={appState === "scanning"}
        onOpenChange={() => {}}
        capturedImage={capturedImage}
        onComplete={handleScanComplete}
      />
    </main>
  )
}
