import { getStudent } from "@/lib/db"
import { BuilderClient } from "./builder-client"

export const dynamic = "force-dynamic"

export default async function BuilderPage() {
  const data = await getStudent()
  return <BuilderClient settings={data.builderSettings} fullName={data.fullName} avatarDataUrl={data.avatarDataUrl} />
}
