"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, QrCode, MousePointer, TrendingUp, Sparkles, Download } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui/Section"
import { cn } from "@/lib/utils"

const chartData = {
  week: { points: "10,130 50,90 90,110 130,50 170,120 210,40 250,70", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  month: { points: "10,110 50,120 90,80 130,105 170,60 210,75 250,30", days: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"] },
}

const widgets = [
  { id: "views", label: "Profile Views", value: "12,480", growth: "+14.2%", isUp: true, icon: BarChart3 },
  { id: "scans", label: "QR Scans", value: "4,918", growth: "+28.9%", isUp: true, icon: QrCode },
  { id: "clicks", label: "Link Clicks", value: "2,145", growth: "+8.1%", isUp: true, icon: MousePointer },
  { id: "rate", label: "Engagement Rate", value: "39.4%", growth: "-1.4%", isUp: false, icon: TrendingUp },
]

/**
 * Migrated from popcard-platform `DashboardPreview.tsx`. The original
 * simulated live-incrementing metrics via `setInterval(Math.random...)` and
 * fired toasts when a chart node was clicked — both removed as misleading
 * for a marketing illustration of a real, working dashboard
 * (`/dashboard`, see DashboardCard/StatsCard primitives). The animated SVG
 * line chart, metric grid, and connection-log panel are preserved.
 */
export function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<"week" | "month">("week")

  return (
    <Section tint className="border-y border-border">
      <SectionHeading
        eyebrow="SaaS Analytics Console"
        title="A Live Control Room for Your Career"
        description="Every dashboard page shown here ships in the real product — see when recruiters view your profile, which links convert, and how your verification status trends."
      />

      <div className="w-full rounded-3xl border border-border bg-card shadow-card overflow-hidden p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-6 mb-8 gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                My Analytics Hub
                <span className="text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> LIVE
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Card ID: pop-72a39-arjun.mehta</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-1 rounded-xl bg-muted border border-border">
              {(["week", "month"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize",
                    activeTab === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="bg-foreground text-background hover:opacity-90 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {widgets.map((w) => (
            <div key={w.id} className="p-5 rounded-2xl border border-border bg-surface text-left flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{w.label}</span>
                <w.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-foreground font-display">{w.value}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border",
                    w.isUp ? "bg-success/10 text-success border-success/15" : "bg-destructive/10 text-destructive border-destructive/15"
                  )}
                >
                  {w.isUp ? "↑" : "↓"} {w.growth}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Chart */}
          <div className="p-6 rounded-2xl border border-border bg-surface text-left lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-sm font-bold text-foreground font-display">Recruiter Visual Clicks Overview</h4>
                <p className="text-[11px] text-muted-foreground">Tracking incoming portfolio sessions</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                REAL-TIME UPDATING
              </div>
            </div>

            <div className="relative aspect-[16/7] md:aspect-[21/8] bg-background/40 border border-border rounded-xl overflow-hidden p-4 flex flex-col justify-between">
              <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-px h-full bg-muted-foreground" />
                ))}
              </div>

              <div className="relative flex-grow flex items-end">
                <svg viewBox="0 0 260 140" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    key={`fill-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    d={`M ${chartData[activeTab].points} L 250,140 L 10,140 Z`}
                    fill="url(#chartGradient)"
                  />
                  <motion.path
                    key={`line-${activeTab}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    d={`M ${chartData[activeTab].points}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {chartData[activeTab].points.split(" ").map((pt, idx) => {
                    const [x, y] = pt.split(",").map(Number)
                    return <circle key={idx} cx={x} cy={y} r="5" fill="hsl(var(--primary))" />
                  })}
                </svg>
              </div>

              <div className="flex justify-between px-2 pt-2 border-t border-border font-mono text-[9px] font-bold text-muted-foreground">
                {chartData[activeTab].days.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Connection logs */}
          <div className="p-6 rounded-2xl border border-border bg-surface text-left lg:col-span-4 flex flex-col justify-between">
            <div className="flex flex-col gap-1 mb-5">
              <h4 className="text-sm font-bold text-foreground font-display">Target Social Interactions</h4>
              <p className="text-[11px] text-muted-foreground">Clicks on your public profile links</p>
            </div>

            <div className="space-y-3 flex-grow my-auto justify-center flex flex-col">
              {[
                { label: "GitHub Repo", clicks: "1,120", color: "bg-primary" },
                { label: "Portfolio Site", clicks: "840", color: "bg-brand-cyan" },
                { label: "LinkedIn / Resume", clicks: "518", color: "bg-brand-violet" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between p-3.5 bg-card border border-border rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full", row.color)} />
                    <span className="text-xs text-foreground font-semibold">{row.label}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground font-mono">{row.clicks} clicks</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2.5 text-xs text-primary">
              <Sparkles className="w-4 h-4 text-warning" />
              <span className="font-semibold">Verified profiles get 2.4x more recruiter clicks</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
