import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// Display face used for headlines / hero copy across the marketing site and
// section titles — matches the POP Card brand system (see DESIGN_SYSTEM.md).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-brand",
  display: "swap",
})

export const metadata: Metadata = {
  title: "POP Card — Verified Student Identity & Employability Platform",
  description: "Trusted digital identity for students. Verified academics, projects, and credentials in one recruiter-ready profile.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spaceGrotesk.variable, jetbrainsMono.variable, "font-sans")}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
