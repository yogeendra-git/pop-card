"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyLinkButton({ path, className, label = "Copy Link" }: { path: string; className?: string; label?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard API can be blocked (insecure context, permissions) — fail silently, button still shows feedback.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className={cn("flex items-center justify-center gap-1.5 transition-colors", className)}>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  )
}
