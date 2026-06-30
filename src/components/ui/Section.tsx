import * as React from "react"
import { cn } from "@/lib/utils"

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-w-7xl mx-auto px-6", className)} {...props} />
}

/**
 * Marketing-page section wrapper. Mirrors the `<section id="..." className="py-24 ...">`
 * pattern repeated across every popcard-platform component (Hero, Features,
 * Statistics, etc.) so individual sections only describe their *content*.
 */
export function Section({
  id,
  className,
  innerClassName,
  tint,
  children,
}: {
  id?: string
  className?: string
  innerClassName?: string
  /** Adds the subtle alternating section background used between hero-style sections. */
  tint?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-20 sm:py-24", tint && "bg-surface", className)}>
      <Container className={cn("relative z-10", innerClassName)}>{children}</Container>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-14 sm:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-bold text-primary font-mono tracking-widest uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground mb-4 text-balance">
        {title}
      </h2>
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  )
}
