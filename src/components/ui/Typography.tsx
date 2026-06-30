import * as React from "react"
import { cn } from "@/lib/utils"

export function GradientText({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-gradient-primary", className)} {...props} />
}

export function DisplayHeading({ className, as: Comp = "h1", ...props }: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" }) {
  return <Comp className={cn("font-display font-bold tracking-tight text-foreground", className)} {...props} />
}

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-base text-muted-foreground leading-relaxed", className)} {...props} />
}

export function MonoLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground", className)} {...props} />
}
