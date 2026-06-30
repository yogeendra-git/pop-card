import { getStudent } from "@/lib/db"
import { VerificationClient } from "./verification-client"

export const dynamic = "force-dynamic"

export default async function VerificationPage() {
  const data = await getStudent()
  return <VerificationClient verification={data.verification} />
}
