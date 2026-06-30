import { getStudent } from "@/lib/db"
import { EducationClient } from "./education-client"

export const dynamic = "force-dynamic"

export default async function EducationPage() {
  const data = await getStudent()
  return <EducationClient education={data.education} />
}
