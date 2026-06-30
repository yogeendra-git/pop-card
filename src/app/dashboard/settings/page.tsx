import { getStudent } from "@/lib/db"
import { SettingsClient } from "./settings-client"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const data = await getStudent()
  return (
    <SettingsClient
      fullName={data.fullName}
      email={data.email}
      phone={data.phone}
      builderSettings={data.builderSettings}
      preferences={data.preferences}
    />
  )
}
