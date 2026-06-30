"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Flame, Heart, ArrowUpRight, Sparkles } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"
import { cn } from "@/lib/utils"

interface TemplateItem {
  id: string
  name: string
  category: "Tech" | "Creative" | "Executive" | "Minimalist"
  trending: boolean
  favCount: number
  description: string
  gradient: string
  font: "sans" | "display" | "mono"
}

const categories = ["All", "Tech", "Creative", "Executive", "Minimalist"] as const

/**
 * Migrated from popcard-platform `TemplatesShowcase.tsx`. The original's
 * "Quick View" modal with a fully live-editable mock card was simplified to
 * a hover-reveal preview + direct CTA — the real customization surface this
 * product ships is the POP Card Builder's theme picker
 * (`/dashboard/builder`), so every "Use This Template" action routes there
 * via registration rather than duplicating a second, disconnected editor.
 */
const templates: TemplateItem[] = [
  {
    id: "tmp-1",
    name: "Premium Slate",
    category: "Tech",
    trending: true,
    favCount: 1540,
    description: "Indigo-violet gradient with a structured, engineering-forward layout.",
    gradient: "from-primary via-foreground to-secondary",
    font: "mono",
  },
  {
    id: "tmp-2",
    name: "Mint Verified",
    category: "Minimalist",
    trending: true,
    favCount: 2310,
    description: "Emerald-to-info gradient that foregrounds verification badges.",
    gradient: "from-success via-foreground to-info",
    font: "display",
  },
  {
    id: "tmp-3",
    name: "Monochrome",
    category: "Executive",
    trending: false,
    favCount: 940,
    description: "Greyscale, distraction-free layout for senior / executive profiles.",
    gradient: "from-foreground via-muted-foreground to-foreground",
    font: "sans",
  },
  {
    id: "tmp-4",
    name: "Bento Portfolio",
    category: "Creative",
    trending: true,
    favCount: 1120,
    description: "Modular bento-grid sections to surface project & design work.",
    gradient: "from-brand-cyan via-foreground to-brand-violet",
    font: "display",
  },
  {
    id: "tmp-5",
    name: "Retro Console",
    category: "Tech",
    trending: false,
    favCount: 520,
    description: "Monospace, terminal-inspired theme for developer profiles.",
    gradient: "from-warning via-foreground to-warning",
    font: "mono",
  },
  {
    id: "tmp-6",
    name: "Creative Canvas",
    category: "Creative",
    trending: false,
    favCount: 810,
    description: "Soft gradients and rounded cards tuned for design portfolios.",
    gradient: "from-destructive via-foreground to-brand-violet",
    font: "sans",
  },
]

export function TemplatesShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCat, setSelectedCat] = useState<(typeof categories)[number]>("All")
  const [favorites, setFavorites] = useState<string[]>([])

  const filtered = templates.filter((t) => {
    const matchesCat = selectedCat === "All" || t.category === selectedCat
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <Section id="templates">
      <SectionHeading
        eyebrow="Templates Showcase"
        title="Themes Tuned for Every Profile Style"
        description="Pick a starting theme inside the POP Card Builder, then fine-tune section visibility, accent colors, and layout to match your personal brand."
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/60 border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                "relative px-4 py-2 rounded-full text-xs font-semibold transition-colors",
                selectedCat === cat ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2.5 bg-card text-sm rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
          />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((tpl) => {
            const isFav = favorites.includes(tpl.id)
            return (
              <motion.div
                layout
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient preview swatch */}
                <div className={cn("relative h-40 bg-gradient-to-br p-4 flex flex-col justify-between", tpl.gradient)}>
                  <div className="flex justify-between items-start">
                    {tpl.trending && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase bg-background/20 text-white backdrop-blur-sm">
                        <Flame className="w-3 h-3" /> Trending
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFavorites((prev) => (isFav ? prev.filter((id) => id !== tpl.id) : [...prev, tpl.id]))
                      }}
                      className="ml-auto p-1.5 rounded-full bg-background/20 backdrop-blur-sm text-white hover:scale-110 transition-transform"
                    >
                      <Heart className={cn("w-3.5 h-3.5", isFav && "fill-white")} />
                    </button>
                  </div>
                  <div className={cn("text-white/90 text-sm font-bold", tpl.font === "mono" && "font-mono", tpl.font === "display" && "font-display")}>
                    Aa — Sample Card Preview
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold font-display text-foreground tracking-tight">{tpl.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">{tpl.favCount.toLocaleString()} saves</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tpl.description}</p>
                  <Link
                    href="/auth/register"
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-colors"
                  >
                    Use This Template <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm flex flex-col items-center gap-2">
          <Sparkles className="w-6 h-6 opacity-40" />
          No templates match &ldquo;{searchTerm}&rdquo;.
        </div>
      )}
    </Section>
  )
}
