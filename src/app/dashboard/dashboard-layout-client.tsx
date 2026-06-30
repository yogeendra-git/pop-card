"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOutAction } from "@/lib/actions"
import {
  LayoutDashboard, User, GraduationCap, Award, Trophy, ShieldCheck,
  CreditCard, Settings, Search, Bell, LogOut, Menu, X, Sparkles,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Education", href: "/dashboard/education", icon: GraduationCap },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Verification", href: "/dashboard/verification", icon: ShieldCheck },
  { name: "POP Card Builder", href: "/dashboard/builder", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

/**
 * Redesigned using popcard-platform's `DashboardPreview.tsx` /
 * `StudentProfileEditor.tsx` as the visual reference (gradient brand chip,
 * glass surfaces, pill-style active nav state). Structure, routes, and the
 * mobile-drawer behavior are unchanged from the original product layout —
 * only the presentation layer changed.
 *
 * The signed-in user's name/initials/avatar/verification tier are passed
 * in as props from the server (src/app/dashboard/layout.tsx, which reads
 * the real Supabase session + profile row) rather than hardcoded, so
 * renaming your profile here reflects the account that's actually signed
 * in — not a fixed placeholder name.
 */
export default function DashboardLayout({
  children,
  fullName,
  avatarUrl,
  verificationTier,
}: {
  children: React.ReactNode
  fullName: string
  avatarUrl: string | null
  verificationTier: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
      router.push("/auth/login")
      router.refresh()
    })
  }

  const NavLink = ({ item, onClick }: { item: (typeof navItems)[number]; onClick?: () => void }) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
          isActive ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="dashboardNavActive"
            className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-glow"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <Icon className="h-4.5 w-4.5 relative z-10" />
        <span className="relative z-10">{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full z-30">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground font-display tracking-tight">POP Card</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-card z-50 transform transition-transform duration-300 lg:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-glow">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground font-display tracking-tight">POP Card</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} onClick={() => setMobileOpen(false)} />
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass-nav flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg border border-border text-muted-foreground lg:hidden hover:bg-muted">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-xs w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search profile data..."
                className="w-full pl-9 pr-4 py-1.5 bg-muted text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <button className="p-2 text-muted-foreground hover:bg-muted rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={fullName} className="h-9 w-9 rounded-full object-cover shadow-subtle" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-subtle">
                  {initialsOf(fullName)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-foreground">{fullName || "Your Name"}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{verificationTier}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
