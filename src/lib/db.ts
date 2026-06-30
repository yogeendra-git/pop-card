import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Supabase-backed persistence layer.
 *
 * Replaces the old single-tenant JSON file store (see db.ts.bak / BACKEND.md
 * for the previous version and why it existed). Every function here reads
 * the signed-in user from the Supabase session (via cookies, see
 * lib/supabase/server.ts) and reads/writes only that user's rows — Row
 * Level Security in supabase/schema.sql enforces this at the database level
 * too, so even a buggy query here can't leak another student's data.
 *
 * Function names and return shapes are kept close to the original file so
 * actions.ts and the page components didn't need a rewrite, just `await`.
 */

export type VerificationStatus = "pending" | "review" | "verified" | "rejected"

export interface Certificate {
  id: string
  title: string
  organization: string
  date: string
  url: string
  imageUrl: string | null
  status: VerificationStatus
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  eventName: string
  date: string
  description: string
  imageUrl: string | null
  createdAt: string
}

export interface Education {
  universityName: string
  collegeName: string
  degree: string
  branch: string
  currentSemester: string
  graduationYear: string
  cgpa: string
  tenthPercentage: string
  twelfthPercentage: string
  academicSummary: string
}

export interface BuilderSettings {
  showEducation: boolean
  showCgpa: boolean
  showTenth: boolean
  showTwelfth: boolean
  showCertificates: boolean
  showAchievements: boolean
  showSkills: boolean
  showGoals: boolean
  showHobbies: boolean
  theme: string
  customUsername: string
}

export interface Preferences {
  profilePublic: boolean
  showEmail: boolean
  showPhone: boolean
  recruiterMode: boolean
  indexSearch: boolean
  notifyProfileViews: boolean
  notifyCertVerified: boolean
  notifyWeeklyDigest: boolean
  notifyRecruiterContact: boolean
  notifySystemUpdates: boolean
}

export interface ActivityEntry {
  id: string
  text: string
  date: string
}

export interface StudentData {
  id: string
  fullName: string
  headline: string
  bio: string
  email: string
  phone: string
  location: string
  avatarDataUrl: string | null
  skills: string[]
  careerGoals: string[]
  hobbies: string[]
  languages: string[]
  education: Education
  verification: { tenth: VerificationStatus; twelfth: VerificationStatus; identity: VerificationStatus }
  certificates: Certificate[]
  achievements: Achievement[]
  builderSettings: BuilderSettings
  preferences: Preferences
  profileViews: number
  activity: ActivityEntry[]
  updatedAt: string
}

