import { getStudent } from "@/lib/db"
import { AchievementsClient } from "./achievements-client"

export const dynamic = "force-dynamic"

export default async function AchievementsPage() {
  const data = await getStudent()
  return <AchievementsClient achievements={data.achievements} />
}
