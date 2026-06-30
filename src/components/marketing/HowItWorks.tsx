"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit3, Sparkles, Share2, LineChart, QrCode } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 0,
    title: "Build Your Verified Profile",
    desc: "Enter your name, headline, bio, academics, and skills in one unified profile editor.",
    icon: Edit3,
  },
  {
    id: 1,
    title: "Verify Your Identity & Records",
    desc: "Submit a live camera capture and academic records for verification — no static uploads.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Customize & Publish Your Card",
    desc: "Pick a theme, choose which sections are public, and publish your shareable POP Card link.",
    icon: Share2,
  },
  {
    id: 3,
    title: "Track Recruiter Engagement",
    desc: "See profile views, QR scans, and link clicks roll in on your live analytics dashboard.",
    icon: LineChart,
  },
]

/**
 * Migrated from popcard-platform `HowItWorks.tsx`. Step copy now describes
 * the real flow this product implements (profile → verification → builder
 * → dashboard) instead of the original's generic wallet-pass/CRM copy.
 */
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % steps.length), 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="Interactive Walkthrough"
        title="Create Your Professional Identity, Step by Step"
        description="From first edit to recruiter-ready link — here's exactly how POP Card takes you from blank profile to verified digital identity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Vertical timeline navigation */}
        <div className="lg:col-span-6 relative text-left">
          <div className="absolute left-[26px] top-6 bottom-6 w-[2px] bg-border">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-brand-cyan rounded-full"
              animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="space-y-4 relative">
            {steps.map((st, idx) => {
              const isActive = activeStep === idx
              const Icon = st.icon
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "flex items-start gap-6 p-5 cursor-pointer rounded-2xl border transition-all duration-300",
                    isActive ? "bg-card border-primary/20 shadow-card translate-x-2" : "bg-transparent border-transparent hover:bg-muted/40"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border font-bold font-mono text-sm transition-all flex-shrink-0",
                      isActive ? "bg-background border-primary text-primary scale-105" : "bg-muted border-border text-muted-foreground"
                    )}
                  >
                    {isActive ? <Icon className="w-5 h-5" /> : `0${st.id + 1}`}
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className={cn("text-base font-extrabold font-display tracking-tight transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {st.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">{st.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Morphing illustration */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[400px] h-[360px] rounded-3xl p-6 border border-border bg-surface relative overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-[280px] bg-card border border-border p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-mono text-muted-foreground font-bold uppercase tracking-widest">PROFILE EDITOR ACTIVE</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <div className="h-1.5 w-12 bg-muted rounded" />
                      <div className="h-7 w-full bg-background border border-border rounded-lg flex items-center px-2 text-[10px] font-mono text-muted-foreground">Arjun Mehta</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-16 bg-muted rounded" />
                      <div className="h-7 w-full bg-background border border-border rounded-lg flex items-center px-2 text-[10px] font-mono text-muted-foreground">Full Stack Developer</div>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <span className="text-[9px] font-mono text-primary text-center uppercase tracking-wider">Fields saved automatically</span>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-[280px] bg-card border border-border p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold text-muted-foreground tracking-wider">
                    <span>LIVE VERIFICATION</span>
                    <span>SECURE</span>
                  </div>
                  <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-center flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-sm text-primary font-display">Identity Capture</h5>
                      <p className="text-[10px] text-muted-foreground">Live camera frame submitted for review</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-[8.5px] font-mono text-success uppercase">10th &amp; 12th records</span>
                    <span className="text-[8.5px] font-mono font-bold text-success">VERIFIED</span>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-[280px] bg-card border border-border p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center">
                  <span className="text-[8px] font-bold font-mono tracking-widest text-muted-foreground uppercase">Generate Scannable Card</span>
                  <div className="p-3 bg-background border border-border rounded-xl relative shadow-lg">
                    <QrCode className="w-20 h-20 text-foreground" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground tracking-tight">popcard.app/arjun-mehta</h5>
                    <p className="text-[9.5px] text-muted-foreground mt-0.5">Ready to share with recruiters.</p>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-[280px] bg-card border border-border p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center text-[7.5px] font-mono font-bold tracking-wider text-muted-foreground">
                    <span>ENGAGEMENT REPORT</span>
                    <span className="text-success">● LIVE</span>
                  </div>
                  <div className="space-y-1 bg-background p-3 rounded-lg border border-border">
                    <div className="text-[10px] text-muted-foreground">Total Recruiter Views</div>
                    <div className="text-lg font-mono font-bold text-foreground">4,918 (+12%)</div>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[82%] bg-success" />
                    </div>
                  </div>
                  <div className="flex justify-between items-end h-[60px] px-2 pt-2 border-t border-border">
                    {[15, 30, 20, 50, 40, 25, 45].map((h, i) => (
                      <div key={i} className="w-4 bg-primary/70 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
