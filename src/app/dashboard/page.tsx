import React from "react"
import Link from "next/link"
import { VerificationBadge, ProgressBar } from "@/components/ui/CustomComponents"
import { StatsCard, DashboardCard } from "@/components/ui/DashboardCard"
import { PageHeader } from "@/components/ui/PageHeader"
import { CopyLinkButton } from "@/components/copy-link-button"
import { getStudent, computeProfileCompletion } from "@/lib/db"
import { Award, Trophy, Eye, ShieldAlert, CheckSquare, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardIndex() {
  const data = await getStudent()
  const completion = computeProfileCompletion(data)
  const overallVerification =
    data.verification.identity === "verified" && data.verification.tenth === "verified" && data.verification.twelfth === "verified"
      ? "verified"
      : data.verification.identity === "rejected"
      ? "rejected"
      : data.verification.identity === "review"
      ? "review"
      : "pending"

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Monitor your identity attestations, visibility settings, and profile statistics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard className="flex flex-col justify-between" contentClassName="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">Profile Completion</span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
          <ProgressBar value={completion} />
          <p className="text-[11px] text-muted-foreground">Complete verification to optimize profile visibility.</p>
        </DashboardCard>

        <StatsCard title="Certificates" value={data.certificates.length} icon={Award} accent="primary" description={`${data.certificates.filter((c) => c.status === "verified").length} verified`} />
        <StatsCard title="Achievements" value={data.achievements.length} icon={Trophy} accent="warning" description="Competitive achievements" />

        <DashboardCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Verification Status</span>
            <div className="pt-1">
              <VerificationBadge status={overallVerification} />
            </div>
          </div>
          <CheckSquare className="h-8 w-8 text-success/20" />
        </DashboardCard>

        <StatsCard title="Profile Views" value={data.profileViews} icon={Eye} accent="info" description="All-time public visits" />

        <DashboardCard className="flex flex-col justify-between">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Your POP Card Link</span>
            <p className="text-sm font-mono font-bold text-primary mt-1 truncate">popcard.app/{data.builderSettings.customUsername}</p>
          </div>
          <CopyLinkButton
            path={`/public/${data.builderSettings.customUsername}`}
            className="mt-3 w-full py-2 bg-muted hover:bg-muted/70 text-xs font-semibold rounded-lg text-foreground"
          />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Recent Activity" className="lg:col-span-2">
          <div className="space-y-4">
            {data.activity.map((act) => (
              <div key={act.id} className="flex gap-4 items-start text-sm border-b border-border/60 pb-3 last:border-none last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground font-medium">{act.text}</p>
                  <span className="text-xs text-muted-foreground">{act.date}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-glow">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground font-display">Recruiter Mode</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure what recruiters see when they open your shareable POP Card.
            </p>
          </div>
          <Link
            href="/dashboard/builder"
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-primary-foreground font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-glow"
          >
            Configure POP Card <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
