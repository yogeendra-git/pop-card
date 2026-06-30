"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Check, Copy, Palette, Layout, User } from "lucide-react"
import { updateBuilderSettingsAction } from "@/lib/actions"
import type { BuilderSettings } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { DashboardCard } from "@/components/ui/DashboardCard"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { PendingIndicator } from "@/components/ui/EmptyState"
import { cn } from "@/lib/utils"

function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

export function BuilderClient({ settings: initialSettings, fullName, avatarDataUrl }: { settings: BuilderSettings; fullName: string; avatarDataUrl: string | null }) {
  const [settings, setSettings] = useState(initialSettings)
  const [usernameDraft, setUsernameDraft] = useState(initialSettings.customUsername)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [usernameSaved, setUsernameSaved] = useState(false)

  const persist = (partial: Partial<BuilderSettings>) => {
    startTransition(async () => {
      await updateBuilderSettingsAction(partial)
    })
  }

  const toggleSwitch = (key: keyof BuilderSettings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      persist({ [key]: next[key] } as Partial<BuilderSettings>)
      return next
    })
  }

  const selectTheme = (id: string) => {
    setSettings((p) => ({ ...p, theme: id }))
    persist({ theme: id })
  }

  const saveUsername = () => {
    const clean = usernameDraft.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setUsernameDraft(clean)
    if (clean === settings.customUsername || !clean) return
    setSettings((p) => ({ ...p, customUsername: clean }))
    persist({ customUsername: clean })
    setUsernameSaved(true)
    setTimeout(() => setUsernameSaved(false), 2000)
  }

  const copyLink = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/public/${settings.customUsername}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore — clipboard can be blocked in some contexts
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const visibilityKeys: { key: keyof BuilderSettings; label: string }[] = [
    { key: "showEducation", label: "Education Section" },
    { key: "showCgpa", label: "CGPA Score" },
    { key: "showTenth", label: "10th Percentage" },
    { key: "showTwelfth", label: "12th / PU Percentage" },
    { key: "showCertificates", label: "Course Certificates" },
    { key: "showAchievements", label: "Achievements" },
    { key: "showSkills", label: "Skills" },
    { key: "showGoals", label: "Career Goals" },
    { key: "showHobbies", label: "Hobbies & Interests" },
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="POP Card Builder"
        description="Customize what appears on your public profile and generate your shareable link."
        action={isPending ? <PendingIndicator /> : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Section Visibility" icon={Layout}>
            <div className="divide-y divide-border">
              {visibilityKeys.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <button
                    onClick={() => toggleSwitch(item.key)}
                    className={cn("w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none", settings[item.key] ? "bg-primary" : "bg-muted")}
                  >
                    <div className={cn("w-4 h-4 rounded-full bg-card shadow-sm transform duration-200", settings[item.key] ? "translate-x-5" : "translate-x-0")} />
                  </button>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Theme Selection" icon={Palette}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "indigo-purple", name: "Premium Slate", cls: "from-primary to-secondary" },
                { id: "emerald-teal", name: "Mint Verified", cls: "from-success to-info" },
                { id: "slate-dark", name: "Monochrome", cls: "from-foreground to-foreground" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left space-y-2 transition-all",
                    settings.theme === theme.id ? "border-primary ring-2 ring-primary/10 bg-primary/10" : "border-border hover:bg-muted"
                  )}
                >
                  <div className={cn("h-4 w-full rounded bg-gradient-to-r", theme.cls)} />
                  <span className="text-xs font-bold block text-foreground">{theme.name}</span>
                </button>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Your POP Card Link" icon={User} className="sticky top-24">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Custom Username</label>
              <div className="flex rounded-lg overflow-hidden border border-border bg-background">
                <span className="bg-muted text-xs px-2.5 py-2 text-muted-foreground border-r border-border font-mono flex items-center">popcard.app/</span>
                <input
                  type="text"
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  onBlur={saveUsername}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  className="flex-1 px-3 py-2 bg-transparent text-xs font-mono font-bold focus:outline-none text-foreground"
                />
              </div>
              {usernameSaved && (
                <p className="text-[10px] text-success font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" /> Username updated
                </p>
              )}
            </div>

            <Button onClick={copyLink} className="w-full">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Link Copied!" : "Copy POP Card Link"}
            </Button>

            <Link
              href={`/public/${settings.customUsername}`}
              target="_blank"
              className="w-full py-2.5 bg-muted hover:bg-muted/70 text-foreground border border-border text-center rounded-xl text-xs font-semibold block transition-all"
            >
              Preview Public Card
            </Link>

            <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2">
                {avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarDataUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-bold text-xs flex items-center justify-center">
                    {initialsOf(fullName)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-foreground">{fullName}</p>
                  <p className="text-[10px] text-muted-foreground">popcard.app/{settings.customUsername}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {settings.showSkills && <span className="text-[9px] px-1.5 py-0.5 bg-card rounded border border-border text-muted-foreground">Skills ✓</span>}
                {settings.showEducation && <span className="text-[9px] px-1.5 py-0.5 bg-card rounded border border-border text-muted-foreground">Education ✓</span>}
                {settings.showCertificates && <span className="text-[9px] px-1.5 py-0.5 bg-card rounded border border-border text-muted-foreground">Certs ✓</span>}
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
