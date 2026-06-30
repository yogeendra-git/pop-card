"use client"

import Link from "next/link"
import { Award, ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { Container } from "@/components/ui/Section"

/**
 * Migrated from popcard-platform `CTA.tsx`. The live countdown-timer
 * "urgency banner" (a fake `Free Pro Access ends in 44m:59s` ticker that
 * looped forever) was deliberately dropped — it's a dishonest pressure
 * pattern, not a real limited-time offer, so it doesn't belong in the real
 * product. The gradient panel, grid texture, and trust badges are kept.
 */
export function CTA() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden bg-background">
      <Container className="relative z-10">
        <div className="relative rounded-[40px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-foreground opacity-95" />
          <div className="absolute inset-0 bg-grid-glow opacity-10" />

          <div className="relative z-10 px-6 py-16 md:py-20 text-center flex flex-col items-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold font-mono tracking-wider mb-8 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Free for students &amp; placement cells
            </div>

            <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight text-white tracking-tight mb-6 text-balance">
              Build Your Verified Identity in Minutes
            </h2>

            <p className="text-sm md:text-base text-white/80 leading-relaxed mb-10 max-w-xl">
              Join students and placement cells already using one verified, recruiter-ready profile instead of scattered PDFs and screenshots.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary hover:bg-white/90 py-4 px-8 rounded-full font-bold text-sm shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#templates"
                className="w-full sm:w-auto block py-4 px-8 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
              >
                Explore Templates
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-8 text-[11px] text-white/60 font-mono tracking-wider font-semibold uppercase">
              <span className="flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-amber-300" /> Trusted by 40+ Colleges
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-300" /> Institution-Verified Records
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4.5 h-4.5 text-yellow-300" /> Setup in Under 5 Minutes
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
