"use client"

import React, { useState, useTransition } from "react"
import { User, Lock, Bell, Shield, Globe, Eye, EyeOff, AlertTriangle, Check } from "lucide-react"
import { updateAccountBasicsAction, updateBuilderSettingsAction, updatePreferencesAction } from "@/lib/actions"
import type { BuilderSettings, Preferences } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card } from "@/components/ui/Card"
import { Input, FormField } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "public", label: "Public Profile", icon: Globe },
] as const

const PRIVACY_LABELS: Record<keyof Pick<Preferences, "profilePublic" | "showEmail" | "showPhone" | "recruiterMode" | "indexSearch">, { t: string; d: string }> = {
  profilePublic: { t: "Public Profile", d: "Anyone with your link can view your POP Card" },
  showEmail: { t: "Show Email", d: "Display email on your public profile" },
  showPhone: { t: "Show Phone", d: "Display phone on your public profile" },
  recruiterMode: { t: "Allow Recruiter Mode", d: "Enable special recruiter view" },
  indexSearch: { t: "Index in Search", d: "Allow profile to appear in search results" },
}

const NOTIF_LABELS: Record<keyof Pick<Preferences, "notifyProfileViews" | "notifyCertVerified" | "notifyWeeklyDigest" | "notifyRecruiterContact" | "notifySystemUpdates">, { t: string; d: string }> = {
  notifyProfileViews: { t: "Profile Views", d: "When someone views your POP Card" },
  notifyCertVerified: { t: "Certificate Verified", d: "When a certificate gets verified" },
  notifyWeeklyDigest: { t: "Weekly Digest", d: "Weekly activity summary email" },
  notifyRecruiterContact: { t: "Recruiter Contact", d: "When a recruiter accesses your profile" },
  notifySystemUpdates: { t: "System Updates", d: "Product updates and new features" },
}

const PUBLIC_TOGGLES: { key: keyof BuilderSettings; label: string; desc: string }[] = [
  { key: "showEducation", label: "Education Section", desc: "University, degree, graduation year" },
  { key: "showCgpa", label: "CGPA Score", desc: "Your current CGPA" },
  { key: "showTenth", label: "10th Percentage", desc: "Class 10 marks" },
  { key: "showTwelfth", label: "12th / PU Percentage", desc: "Class 12 marks" },
  { key: "showCertificates", label: "Certificates", desc: "All uploaded certificates" },
  { key: "showAchievements", label: "Achievements", desc: "Awards and competition wins" },
  { key: "showSkills", label: "Skills", desc: "Your skill tags" },
  { key: "showGoals", label: "Career Goals", desc: "Your career objectives" },
  { key: "showHobbies", label: "Hobbies", desc: "Personal interests" },
]

function ToggleRow({ title, desc, checked, onToggle }: { title: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <button onClick={onToggle} className={cn("w-11 h-6 rounded-full transition-colors relative flex-shrink-0", checked ? "bg-primary" : "bg-muted")}>
        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-card shadow transition-all", checked ? "left-6" : "left-1")} />
      </button>
    </div>
  )
}