// ---- Row <-> StudentData mapping ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfileRow(row: any, certificates: Certificate[], achievements: Achievement[], activity: ActivityEntry[]): StudentData {
  return {
    id: row.id,
    fullName: row.full_name ?? "",
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    avatarDataUrl: row.avatar_url ?? null,
    skills: row.skills ?? [],
    careerGoals: row.career_goals ?? [],
    hobbies: row.hobbies ?? [],
    languages: row.languages ?? [],
    education: {
      universityName: row.university_name ?? "",
      collegeName: row.college_name ?? "",
      degree: row.degree ?? "",
      branch: row.branch ?? "",
      currentSemester: row.current_semester ?? "",
      graduationYear: row.graduation_year ?? "",
      cgpa: row.cgpa ?? "",
      tenthPercentage: row.tenth_percentage ?? "",
      twelfthPercentage: row.twelfth_percentage ?? "",
      academicSummary: row.academic_summary ?? "",
    },
    verification: {
      tenth: row.tenth_status ?? "pending",
      twelfth: row.twelfth_status ?? "pending",
      identity: row.identity_status ?? "pending",
    },
    certificates,
    achievements,
    builderSettings: {
      showEducation: row.show_education,
      showCgpa: row.show_cgpa,
      showTenth: row.show_tenth,
      showTwelfth: row.show_twelfth,
      showCertificates: row.show_certificates,
      showAchievements: row.show_achievements,
      showSkills: row.show_skills,
      showGoals: row.show_goals,
      showHobbies: row.show_hobbies,
      theme: row.theme ?? "indigo-purple",
      customUsername: row.custom_username ?? "",
    },
    preferences: {
      profilePublic: row.profile_public,
      showEmail: row.show_email,
      showPhone: row.show_phone,
      recruiterMode: row.recruiter_mode,
      indexSearch: row.index_search,
      notifyProfileViews: row.notify_profile_views,
      notifyCertVerified: row.notify_cert_verified,
      notifyWeeklyDigest: row.notify_weekly_digest,
      notifyRecruiterContact: row.notify_recruiter_contact,
      notifySystemUpdates: row.notify_system_updates,
    },
    profileViews: row.profile_views ?? 0,
    activity,
    updatedAt: row.updated_at ?? new Date().toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCertificateRow(row: any): Certificate {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    date: row.date,
    url: row.url,
    imageUrl: row.image_url ?? null,
    status: row.status,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAchievementRow(row: any): Achievement {
  return {
    id: row.id,
    title: row.title,
    eventName: row.event_name,
    date: row.date,
    description: row.description,
    imageUrl: row.image_url ?? null,
    createdAt: row.created_at,
  }
}

function relativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

async function pushActivity(userId: string, text: string) {
  const supabase = createClient()
  await supabase.from("activity").insert({ user_id: userId, text })
  // Keep only the most recent 8 entries per user.
  const { data } = await supabase
    .from("activity")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  const stale = (data ?? []).slice(8).map((r) => r.id)
  if (stale.length) {
    await supabase.from("activity").delete().in("id", stale)
  }
}

const getCurrentUserId = cache(async (): Promise<string> => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return user.id
})

// ---- Public reads ----

/**
 * Wrapped in React's `cache()` so it's only fetched ONCE per request, no
 * matter how many Server Components call it. The dashboard layout (sidebar
 * name/avatar/tier) and every individual dashboard page each call
 * getStudent() independently — without this memoization, every single
 * dashboard page view was making the full auth check + 4 parallel table
 * queries TWICE (layout + page), which is the main reason navigation felt
 * slow even after the middleware/action fixes.
 */
export const getStudent = cache(async (): Promise<StudentData> => {
  const supabase = createClient()
  const userId = await getCurrentUserId()

  const [{ data: profile, error }, { data: certs }, { data: achs }, { data: acts }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("certificates").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("activity").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(8),
  ])

  if (error || !profile) throw new Error(error?.message ?? "Profile not found")

  return mapProfileRow(
    profile,
    (certs ?? []).map(mapCertificateRow),
    (achs ?? []).map(mapAchievementRow),
    (acts ?? []).map((a) => ({ id: a.id, text: a.text, date: relativeDate(a.created_at) }))
  )
})

export async function getPublicStudentByUsername(username: string): Promise<StudentData | null> {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("custom_username", username)
    .eq("profile_public", true)
    .single()

  if (!profile) return null

  const [{ data: certs }, { data: achs }] = await Promise.all([
    supabase.from("certificates").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }),
  ])

  return mapProfileRow(profile, (certs ?? []).map(mapCertificateRow), (achs ?? []).map(mapAchievementRow), [])
}

export function computeProfileCompletion(d: StudentData): number {
  const checks = [
    !!d.fullName, !!d.headline, !!d.bio, !!d.email, !!d.phone, !!d.location,
    d.skills.length > 0, d.hobbies.length > 0, d.careerGoals.length > 0,
    !!d.education.cgpa, !!d.education.academicSummary,
    d.certificates.length > 0, d.achievements.length > 0,
    d.verification.tenth === "verified", d.verification.twelfth === "verified", d.verification.identity === "verified",
    !!d.avatarDataUrl,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}

// ---- Mutations ----

export async function updateProfile(partial: Pick<StudentData, "fullName" | "headline" | "bio" | "email" | "phone" | "location" | "skills" | "hobbies" | "languages" | "careerGoals">): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase
    .from("profiles")
    .update({
      full_name: partial.fullName,
      headline: partial.headline,
      bio: partial.bio,
      email: partial.email,
      phone: partial.phone,
      location: partial.location,
      skills: partial.skills,
      hobbies: partial.hobbies,
      languages: partial.languages,
      career_goals: partial.careerGoals,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
  await pushActivity(userId, "Profile information updated.")
  return getStudent()
}

export async function setAvatar(url: string): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("profiles").update({ avatar_url: url, updated_at: new Date().toISOString() }).eq("id", userId)
  await pushActivity(userId, "Profile photo updated.")
  return getStudent()
}

export async function updateEducation(partial: Education): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase
    .from("profiles")
    .update({
      university_name: partial.universityName,
      college_name: partial.collegeName,
      degree: partial.degree,
      branch: partial.branch,
      current_semester: partial.currentSemester,
      graduation_year: partial.graduationYear,
      cgpa: partial.cgpa,
      tenth_percentage: partial.tenthPercentage,
      twelfth_percentage: partial.twelfthPercentage,
      academic_summary: partial.academicSummary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
  await pushActivity(userId, "Academic information updated.")
  return getStudent()
}

export async function addCertificate(cert: Omit<Certificate, "id" | "status" | "createdAt">): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("certificates").insert({
    user_id: userId,
    title: cert.title,
    organization: cert.organization,
    date: cert.date,
    url: cert.url,
    image_url: cert.imageUrl,
    status: "pending",
  })
  await pushActivity(userId, `Certificate "${cert.title}" submitted for verification.`)
  return getStudent()
}

export async function deleteCertificate(id: string): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("certificates").delete().eq("id", id).eq("user_id", userId)
  return getStudent()
}

