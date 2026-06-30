import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold border whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-secondary/10 text-secondary border-secondary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        info: "bg-info/10 text-info border-info/20",
        destructive: "bg-destructive/10 text-destructive border-destructive/20",
        neutral: "bg-muted text-muted-foreground border-border",
        outline: "bg-transparent text-foreground border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

/** Mono, uppercase "eyebrow" label — the small tag above section headings
 *  throughout popcard-platform (e.g. "ENGINEERED CONVERSIONS"). */
export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-block text-xs font-bold text-primary font-mono tracking-widest uppercase mb-3", className)}
      {...props}
    >
      {children}
    </span>
  )
}
