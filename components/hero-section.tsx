"use client"

import { Button } from "@/components/ui/button"
import { Scan, Sparkles, Shield, Zap } from "lucide-react"

interface HeroSectionProps {
  onStartScan: () => void
}

export function HeroSection({ onStartScan }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Radial glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

        {/* Floating orbs */}
        <div className="animate-float absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-float-delayed absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Skin Analysis</span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Scan Your Face to Discover Your{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
            Skin Health
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
          Get instant AI-powered analysis in seconds. Our advanced technology detects skin concerns
          and provides personalized treatment recommendations.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onStartScan}
          size="lg"
          className="group relative flex items-center gap-3 bg-primary px-8 py-7 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(0,255,200,0.5)]"
        >
          <Scan className="h-5 w-5 transition-transform group-hover:scale-110" />
          Start Scan
          <div className="absolute inset-0 -z-10 animate-pulse rounded-lg bg-primary/30 blur-xl" />
        </Button>

        {/* Trust indicators */}
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
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
