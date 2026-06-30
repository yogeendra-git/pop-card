"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "glass-card bg-card/95 border border-border rounded-2xl p-6 shadow-elevated space-y-4 data-[state=open]:animate-slide-up",
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <Dialog.Title className="font-bold text-foreground font-display">{title}</Dialog.Title>}
                {description && <Dialog.Description className="text-xs text-muted-foreground mt-1">{description}</Dialog.Description>}
              </div>
              <Dialog.Close className="p-1 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