export function SettingsClient({
  fullName: initialFullName,
  email: initialEmail,
  phone: initialPhone,
  builderSettings: initialBuilderSettings,
  preferences: initialPreferences,
}: {
  fullName: string
  email: string
  phone: string
  builderSettings: BuilderSettings
  preferences: Preferences
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("account")
  const [showPw, setShowPw] = useState(false)
  const [securityNote, setSecurityNote] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [username, setUsername] = useState(initialBuilderSettings.customUsername)
  const [accountSaved, setAccountSaved] = useState(false)

  const [preferences, setPreferences] = useState(initialPreferences)
  const [builderSettings, setBuilderSettings] = useState(initialBuilderSettings)
  const [sessions, setSessions] = useState([
    { device: "Chrome on Windows", loc: "Bengaluru, IN", current: true },
    { device: "Safari on iPhone", loc: "Bengaluru, IN", current: false },
  ])

  const togglePreference = (key: keyof Preferences) => {
    setPreferences((p) => {
      const next = { ...p, [key]: !p[key] }
      startTransition(async () => { await updatePreferencesAction({ [key]: next[key] } as Partial<Preferences>) })
      return next
    })
  }

  const togglePublicSection = (key: keyof BuilderSettings) => {
    setBuilderSettings((p) => {
      const next = { ...p, [key]: !p[key] }
      startTransition(async () => { await updateBuilderSettingsAction({ [key]: next[key] } as Partial<BuilderSettings>) })
      return next
    })
  }

  const saveAccount = () => {
    startTransition(async () => {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, "")
      setUsername(cleanUsername)
      await Promise.all([
        updateAccountBasicsAction({ fullName, email, phone }),
        cleanUsername !== initialBuilderSettings.customUsername
          ? updateBuilderSettingsAction({ customUsername: cleanUsername })
          : Promise.resolve(),
      ])
      setAccountSaved(true)
      setTimeout(() => setAccountSaved(false), 2500)
    })
  }

  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" description="Manage your account preferences and privacy." className="mb-6" />

      <div className="flex gap-6 flex-col sm:flex-row">
        {/* Tab sidebar */}
        <div className="w-full sm:w-44 flex-shrink-0">
          <Card padding="sm" className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
            <div className="pt-2 border-t border-border mt-1">
              <button
                onClick={() => {
                  if (confirm("This will permanently delete your account. Continue?")) {
                    setSecurityNote("Account deletion needs real authentication wired up first, so nothing was deleted. This is a placeholder for now.")
                    setActiveTab("security")
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "account" && (
            <Card>
              <h2 className="text-base font-bold text-foreground font-display mb-1">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <FormField label="Full Name">
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FormField>
                <FormField label="Email Address">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormField>
                <FormField label="Phone Number">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormField>
                <FormField label="Username">
                  <div className="flex rounded-lg overflow-hidden border border-border">
                    <span className="bg-muted text-xs px-2.5 py-2 text-muted-foreground font-mono border-r border-border">popcard.app/</span>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 px-3 py-2 bg-transparent text-xs font-mono focus:outline-none" />
                  </div>
                </FormField>
              </div>
              <Button onClick={saveAccount} loading={isPending} className="mt-5">
                {accountSaved ? <Check className="h-4 w-4" /> : null}
                {accountSaved ? "Saved" : "Save Changes"}
              </Button>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <h2 className="text-base font-bold text-foreground font-display mb-2">Privacy Controls</h2>
              {(Object.keys(PRIVACY_LABELS) as (keyof typeof PRIVACY_LABELS)[]).map((key) => (
                <ToggleRow key={key} title={PRIVACY_LABELS[key].t} desc={PRIVACY_LABELS[key].d} checked={preferences[key]} onToggle={() => togglePreference(key)} />
              ))}
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h2 className="text-base font-bold text-foreground font-display mb-2">Notification Preferences</h2>
              {(Object.keys(NOTIF_LABELS) as (keyof typeof NOTIF_LABELS)[]).map((key) => (
                <ToggleRow key={key} title={NOTIF_LABELS[key].t} desc={NOTIF_LABELS[key].d} checked={preferences[key]} onToggle={() => togglePreference(key)} />
              ))}
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <h2 className="text-base font-bold text-foreground font-display">Security</h2>
              {securityNote && (
                <p className="text-xs text-info bg-info/10 border border-info/20 px-3 py-2 rounded-lg mt-4">{securityNote}</p>
              )}
              <div className="space-y-4 mt-4">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
                {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                  <FormField key={label} label={label}>
                    <div className="relative">
                      <Input type={showPw ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                      <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" type="button">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormField>
                ))}
                <Button
                  onClick={() => setSecurityNote("Password changes need real authentication wired up first (Auth.js is the next backend phase) — this is a UI placeholder for now.")}
                >
                  Update Password
                </Button>
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <h3 className="font-semibold text-foreground text-sm mb-3">Active Sessions</h3>
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground text-sm">{s.device}</p>
                      <p className="text-xs text-muted-foreground">{s.loc}{s.current && " · Current session"}</p>
                    </div>
                    {!s.current && (
                      <button onClick={() => setSessions(sessions.filter((_, si) => si !== i))} className="text-xs text-destructive font-semibold hover:underline">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "public" && (
            <Card>
              <h2 className="text-base font-bold text-foreground font-display">Public Profile Controls</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-2">Control what appears on your public POP Card. These are the same toggles as the POP Card Builder.</p>
              {PUBLIC_TOGGLES.map((item) => (
                <ToggleRow key={item.key} title={item.label} desc={item.desc} checked={builderSettings[item.key] as boolean} onToggle={() => togglePublicSection(item.key)} />
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
