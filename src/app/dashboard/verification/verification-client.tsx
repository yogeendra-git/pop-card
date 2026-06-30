"use client"

import React, { useState, useRef, useTransition } from "react"
import { VerificationBadge } from "@/components/ui/CustomComponents"
import { Camera, RefreshCw, CheckCircle, VideoOff, ShieldCheck } from "lucide-react"
import { submitIdentityVerificationAction } from "@/lib/actions"
import type { VerificationStatus } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export function VerificationClient({ verification }: { verification: { tenth: VerificationStatus; twelfth: VerificationStatus; identity: VerificationStatus } }) {
  const [streamActive, setStreamActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const initiateCameraAccess = async () => {
    try {
      setPermissionDenied(false)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      mediaStreamRef.current = stream
      setStreamActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera error:", err)
      setPermissionDenied(true)
    }
  }

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        setCapturedImage(canvas.toDataURL("image/jpeg"))
        terminateCamera()
      }
    }
  }

  const terminateCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    setStreamActive(false)
  }

  const submitForVerification = () => {
    startTransition(async () => {
      await submitIdentityVerificationAction()
      setSubmitted(true)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader title="Identity Verification" description="Live camera verification only. Gallery uploads are not accepted." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "10th Marksheet", status: verification.tenth },
          { title: "12th Marksheet", status: verification.twelfth },
          { title: "Identity Document", status: submitted ? "review" : verification.identity },
        ].map((item) => (
          <Card key={item.title} className="flex flex-col justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.title}</span>
            <VerificationBadge status={item.status as VerificationStatus} />
          </Card>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden shadow-md">
        <div className="p-5 border-b border-border bg-muted flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Live Camera Capture</h3>
            <p className="text-xs text-muted-foreground">Hold your document in front of the camera</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary font-mono font-semibold bg-primary/10 px-2.5 py-1 rounded-md">
            <ShieldCheck className="h-3.5 w-3.5" /> SECURE
          </div>
        </div>

        <div className="p-6 flex flex-col items-center justify-center bg-background min-h-[380px]">
          {submitted ? (
            <div className="text-center space-y-3 max-w-xs">
              <div className="h-12 w-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground">Submitted for review</p>
              <p className="text-xs text-muted-foreground">Your identity document is now in the verification queue. This usually takes 1–2 business days.</p>
            </div>
          ) : capturedImage ? (
            <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Captured frame" className="w-full h-full object-cover" />
            </div>
          ) : streamActive ? (
            <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border bg-black relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-[10px] text-white font-mono uppercase bg-black/60 px-2 rounded tracking-widest">LIVE</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-xs">
              <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground mx-auto">
                <VideoOff className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">Camera Inactive</p>
                <p className="text-xs text-muted-foreground mt-1">Click the button below to start live capture.</p>
              </div>
              {permissionDenied && (
                <p className="text-xs text-destructive font-medium bg-destructive/10 px-3 py-1 rounded-md border border-destructive/20">
                  Camera access denied. Please check browser permissions.
                </p>
              )}
            </div>
          )}
        </div>

        {!submitted && (
          <div className="p-4 border-t border-border bg-muted flex justify-end gap-3">
            {capturedImage ? (
              <>
                <Button variant="outline" size="sm" onClick={() => { setCapturedImage(null); initiateCameraAccess() }}>
                  <RefreshCw className="h-3.5 w-3.5" /> Retake
                </Button>
                <Button size="sm" onClick={submitForVerification} loading={isPending}>
                  <CheckCircle className="h-3.5 w-3.5" /> Submit for Verification
                </Button>
              </>
            ) : streamActive ? (
              <>
                <Button variant="outline" size="sm" onClick={terminateCamera}>Cancel</Button>
                <Button size="sm" onClick={captureFrame}>
                  <Camera className="h-3.5 w-3.5" /> Capture Image
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={initiateCameraAccess}>
                <Camera className="h-3.5 w-3.5" /> Open Camera
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
