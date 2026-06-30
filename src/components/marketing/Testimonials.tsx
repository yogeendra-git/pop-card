"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  initials: string
  quote: string
  rating: number
  tags: string[]
}

/**
 * Migrated from popcard-platform `Testimonials.tsx`. Avatars were swapped
 * from hotlinked Unsplash photo URLs to gradient initials chips (consistent
 * with how every other identity avatar in the real product renders —
 * `profile-client.tsx`, `public-card-client.tsx` — when no photo is set).
 * The video-review trigger was dropped (no demo modal in the product app);
 * everything else — carousel, expandable quote, autoplay-on-hover-pause —
 * is preserved.
 */
const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Krishnan",
    role: "Placement Coordinator",
    company: "VTU State University",
    initials: "AK",
    quote:
      "Before POP Card, our placement cell processed resumes by hand for 4,000+ final-year students every season. Now recruiters get one verified link with academics, certificates, and achievements pre-validated — screening time dropped by more than half.",
    rating: 5,
    tags: ["Placement Cell", "Verification"],
  },
  {
    id: "t2",
    name: "Rohit Bhatia",
    role: "Campus Recruiter",
    company: "Meridian Technologies",
    initials: "RB",
    quote:
      "I used to dig through PDFs and LinkedIn tabs for every candidate. A POP Card link gives me verified CGPA, certificates, and a clean achievement timeline in one scroll. Our first-round shortlisting got noticeably faster this hiring cycle.",
    rating: 5,
    tags: ["Recruiter Mode", "Faster Screening"],
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Pre-Final Year, CSE",
    company: "B.M.S. College of Engineering",
    initials: "PN",
    quote:
      "My certificates, hackathon wins, and academic record finally live in one place that actually looks professional. I share one link instead of five attachments, and I can see exactly when a recruiter opens it.",
    rating: 5,
    tags: ["Student Profile", "One Shareable Link"],
  },
]

export function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length)
      setExpanded(false)
    }, 6500)
    return () => clearInterval(timer)
  }, [isHovered])

  const active = testimonials[activeIdx]

  const goTo = (idx: number) => {
    setActiveIdx(idx)
    setExpanded(false)
  }

  return (
    <Section tint>
      <SectionHeading
        eyebrow="Trusted across campuses"
        title="Endorsed by Students &amp; Recruiters Alike"
        description="See how placement cells, recruiters, and students use a single verified profile to move faster on both sides of the hiring table."
      />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative max-w-4xl mx-auto"
      >
        <div className="relative min-h-[340px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full p-8 md:p-12 rounded-3xl glass-card shadow-elevated text-left relative flex flex-col justify-between"
            >
              <Quote className="absolute top-8 right-12 w-28 h-28 text-foreground opacity-[0.04] pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-500" />
                  ))}
                  <span className="text-[10px] font-bold font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded ml-2">
                    VERIFIED USER
                  </span>
                </div>

                <div className="relative">
                  <p className={cn("text-base md:text-lg text-foreground font-medium leading-relaxed", !expanded && "line-clamp-4")}>
                    &ldquo;{active.quote}&rdquo;
                  </p>
                  {active.quote.length > 200 && (
                    <button
                      onClick={() => setExpanded((e) => !e)}
                      className="text-xs font-mono font-bold text-primary hover:underline mt-2 block"
                    >
                      {expanded ? "Read less" : "Read full review"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-primary/5 border border-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border gap-6 mt-8 pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-black text-lg flex items-center justify-center flex-shrink-0">
                    {active.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-foreground font-display tracking-tight">{active.name}</h4>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {active.role} at <span className="text-foreground font-bold">{active.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8 max-w-sm mx-auto">
          <button
            onClick={() => goTo((activeIdx - 1 + testimonials.length) % testimonials.length)}
            className="p-2.5 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-90"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => goTo(idx)}
                aria-label={`Show testimonial ${idx + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  activeIdx === idx ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => goTo((activeIdx + 1) % testimonials.length)}
            className="p-2.5 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-90"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Section>
  )
}
