"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles, ArrowRight, PlayCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Platform", href: "#features", id: "features" },
  { label: "Templates", href: "#templates", id: "templates" },
  { label: "Statistics", href: "#statistics", id: "statistics" },
  { label: "How it Works", href: "#how-it-works", id: "how-it-works" },
  { label: "Community", href: "#community", id: "community" },
]

/**
 * Migrated from popcard-platform `Navbar.tsx`. The original threaded an
 * `isDark` boolean + `toggleTheme` callback through every conditional
 * className; that's gone now — `<ThemeToggle />` (already wired into
 * next-themes) handles it, and every color below is a semantic token that
 * repaints on its own. Session-aware UI (logged-in avatar dropdown) was
 * dropped because the functional app underneath has no real auth session
 * yet (see DESIGN_SYSTEM.md "Recommended next phases") — the original
 * landing page in this repo had the same guest-only nav.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      const sections = ["hero", "features", "templates", "statistics", "how-it-works", "community"]
      const scrollPosition = window.scrollY + 120

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled ? "py-3.5 glass-nav shadow-lg" : "py-6 bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-brand-cyan flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-foreground flex items-center gap-1.5">
            POP Card
            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 hidden sm:inline-block font-mono">
              v4.0
            </span>
          </span>
        </Link>

        {/* Desktop Links with active highlight */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-full border border-border">
          {navLinks.map((item) => (
            <div key={item.id} className="relative">
              <a
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-200 block z-10 relative",
                  activeSection === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-card rounded-full shadow-sm z-0 border border-border"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Secondary Navigation Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/public/arjun-mehta"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 bg-primary/5 text-primary transition-all hover:bg-primary/10"
          >
            <PlayCircle className="w-3.5 h-3.5" /> View Demo Card
          </Link>

          <Link
            href="/auth/login"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-2"
          >
            Sign In
          </Link>

          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-primary-foreground px-5 py-2.5 rounded-full shadow-glow transition-all group scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-border bg-card text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border mt-3.5 px-6 py-6 bg-background overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-semibold py-1 block",
                    activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
              <hr className="my-2 border-border" />

              <Link
                href="/public/arjun-mehta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-muted border border-border rounded-full font-semibold text-sm hover:text-primary transition-colors"
              >
                View Demo Card
              </Link>

              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-border rounded-full font-semibold text-sm hover:bg-muted transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm rounded-full shadow-glow"
              >
                Join / Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
