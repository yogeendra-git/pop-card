"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, ArrowRight, Mail, Lock, Loader2 } from "lucide-react"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

/**
 * Redesigned using popcard-platform's `LoginGateway.tsx` as the visual
 * reference (brand header, gradient mesh + grid backdrop, glass auth card).
 * Wired to real Supabase Auth (`signInWithPassword`) — a successful sign-in
 * sets the session cookie via @supabase/ssr and every dashboard page reads
 * the signed-in user from there (see lib/supabase/server.ts, lib/db.ts).
 *
 * `useSearchParams()` requires a Suspense boundary during static
 * prerendering, so the page below the search-param logic into
 * `LoginPageInner` and wrap it here — without this, `next build` fails on
 * this route (and the deploy fails on Vercel).
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    const next = searchParams.get("next") || "/dashboard"
    router.push(next)
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      <GradientBackground variant="both" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-foreground">
            Welcome <span className="font-light text-muted-foreground">Back</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Sign in to manage your verified POP Card and recruiter-ready profile.
          </p>
        </div>

        <div className="rounded-3xl border border-border glass-card shadow-elevated p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" required placeholder="name@university.edu" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" required placeholder="••••••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="relative flex py-6 items-center text-xs uppercase text-muted-foreground font-bold">
            <div className="flex-grow border-t border-border" />
            <span className="flex-shrink mx-4">or</span>
            <div className="flex-grow border-t border-border" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 bg-muted border border-border hover:bg-muted/70 text-foreground rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3c.9-2.7 3.4-4.46 6.64-4.46z" />
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.37H12v4.5h6.46c-.28 1.47-1.12 2.7-2.38 3.55l3.7 2.87c2.16-2 3.72-4.94 3.72-8.55z" />
              <path fill="#FBBC05" d="M5.36 14.5c-.24-.7-.36-1.46-.36-2.25s.12-1.55.36-2.25L1.5 7.04C.54 8.94 0 11.05 0 13.25s.54 4.3 1.5 6.2l3.86-2.95z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.93l-3.7-2.87c-1.03.7-2.34 1.12-4.26 1.12-3.24 0-5.74-1.76-6.64-4.46L1.5 16.8C3.4 20.65 7.35 23 12 23z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-semibold">Create Account</Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-xs text-muted-foreground hover:text-foreground mt-6 transition-colors">
          ← Back to homepage
        </Link>
      </div>
    </div>
  )
}