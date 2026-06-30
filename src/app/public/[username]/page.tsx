import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { getPublicStudentByUsername } from "@/lib/db"
import { PublicCardClient } from "./public-card-client"

export const dynamic = "force-dynamic"

export default async function PublicCardPage({ params }: { params: { username: string } }) {
  const data = await getPublicStudentByUsername(params.username)
  if (!data) notFound()

  const headersList = headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https"
  const origin = `${protocol}://${host}`

  return <PublicCardClient data={data} username={params.username} origin={origin} />
}
