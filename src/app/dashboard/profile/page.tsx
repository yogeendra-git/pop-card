import { getStudent } from "@/lib/db"
import { ProfileClient } from "./profile-client"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const data = await getStudent()
  return (
    <ProfileClient
      fullName={data.fullName}
      headline={data.headline}
      bio={data.bio}
      email={data.email}
      phone={data.phone}
      location={data.location}
      skills={data.skills}
      hobbies={data.hobbies}
      languages={data.languages}
      careerGoals={data.careerGoals}
      avatarDataUrl={data.avatarDataUrl}
    />
  )
}