"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, Eye, Flame, Sparkles, TrendingUp, Zap } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { cn } from "@/lib/utils"

interface RankedProfile {
  id: string
  name: string
  role: string
  initials: string
  views: number
  growth: string
  rank: number
  tags: string[]
  verified: boolean
  completion: number
}

/**
 * Migrated from popcard-platform `CommunitySection.tsx`. The original
 * "Creator Leaderboard / Follow" concept (social-network style follower
 * counts) doesn't map to a single-tenant student-verification product, so
 * this was re-purposed as a campus leaderboard ranked by recruiter profile
 * views — same dual-column layout (ranked list + hover preview canvas),
 * same interaction model, content adapted to the real domain.
 */
const profiles: RankedProfile[] = [
  { id: "p1", name: "Ishaan Kapoor", role: "Full Stack Developer", initials: "IK", views: 1284, growth: "+18.4%", rank: 1, tags: ["React", "Node.js"], verified: true, completion: 98 },
  { id: "p2", name: "Meera Subramaniam", role: "ML Engineer", initials: "MS", views: 1042, growth: "+24.1%", rank: 2, tags: ["PyTorch", "NLP"], verified: true, completion: 95 },
  { id: "p3", name: "Devansh Rao", role: "Cloud & DevOps", initials: "DR", views: 891, growth: "+9.6%", rank: 3, tags: ["AWS", "Kubernetes"], verified: true, completion: 92 },
  { id: "p4", name: "Tara Iyer", role: "Product Designer", initials: "TI", views: 763, growth: "+13.2%", rank: 4, tags: ["Figma", "UX Research"], verified: true, completion: 90 },
]

export function CommunitySection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <Section id="community" className="border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="text-left max-w-xl">
          <span className="text-xs font-bold text-primary font-mono tracking-widest uppercase mb-3 block">
            Campus Leaderboard
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground mb-4 text-balance">
            Most-Viewed Verified Profiles This Month
          </h2>
          <p className="text-sm text-muted-foreground">
            Recruiters scan and shortlist directly off the leaderboard. Complete your verification and POP Card builder to climb the ranking.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 px-5 py-3 rounded-2xl self-start md:self-auto text-left">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block font-mono">Live This Week</span>
            <span className="text-sm font-extrabold text-foreground">240+ recruiters browsing</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Leaderboard list */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-border bg-card text-left flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display text-foreground">Trending Verified Students</h3>
              <p className="text-xs text-muted-foreground">Ranked by verified weekly recruiter views</p>
            </div>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3.5 flex-grow">
            {profiles.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300",
                  hoveredId === p.id ? "bg-muted border-border" : "bg-transparent border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "w-6 text-center font-mono font-bold text-sm",
                      p.rank === 1 ? "text-amber-500 text-lg" : p.rank === 2 ? "text-muted-foreground" : p.rank === 3 ? "text-amber-700" : "text-muted-foreground/70"
                    )}
                  >
                    #{p.rank}
                  </span>

                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-bold text-sm flex items-center justify-center">
                      {p.initials}
                    </div>
                    {p.verified && <CheckCircle className="absolute -bottom-1 -right-1 w-4.5 h-4.5 fill-card text-success" />}
                  </div>

                  <div className="leading-tight">
                    <h4 className="font-extrabold text-sm text-foreground">{p.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{p.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <span className="block font-bold text-xs text-foreground font-mono">{p.views.toLocaleString()} views</span>
                    <span className="text-[10px] text-success font-bold font-mono flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3" /> {p.growth}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hover preview panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="p-6 rounded-3xl border border-border bg-card text-left h-full flex flex-col justify-between relative overflow-hidden shadow-subtle">
            <GradientBackground variant="grid" className="opacity-50" />

            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-full inline-block">
                Live Profile Inspect
              </span>
              <h3 className="text-xl font-bold font-display tracking-tight text-foreground leading-tight">
                Hover a profile to preview their POP Card
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recruiters get this same instant preview before opening the full verified profile.
              </p>
            </div>

            <div className="my-8 flex justify-center relative z-10">
              <AnimatePresence mode="wait">
                {hoveredId ? (
                  (() => {
                    const matched = profiles.find((p) => p.id === hoveredId)!
                    return (
                      <motion.div
                        key={matched.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-[280px] bg-foreground text-background rounded-3xl p-5 text-left shadow-2xl relative overflow-hidden"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[8px] font-mono text-background/60 tracking-wider">
                            popcard.app/{matched.name.toLowerCase().replace(/ /g, "-")}
                          </span>
                          <Eye className="w-3.5 h-3.5 text-background/50" />
                        </div>

                        <div className="flex items-center gap-3.5 mb-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-sm text-white">
                            {matched.initials}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm tracking-tight font-display flex items-center gap-1">
                              {matched.name}
                              {matched.verified && <CheckCircle className="w-3.5 h-3.5 text-success" />}
                            </h4>
                            <p className="text-[10px] text-background/60">{matched.role}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {matched.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-mono bg-background/10 font-semibold text-background/90 px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-background/10 pt-3 text-[9px] font-mono text-background/50">
                          <span>Profile completion: {matched.completion}%</span>
                          <span className="text-primary-foreground font-bold">{matched.views.toLocaleString()} views</span>
                        </div>
                      </motion.div>
                    )
                  })()
                ) : (
                  <div className="w-full max-w-[280px] p-6 py-10 rounded-3xl border border-dashed border-border text-center flex flex-col items-center justify-center text-muted-foreground text-xs">
                    <Zap className="w-8 h-8 opacity-40 mb-3" />
                    <span>Hover any profile on the leaderboard to inspect a live preview</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-xs font-mono select-none relative z-10">
              <CheckCircle className="w-4 h-4 text-success" /> Identity &amp; academics verified by issuing institutions
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
