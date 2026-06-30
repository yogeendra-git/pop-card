import * as React from "react"
import { cn } from "@/lib/utils"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 resize-none transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
