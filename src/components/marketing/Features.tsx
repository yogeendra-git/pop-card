"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Zap, Globe, ArrowRight, GraduationCap, FileCheck, LayoutGrid, UserCheck, Share2, Eye } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"
import { cn } from "@/lib/utils"

interface FeatureItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: "Identity" | "Academics" | "Sharing" | "Recruiters"
  badge?: string
  colorClass: string
}

const categories = ["All", "Identity", "Academics", "Sharing", "Recruiters"] as const

/**
 * Migrated from popcard-platform `Features.tsx`. Content was adapted from
 * the generic "digital business card" feature set to the verified-student
 * domain this app actually implements (education, certificates,
 * achievements, verification, builder) so the marketing copy matches what's
 * really under `/dashboard`.
 */
const featuresList: FeatureItem[] = [
  {
    id: "feat-1",
    title: "Live Identity Verification",
    description: "Submit a live camera capture to verify your identity — no static document uploads, no gallery spoofing.",
    icon: ShieldCheck,
    category: "Identity",
    badge: "SECURE",
    colorClass: "from-brand-cyan to-primary",
  },
  {
    id: "feat-2",
    title: "Verified Academic Record",
    description: "University, degree, CGPA, and board percentages — structured for instant recruiter screening.",
    icon: GraduationCap,
    category: "Academics",
    colorClass: "from-primary to-brand-violet",
  },
  {
    id: "feat-3",
    title: "Course Certificates Hub",
    description: "Centralize every certification with organization, date, and verification status in one credential wall.",
    icon: FileCheck,
    category: "Academics",
    badge: "POPULAR",
    colorClass: "from-brand-violet to-primary",
  },
  {
    id: "feat-4",
    title: "Achievement Showcase",
    description: "Hackathon wins, competition placements, and awards displayed on a clean, recruiter-friendly timeline.",
    icon: LayoutGrid,
    category: "Academics",
    colorClass: "from-brand-emerald to-brand-cyan",
  },
  {
    id: "feat-5",
    title: "One Shareable Link & QR",
    description: "Your entire profile lives at one URL with a scannable QR code — replace your résumé attachment for good.",
    icon: Share2,
    category: "Sharing",
    colorClass: "from-brand-cyan to-brand-emerald",
  },
  {
    id: "feat-6",
    title: "Recruiter Interview Mode",
    description: "A zero-clutter, fast-evaluation view of your profile built specifically for recruiter screening calls.",
    icon: UserCheck,
    category: "Recruiters",
    badge: "NEW",
    colorClass: "from-brand-violet to-brand-cyan",
  },
]

export function Features() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All")
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  const filteredFeatures =
    selectedCategory === "All" ? featuresList : featuresList.filter((item) => item.category === selectedCategory)

  return (
    <Section id="features" tint>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <SectionHeading
        eyebrow="Engineered for Trust"
        title="A Verified Identity Hub, Built for Recruiter Confidence"
        description="Replace static résumés with a dynamic, recruiter-ready profile that verifies academics, surfaces achievements, and tracks engagement."
      />

      {/* Category filter pills */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/60 border border-border backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors",
                selectedCategory === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {selectedCategory === cat && (
                <motion.div
                  layoutId="featuresCategoryIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((item, idx) => {
            const isHovered = hoveredCardId === item.id
            const Icon = item.icon
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={item.id}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={cn(
                  "relative p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md glass-card",
                  isHovered ? "border-primary/30 shadow-elevated -translate-y-2 scale-[1.01]" : "shadow-sm"
                )}
              >
                {isHovered && (
                  <div className={cn("absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r", item.colorClass)} />
                )}

                {item.badge && (
                  <span className="absolute top-6 right-6 px-2.5 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                )}

                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-tr text-white shadow-md", item.colorClass)}>
                  <Icon className={cn("w-6 h-6 transition-transform duration-300", isHovered && "scale-110 rotate-3")} />
                </div>

                <h3 className="text-xl font-bold font-display text-foreground tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{item.description}</p>

                <div className="flex items-center gap-2 mt-4">
                  <span className={cn("text-xs font-bold transition-all", isHovered ? "text-primary translate-x-1" : "text-muted-foreground")}>
                    Explore capabilities
                  </span>
                  <ArrowRight className={cn("w-3.5 h-3.5 transition-all", isHovered ? "text-primary translate-x-1.5" : "text-muted-foreground")} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground font-semibold font-mono tracking-wider">
        <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-success" /> LIVE-CAMERA VERIFICATION</span>
        <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-warning" /> SECURE SSL ENCRYPTION</span>
        <span className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> GDPR & PRIVACY COMPLIANCE</span>
        <span className="flex items-center gap-2"><Eye className="w-5 h-5 text-brand-violet" /> RECRUITER-READY VIEWS</span>
      </div>
    </Section>
  )
}
