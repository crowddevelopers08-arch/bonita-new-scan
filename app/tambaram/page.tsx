"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { HeroSectionTambaram } from "@/components/hero-section-tambaram"
import { InfoSectionTambaram } from "@/components/info-section-tambaram"
import type { FormData } from "@/components/form-modal"
import { CameraModal } from "@/components/camera-modal"
import { ScanLoader } from "@/components/scan-loader"
import Script from "next/script"

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

  useEffect(() => {
    // Initialize Facebook Pixel
    if (typeof window !== 'undefined' && !(window as any).fbq) {
      const fbq = (...args: any[]) => {
        if ((window as any).fbq) {
          (window as any).fbq(...args)
        }
      }
      
      !function(f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      
      fbq('init', '1348530381088676');
      fbq('track', 'PageView');
    }
  }, [])

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
    <>
      {/* Meta Pixel Script */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1348530381088676');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1348530381088676&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      
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
    </>
  )
}