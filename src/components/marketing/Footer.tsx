"use client"

import Link from "next/link"
import { ArrowUp, Sparkles, Github, Twitter, Linkedin, Heart, Send } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/ui/Section"

const footerCols = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "#features" },
      { label: "Templates", href: "#templates" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Demo Card", href: "/public/arjun-mehta" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth/login" },
      { label: "Create Account", href: "/auth/register" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Verification", href: "/dashboard/verification" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Settings", href: "#" },
      { label: "Data Protection", href: "#" },
    ],
  },
]

/** Migrated from popcard-platform `Footer.tsx`, with the toast-driven
 *  newsletter form replaced by simple local success state. */
export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) return
    setSubscribed(true)
    setEmail("")
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="pt-20 pb-12 relative overflow-hidden bg-surface border-t border-border">
      <Container className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left mb-16">
        <div className="md:col-span-4 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-brand-cyan flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-foreground">POP Card</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            One verified digital identity for students — academics, certificates, and achievements, ready for recruiters in a single link.
          </p>
          <div className="flex gap-2">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2.5 rounded-xl bg-muted hover:bg-muted/70 border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {footerCols.map((col) => (
          <div key={col.title} className="col-span-2 space-y-4">
            <h5 className="text-xs font-bold text-foreground font-display tracking-wider uppercase">{col.title}</h5>
            <ul className="space-y-2 text-xs">
              {col.links.map((lnk) => (
                <li key={lnk.label}>
                  <Link href={lnk.href} className="text-muted-foreground hover:text-primary transition-colors block py-0.5">
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2 space-y-4">
          <h5 className="text-xs font-bold text-foreground font-display tracking-wider uppercase">Weekly Digest</h5>
          <p className="text-[11px] text-muted-foreground leading-normal">Campus placement tips and product updates, once a week.</p>

          {subscribed ? (
            <p className="text-[11px] font-semibold text-success">You&apos;re subscribed — thanks!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center bg-card border border-border p-2.5 rounded-xl">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-[11px] text-foreground focus:outline-none w-full pr-6"
                />
                <button type="submit" className="absolute right-2 p-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-transform active:scale-90">
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>
      </Container>

      <Container className="pt-8 border-t border-border relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono gap-4">
        <div>© 2026 POP Card. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for students everywhere
        </div>
        <button
          onClick={scrollToTop}
          className="p-2.5 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-md flex items-center justify-center active:scale-90"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </Container>
    </footer>
  )
}
