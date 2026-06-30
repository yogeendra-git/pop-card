"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2, QrCode, Mail, Link as LinkIcon, Phone, Award, Heart } from "lucide-react"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { FloatingElement } from "@/components/ui/AnimatedWrapper"

/**
 * Migrated from popcard-platform `Hero.tsx`. Session-aware personalization
 * (logged-in student's real name/avatar in the preview card) was dropped —
 * there's no auth session to read here — but the typing animation, 3D tilt
 * preview card, glow-mesh background, and floating badges are preserved.
 * The username claim field now performs a real navigation into
 * `/auth/register` instead of a fake toast.
 */
export function Hero() {
  const words = ["Creators", "Developers", "Designers", "Leaders", "Students"]
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const currentWord = words[currentWordIdx]

    if (isDeleting) {
      timer = setTimeout(() => setTypedText((prev) => prev.slice(0, -1)), 50)
    } else {
      timer = setTimeout(() => setTypedText(currentWord.slice(0, typedText.length + 1)), 100)
    }

    if (!isDeleting && typedText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500)
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setCurrentWordIdx((prev) => (prev + 1) % words.length)
    }

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedText, isDeleting, currentWordIdx])

  const containerRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [claimInput, setClaimInput] = useState("")

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5
    setRotateX(-relativeY * 20)
    setRotateY(relativeX * 20)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center justify-center">
      <GradientBackground variant="both" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left: Headline + Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            The Future of Physical Cards is Dead
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold font-display leading-[1.1] text-foreground tracking-tight mb-6">
            Create Digital Identity <br className="hidden sm:inline" />
            Designed for{" "}
            <span className="relative inline-block text-gradient-brand">
              {typedText}
              <span className="absolute -right-1.5 top-0 bottom-1 w-1 bg-primary animate-pulse" />
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl font-normal leading-relaxed mb-8">
            POP Card bridges offline meetings and online analytics. Verified academic records, custom profile
            layouts, frictionless QR interactions, and recruiter-ready credentials — all from a single card.
          </p>

          {/* Username claim panel */}
          <form
            action="/auth/register"
            className="w-full max-w-md p-2 rounded-2xl border border-border bg-card/70 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8 shadow-lg"
          >
            <div className="flex-grow pl-3 flex items-center gap-1">
              <span className="text-muted-foreground text-sm font-medium">popcard.app/</span>
              <input
                type="text"
                name="username"
                placeholder="yourname"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="bg-transparent text-sm font-semibold text-foreground focus:outline-none flex-grow min-w-0 py-2"
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl shadow-glow hover:brightness-110 transition-all"
            >
              Claim Card <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> No credit card required</span>
            <span className="hidden sm:flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Setup in 2 minutes</span>
          </div>
        </div>

        {/* Right: 3D tilt preview card */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-sm [perspective:1200px]"
          >
            <motion.div
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase">Digital Card Preview</span>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-success">
                  <CheckCircle2 className="w-3 h-3" /> Identity Verified
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 text-left">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-black text-xl border border-border">
                    AM
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-card" />
                </div>
                <div className="min-w-0 flex-grow text-left">
                  <h4 className="font-extrabold text-lg text-foreground tracking-tight leading-tight truncate">Arjun Mehta</h4>
                  <div className="text-[11px] text-muted-foreground font-semibold leading-normal mt-0.5">
                    Full Stack Developer <br /> <span className="font-bold text-foreground/70">B.M.S. College of Engineering</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="p-2 rounded-xl bg-muted text-center flex flex-col items-center">
                  <Mail className="w-4 h-4 mb-1 text-primary" />
                  <span className="text-[9px] font-bold text-muted-foreground font-mono">EMAIL</span>
                </div>
                <div className="p-2 rounded-xl bg-muted text-center flex flex-col items-center">
                  <LinkIcon className="w-4 h-4 mb-1 text-primary" />
                  <span className="text-[9px] font-bold text-muted-foreground font-mono">WEBSITE</span>
                </div>
                <div className="p-2 rounded-xl bg-muted text-center flex flex-col items-center">
                  <Phone className="w-4 h-4 mb-1 text-primary" />
                  <span className="text-[9px] font-bold text-muted-foreground font-mono">PHONE</span>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-between border-t border-border pt-5">
                <div className="flex flex-col gap-0.5 text-left">
                  <div className="text-[10px] text-muted-foreground font-medium">SCAN DYNAMIC CARD</div>
                  <div className="text-[10px] font-mono text-primary tracking-wider">popcard.app/arjun-mehta</div>
                </div>
                <div className="p-1 rounded-xl bg-muted border border-border">
                  <QrCode className="w-10 h-10 text-foreground" />
                </div>
              </div>
            </motion.div>

            <FloatingElement
              duration={5}
              distance={8}
              className="absolute -right-6 sm:-right-10 top-10 flex items-center gap-3 p-3 rounded-2xl glass-card shadow-lg z-20"
            >
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-extrabold text-foreground">Verified Creator</p>
                <p className="text-muted-foreground">Awarded badge</p>
              </div>
            </FloatingElement>

            <FloatingElement
              duration={6}
              distance={8}
              delay={1}
              className="absolute -left-6 sm:-left-10 bottom-6 flex items-center gap-3 p-3 rounded-2xl glass-card shadow-lg z-20"
            >
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <Heart className="w-4 h-4 fill-destructive" />
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-extrabold text-foreground">982 Favorites</p>
                <p className="text-muted-foreground">Popular this week</p>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50">
        <span className="text-[10px] font-mono tracking-widest font-bold text-muted-foreground">SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-4 h-7 rounded-full border border-muted-foreground flex justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground" />
        </motion.div>
      </div>
    </section>
  )
}
