import Link from "next/link"
import { ShieldQuestion } from "lucide-react"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { Button } from "@/components/ui/Button"

export default function PublicProfileNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center relative overflow-hidden">
      <GradientBackground variant="both" />
      <div className="max-w-sm space-y-4 relative z-10">
        <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <ShieldQuestion className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground font-display">POP Card not found</h1>
        <p className="text-sm text-muted-foreground">This profile doesn&apos;t exist, or its owner has made it private.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
