import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block", className)}
      {...props}
    />
  )
}

export function FormField({
  label,
  hint,
  className,
  children,
}: {
  label?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="text-[10px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  )
}
