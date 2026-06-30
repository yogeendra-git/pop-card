import React from "react"
import { getStudent } from "@/lib/db"
import DashboardLayout from "./dashboard-layout-client"

export const dynamic = "force-dynamic"

function verificationTierLabel(d: Awaited<ReturnType<typeof getStudent>>): string {
  const { tenth, twelfth, identity } = d.verification
  const verifiedCount = [tenth, twelfth, identity].filter((s) => s === "verified").length
  if (verifiedCount === 3) return "Verification Tier 3"
  if (verifiedCount === 2) return "Verification Tier 2"
  if (verifiedCount === 1) return "Verification Tier 1"
  return "Not Verified"
}

/**
 * Server wrapper around the interactive dashboard chrome. Reads the
 * signed-in user from Supabase (via getStudent → cookies → auth.uid()) so
 * the sidebar/header always show the real account's current name, photo,
 * and verification tier — never a fixed placeholder name.
 */
export default async function DashboardLayoutServer({ children }: { children: React.ReactNode }) {
  const data = await getStudent()

  return (
    <DashboardLayout fullName={data.fullName} avatarUrl={data.avatarDataUrl} verificationTier={verificationTierLabel(data)}>
      {children}
    </DashboardLayout>
  )
}
