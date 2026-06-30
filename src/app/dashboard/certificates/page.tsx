import { getStudent } from "@/lib/db"
import { CertificatesClient } from "./certificates-client"

export const dynamic = "force-dynamic"

export default async function CertificatesPage() {
  const data = await getStudent()
  return <CertificatesClient certificates={data.certificates} />
}
