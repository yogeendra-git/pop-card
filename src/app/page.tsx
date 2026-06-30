import { Navbar } from "@/components/marketing/Navbar"
import { Hero } from "@/components/marketing/Hero"
import { Features } from "@/components/marketing/Features"
import { DashboardPreviewSection } from "@/components/marketing/DashboardPreviewSection"
import { TemplatesShowcase } from "@/components/marketing/TemplatesShowcase"
import { Statistics } from "@/components/marketing/Statistics"
import { HowItWorks } from "@/components/marketing/HowItWorks"
import { Testimonials } from "@/components/marketing/Testimonials"
import { CommunitySection } from "@/components/marketing/CommunitySection"
import { CTA } from "@/components/marketing/CTA"
import { Footer } from "@/components/marketing/Footer"

/**
 * Landing page — fully migrated from popcard-platform's `App.tsx` composition.
 *
 * Dropped from the original: the `isDark` + `session` state threaded through
 * every section (replaced by the token-driven theme system + `ThemeToggle`,
 * since this app has no real auth session — see DESIGN_SYSTEM.md), the
 * `LoginGateway` modal overlay (replaced by real `/auth/login` and
 * `/auth/register` routes, restyled separately to match), the `DemoModal` /
 * floating AI-chat FAB / `FeedbackToasts` system (demo-only UI chrome with
 * no backing functionality), and the `RecruiterDashboard` / inline
 * `StudentProfileEditor` HUD (marketing mockups for a session that doesn't
 * exist here — the real, fully-functional dashboard lives at `/dashboard`).
 *
 * Everything the migration brief explicitly calls for is present: Navbar,
 * Hero, Features, Statistics, Templates Showcase, Dashboard Preview,
 * Testimonials, How It Works, Community Section, CTA, Footer.
 */
export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreviewSection />
      <TemplatesShowcase />
      <Statistics />
      <HowItWorks />
      <Testimonials />
      <CommunitySection />
      <CTA />
      <Footer />
    </div>
  )
}
