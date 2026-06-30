import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center gap-3", className)}>
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-1">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-bold text-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  )
}

/** Inline pending pill used next to async buttons (e.g. "Saving…"). */
export function PendingIndicator({ label = "Saving…" }: { label?: string }) {
  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
      <Loader2 className="h-3 w-3 animate-spin" /> {label}
    </span>
  )
}
