import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/Card"

/**
 * Metric tile for dashboard overview grids. Visually replaces the flat
 * `StatCard` from CustomComponents.tsx with the gradient icon-chip treatment
 * used throughout popcard-platform's DashboardPreview / Statistics sections,
 * while keeping the same data shape so call sites barely change.
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accent = "primary",
  className,
}: {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: { value: string; up?: boolean }
  accent?: "primary" | "secondary" | "success" | "warning" | "info"
  className?: string
}) {
  const accentClass: Record<string, string> = {
    primary: "from-primary to-secondary text-primary-foreground",
    secondary: "from-secondary to-primary text-primary-foreground",
    success: "from-success to-success/60 text-white",
    warning: "from-warning to-warning/60 text-white",
    info: "from-info to-info/60 text-white",
  }

  return (
    <Card hover="lift" className={cn("flex flex-col justify-between", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-tr flex items-center justify-center shadow-sm", accentClass[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-extrabold tracking-tight text-foreground font-display">{value}</h3>
        <div className="flex items-center gap-2 mt-1">
          {description && <p className="text-xs text-muted-foreground/80">{description}</p>}
          {trend && (
            <span className={cn("text-[10px] font-mono font-bold", trend.up !== false ? "text-success" : "text-destructive")}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

/** Generic dashboard content panel — the `bg-card border border-border rounded-2xl p-6`
 *  shell repeated across every dashboard page, now centralized with an optional
 *  icon-led header so pages stop hand-rolling the same header markup. */
export function DashboardCard({
  title,
  icon: Icon,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: React.ReactNode
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <Card className={className}>
      {title && (
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <h3 className="text-base font-bold flex items-center gap-2 text-foreground font-display">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            {title}
          </h3>
          {action}
        </div>
      )}
      <div className={cn("space-y-5", contentClassName)}>{children}</div>
    </Card>
  )
}
