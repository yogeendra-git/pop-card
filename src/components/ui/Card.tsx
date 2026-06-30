import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-2xl transition-all duration-300", {
  variants: {
    variant: {
      // Standard elevated panel — the default surface for dashboard pages.
      solid: "bg-card border border-border shadow-subtle",
      // Premium frosted panel — reserved for hero/feature moments per
      // DESIGN_SYSTEM.md ("glass is intentionally reserved... not a default").
      glass: "glass-card shadow-elevated",
      // Soft tinted panel for callouts / promo blocks.
      tinted: "bg-primary/5 border border-primary/15",
      outline: "border border-border bg-transparent",
      ghost: "bg-transparent",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    hover: {
      none: "",
      lift: "hover:-translate-y-1 hover:shadow-elevated",
      glow: "hover:border-primary/40 hover:shadow-glow",
    },
  },
  defaultVariants: { variant: "solid", padding: "md", hover: "none" },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, padding, hover, className }))} {...props} />
  )
)
Card.displayName = "Card"

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between gap-4 border-b border-border pb-3 mb-5", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-bold text-foreground font-display tracking-tight", className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground mt-1", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-5", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 pt-5 mt-5 border-t border-border", className)} {...props} />
}