export async function addAchievement(ach: Omit<Achievement, "id" | "createdAt">): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("achievements").insert({
    user_id: userId,
    title: ach.title,
    event_name: ach.eventName,
    date: ach.date,
    description: ach.description,
    image_url: ach.imageUrl,
  })
  await pushActivity(userId, `Achievement "${ach.title}" added.`)
  return getStudent()
}

export async function deleteAchievement(id: string): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("achievements").delete().eq("id", id).eq("user_id", userId)
  return getStudent()
}

export async function updateBuilderSettings(partial: Partial<BuilderSettings>): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (partial.showEducation !== undefined) update.show_education = partial.showEducation
  if (partial.showCgpa !== undefined) update.show_cgpa = partial.showCgpa
  if (partial.showTenth !== undefined) update.show_tenth = partial.showTenth
  if (partial.showTwelfth !== undefined) update.show_twelfth = partial.showTwelfth
  if (partial.showCertificates !== undefined) update.show_certificates = partial.showCertificates
  if (partial.showAchievements !== undefined) update.show_achievements = partial.showAchievements
  if (partial.showSkills !== undefined) update.show_skills = partial.showSkills
  if (partial.showGoals !== undefined) update.show_goals = partial.showGoals
  if (partial.showHobbies !== undefined) update.show_hobbies = partial.showHobbies
  if (partial.theme !== undefined) update.theme = partial.theme
  if (partial.customUsername !== undefined) update.custom_username = partial.customUsername
  await supabase.from("profiles").update(update).eq("id", userId)
  return getStudent()
}

export async function updatePreferences(partial: Partial<Preferences>): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (partial.profilePublic !== undefined) update.profile_public = partial.profilePublic
  if (partial.showEmail !== undefined) update.show_email = partial.showEmail
  if (partial.showPhone !== undefined) update.show_phone = partial.showPhone
  if (partial.recruiterMode !== undefined) update.recruiter_mode = partial.recruiterMode
  if (partial.indexSearch !== undefined) update.index_search = partial.indexSearch
  if (partial.notifyProfileViews !== undefined) update.notify_profile_views = partial.notifyProfileViews
  if (partial.notifyCertVerified !== undefined) update.notify_cert_verified = partial.notifyCertVerified
  if (partial.notifyWeeklyDigest !== undefined) update.notify_weekly_digest = partial.notifyWeeklyDigest
  if (partial.notifyRecruiterContact !== undefined) update.notify_recruiter_contact = partial.notifyRecruiterContact
  if (partial.notifySystemUpdates !== undefined) update.notify_system_updates = partial.notifySystemUpdates
  await supabase.from("profiles").update(update).eq("id", userId)
  return getStudent()
}

export async function submitIdentityVerification(): Promise<StudentData> {
  const userId = await getCurrentUserId()
  const supabase = createClient()
  await supabase.from("profiles").update({ identity_status: "review", updated_at: new Date().toISOString() }).eq("id", userId)
  await pushActivity(userId, "Identity document submitted for live verification review.")
  return getStudent()
}

export async function incrementProfileViews(username: string): Promise<void> {
  const supabase = createClient()
  const { data } = await supabase.from("profiles").select("id, profile_views").eq("custom_username", username).single()
  if (data) {
    await supabase.from("profiles").update({ profile_views: (data.profile_views ?? 0) + 1 }).eq("id", data.id)
  }
}

export async function isUsernameTaken(username: string, currentUsername: string): Promise<boolean> {
  if (username === currentUsername) return false
  const supabase = createClient()
  const { data } = await supabase.from("profiles").select("id").eq("custom_username", username).maybeSingle()
  return !!data
}