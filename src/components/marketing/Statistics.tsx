"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Users, Eye, Sparkles, QrCode, Star, ShieldCheck } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"

/**
 * Migrated from popcard-platform `Statistics.tsx`. The original simulated
 * counters with `setInterval` + a toast firing on completion; the toast call
 * is gone (no global toast system in the product app) but the
 * IntersectionObserver count-up animation is preserved as-is.
 */
export function Statistics() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [cardsCreated, setCardsCreated] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [profileViews, setProfileViews] = useState(0)
  const [engagementRate, setEngagementRate] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true)
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return
    const duration = 2000
    const steps = 50
    const stepDuration = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const ratio = currentStep / steps
      setCardsCreated(Math.floor(ratio * 2.8 * 10) / 10)
      setActiveUsers(Math.floor(ratio * 142))
      setProfileViews(Math.floor(ratio * 18.5 * 10) / 10)
      setEngagementRate(Math.floor(ratio * 39.4 * 10) / 10)

      if (currentStep >= steps) {
        clearInterval(timer)
        setCardsCreated(2.8)
        setActiveUsers(142)
        setProfileViews(18.5)
        setEngagementRate(39.4)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [hasAnimated])

  const widgets = [
    { label: "PROFILES CREATED", value: `${cardsCreated}K+`, desc: "Verified student profiles launched.", icon: QrCode, accent: "text-primary bg-primary/10" },
    { label: "DAILY ACTIVE USERS", value: `${activeUsers}k+`, desc: "Students actively maintaining credentials.", icon: Users, accent: "text-brand-cyan bg-brand-cyan/10" },
    { label: "RECRUITER SESSIONS", value: `${profileViews}M+`, desc: "Profile views tracked across recruiters.", icon: Eye, accent: "text-brand-violet bg-brand-violet/10" },
  ]

  return (
    <Section id="statistics">
      <div ref={containerRef}>
        <SectionHeading
          eyebrow="Trust & Deployment Metrics"
          title="Verified Across Universities and Recruiters"
          description="Static résumés go unread for days. POP Card profiles deliver continuous, tracked recruiter engagement from the first scan."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 items-stretch">
          {widgets.map((w) => (
            <div key={w.label} className="p-8 rounded-3xl border border-border bg-surface text-center flex flex-col justify-between items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${w.accent}`}>
                <w.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground font-mono tracking-wider uppercase block mb-1">{w.label}</span>
                <div className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-2">{w.value}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{w.desc}</p>
            </div>
          ))}

          {/* Circular engagement metric */}
          <div className="p-8 rounded-3xl border border-border bg-surface text-center flex flex-col justify-between items-center">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="hsl(var(--border))" strokeWidth="6" />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="transparent"
                  stroke="hsl(var(--success))"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - engagementRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-success">
                {engagementRate}%
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground font-mono tracking-wider uppercase block mb-1">Conversion Quotient</span>
              <div className="text-3xl font-extrabold font-display text-foreground mb-1">Engagement</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">Recruiter callback rate per profile share.</p>
          </div>
        </div>

        <div className="pt-12 border-t border-border">
          <div className="text-xs font-bold text-muted-foreground tracking-wider font-mono uppercase text-center mb-8">
            Industry Achievements &amp; Endorsements
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Leaderboard Gold Standard", sub: "Awarded #1 Student Identity Platform 2026", icon: <Star className="w-5 h-5 text-warning" /> },
              { title: "High-Trust Verification", sub: "Live-capture identity & academic record checks", icon: <ShieldCheck className="w-5 h-5 text-success" /> },
              { title: "Hyper-Growth Platform", sub: "Expanding rapidly across engineering colleges", icon: <Sparkles className="w-5 h-5 text-brand-violet" /> },
            ].map((ach) => (
              <div key={ach.title} className="p-6 rounded-2xl border border-border bg-card flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-muted flex-shrink-0">{ach.icon}</div>
                <div className="text-left leading-snug">
                  <h4 className="text-sm font-bold text-foreground font-display mb-1">{ach.title}</h4>
                  <p className="text-muted-foreground text-xs">{ach.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
