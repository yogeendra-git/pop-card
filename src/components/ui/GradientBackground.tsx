import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Decorative glow-mesh + grid backdrop used behind the Hero, auth screens,
 * and CTA sections in popcard-platform. Pure decoration — `pointer-events-none`
 * and `aria-hidden`, layered behind `relative z-10` content.
 */
export function GradientBackground({
  variant = "mesh",
  className,
}: {
  variant?: "mesh" | "grid" | "both"
  className?: string
}) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)} aria-hidden>
      {(variant === "mesh" || variant === "both") && (
        <>
          <div className="absolute top-[10%] left-[5%] w-[45%] aspect-square rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/15 blur-[120px]" />
          <div className="absolute bottom-[15%] right-[5%] w-[35%] aspect-square rounded-full bg-gradient-to-tr from-brand-cyan/10 to-brand-emerald/5 dark:from-brand-cyan/15 dark:to-brand-emerald/5 blur-[100px]" />
        </>
      )}
      {(variant === "grid" || variant === "both") && <div className="absolute inset-0 bg-grid-glow opacity-80" />}
    </div>
  )
}
