"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, BookOpen, Building2, Loader2 } from "lucide-react"
import { GradientBackground } from "@/components/ui/GradientBackground"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

/**
 * Redesigned using popcard-platform's `LoginGateway.tsx` register flow as
 * the visual reference, including its Student / Recruiter portal tabs. The
 * recruiter portal is presented as "coming soon" — role-based recruiter
 * accounts are a future phase (see BACKEND.md).
 *
 * The student form is wired to real Supabase Auth: `supabase.auth.signUp`
 * creates the account, and a database trigger (see supabase/schema.sql,
 * `handle_new_user`) automatically writes the full name, email, and phone
 * into the `profiles` table the moment the account exists — visible
 * immediately in the Supabase Table Editor.
 */
export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = React.useState<"student" | "recruiter">("student")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [needsEmailConfirm, setNeedsEmailConfirm] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push("/dashboard")
      router.refresh()
    } else {
      // Email confirmation is required by this Supabase project's auth
      // settings — the account + profile row already exist, but the
      // session only starts once the link in the confirmation email is
      // clicked.
      setNeedsEmailConfirm(true)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      <GradientBackground variant="both" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-foreground">
            Create Your <span className="font-light text-muted-foreground">POP Card</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Your verified professional identity starts here — academics, certificates, and achievements in one link.
          </p>
        </div>

        {/* Portal tabs */}
        <div className="p-1.5 rounded-2xl border border-border glass-card flex items-center gap-1.5 mb-6">
          <button
            onClick={() => setTab("student")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              tab === "student" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4" /> STUDENT PORTAL
          </button>
          <button
            onClick={() => setTab("recruiter")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              tab === "recruiter" ? "bg-secondary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="w-4 h-4" /> RECRUITER DESK
          </button>
        </div>

        <div className="rounded-3xl border border-border glass-card shadow-elevated p-8">
          {tab === "recruiter" ? (
            <div className="text-center py-10 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto text-secondary">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-foreground">Recruiter Desk is coming soon</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Role-based recruiter accounts are on the roadmap (see BACKEND.md). For now, browse any public POP Card directly via its shareable link.
              </p>
              <Button variant="outline" onClick={() => setTab("student")} className="mt-2">
                Back to Student Portal
              </Button>
            </div>
          ) : needsEmailConfirm ? (
            <div className="text-center py-10 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-foreground">Check your email</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. Click it to activate your account, then sign in.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="mt-2">Go to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
                  <Input type="text" required placeholder="Arjun Mehta" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
                  <Input type="email" required placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Mobile Number</label>
                  <Input type="tel" required placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</label>
                    <Input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Confirm</label>
                    <Input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-semibold">Sign In</Link>
              </p>
            </>
          )}
        </div>

        <Link href="/" className="block text-center text-xs text-muted-foreground hover:text-foreground mt-6 transition-colors">
          ← Back to homepage
        </Link>
      </div>
    </div>
  )
}
