"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface CameraModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (imageData: string) => void
}

export function CameraModal({ open, onOpenChange, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsStreaming(true)
        }
      }
    } catch {
      setError("Unable to access camera. Please allow camera permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [open, startCamera, stopCamera])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        stopCamera()
        onCapture(imageData)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-primary/20 bg-card/95 p-0 backdrop-blur-xl sm:max-w-lg"
      >
        <div className="relative flex flex-col items-center p-6">
          <DialogTitle className="mb-4 text-xl font-bold text-foreground">Position Your Hair</DialogTitle>
          <DialogDescription className="mb-4 text-center text-sm text-muted-foreground">
            Align your hair within the circle for optimal scanning
          </DialogDescription>

          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-background">
            {error ? (
              <div className="flex h-full items-center justify-center p-4 text-center text-destructive">
                {error}
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />

                {/* Face frame overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-64 w-64 rounded-full border-4 border-primary/60 shadow-[0_0_30px_rgba(221,185,90,0.3),inset_0_0_30px_rgba(221,185,90,0.1)]">
                    {/* Corner markers */}
                    <div className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-primary rounded-tl-full" />
                    <div className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-primary rounded-tr-full" />
                    <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-full" />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-full" />
                  </div>
                </div>

                {/* Scanning line animation */}
                {isStreaming && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
                    <div className="animate-scan absolute left-1/2 h-1 w-64 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 shadow-[0_0_20px_rgba(221,185,90,0.8)]" />
                  </div>
                )}
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <Button
            onClick={handleCapture}
            disabled={!isStreaming}
            className="mt-6 flex items-center gap-2 bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(221,185,90,0.5)] disabled:opacity-50"
          >
            <Camera className="h-5 w-5" />
            Capture
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
