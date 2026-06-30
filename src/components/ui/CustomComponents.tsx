import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react"

/**
 * Restyled in the popcard-platform design pass. Export names and prop
 * shapes are unchanged so every existing call site (dashboard pages,
 * certificates/verification clients, public profile) keeps working as-is —
 * only the visual treatment changed (gradient icon chips, softer elevation,
 * brand-mono badge labels) to match the platform's premium SaaS aesthetic.
 */

// Stat Card
export function StatCard({ title, value, icon: Icon, description, className }: {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-subtle flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-elevated", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-extrabold tracking-tight text-foreground font-display">{value}</h3>
        {description && <p className="text-xs text-muted-foreground/80 mt-1">{description}</p>}
      </div>
    </div>
  )
}

// Verification Badge
export function VerificationBadge({ status }: { status: "verified" | "pending" | "review" | "rejected" }) {
  const config = {
    verified: { label: "Verified", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
    pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
    review: { label: "In Review", icon: AlertTriangle, className: "bg-info/10 text-info border-info/20" },
    rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" }
  }

  const active = config[status] || config.pending
  const Icon = active.icon

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", active.className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{active.label}</span>
    </div>
  )
}

// Progress Bar
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
