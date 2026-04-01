"use client"

import { Button } from "@/components/ui/button"
import { Phone, Scan, Sparkles, Shield, Zap } from "lucide-react"

interface HeroSectionProps {
  onStartScan: () => void
}

export function HeroSection({ onStartScan }: HeroSectionProps) {
  return (
    <section className="relative flex max-sm:py-5 md:py-15 flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(221,185,90,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(221,185,90,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(221,185,90,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(221,185,90,0.08),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-[55%] bg-[linear-gradient(180deg,rgba(221,185,90,0.1),transparent)]" />
        <div className="absolute left-0 top-1/3 h-40 w-full" /> 

        {/* Radial glow */}
        <div className="absolute left-1/2 top-[42%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-1/2 top-24 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[90px]" />

        {/* Floating orbs */}
        <div className="animate-float absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/14" />
        <div className="animate-float-delayed absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-primary/14 " />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 max-sm:mb-4 relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
          <div className="relative rounded-2xl border border-primary/20 bg-[#080b12]/80 px-6 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(221,185,90,0.12)]">
            <img
              src="/logo-1.png"
              alt="Bonitaa HQ"
              className="h-20 w-auto object-contain md:h-25"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 max-sm:mb-2 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Hair Analysis</span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 max-sm:mb-2 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
         Bonitaa HQ – The Clinic That {" "}
          <span className="bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent">
            Understands Indian Hair Problems 🌟
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 max-sm:mb-4 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
          Providing FDA-approved treatments, with 15+ years of experience and over 10,000 happy clients. Trusted across 22+ clinics in Tamil Nadu!
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 sm:flex-row">
          <Button
            onClick={onStartScan}
            size="lg"
            className="group relative flex items-center gap-3 bg-primary px-8 py-7 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(221,185,90,0.5)]"
          >
            <Scan className="h-5 w-5 transition-transform group-hover:scale-110" />
            Start Scan
            <div className="absolute inset-0 -z-10 animate-pulse rounded-lg bg-primary/30 blur-xl" />
          </Button>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="group flex items-center gap-3 border-primary/40 bg-background/70 px-8 py-7 text-lg font-semibold text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_30px_rgba(221,185,90,0.2)]"
          >
            <Phone className="h-5 w-5 transition-transform group-hover:scale-110" />
            9363707090
          </Button>
        </div>

        {/* Trust indicators
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Privacy First</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>98% Accuracy</span>
          </div>
        </div> */}
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
