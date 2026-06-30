"use server"

import { revalidatePath } from "next/cache"
import * as db from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

function paths(username: string | null | undefined) {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard/education")
  revalidatePath("/dashboard/certificates")
  revalidatePath("/dashboard/achievements")
  revalidatePath("/dashboard/builder")
  revalidatePath("/dashboard/verification")
  revalidatePath("/dashboard/settings")
  if (username) revalidatePath(`/public/${username}`)
}

/**
 * Uploads a File to a user-scoped folder in the given Supabase Storage
 * bucket (e.g. "avatars/<uid>/169...-photo.jpg") and returns its public
 * URL. Storage RLS policies (supabase/schema.sql) only allow a user to
 * write inside a folder named after their own auth uid, which is why the
 * path always starts with `${userId}/`.
 */
async function uploadUserFile(bucket: "avatars" | "certificates" | "achievements", file: File): Promise<string | null> {
  if (!file || file.size === 0) return null

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const ext = file.name.split(".").pop() || "jpg"
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function updateAccountBasicsAction(data: { fullName: string; email: string; phone: string }) {
  const current = await db.getStudent()
  const updated = await db.updateProfile({
    fullName: data.fullName,
    headline: current.headline,
    bio: current.bio,
    email: data.email,
    phone: data.phone,
    location: current.location,
    skills: current.skills,
    hobbies: current.hobbies,
    languages: current.languages,
    careerGoals: current.careerGoals,
  })
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function updateProfileAction(formData: FormData) {
  const skills = JSON.parse(String(formData.get("skills") || "[]"))
  const hobbies = JSON.parse(String(formData.get("hobbies") || "[]"))
  const languages = JSON.parse(String(formData.get("languages") || "[]"))
  const careerGoals = JSON.parse(String(formData.get("careerGoals") || "[]"))

  const updated = await db.updateProfile({
    fullName: String(formData.get("fullName") || "").trim(),
    headline: String(formData.get("headline") || ""),
    bio: String(formData.get("bio") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    location: String(formData.get("location") || ""),
    skills,
    hobbies,
    languages,
    careerGoals,
  })
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function updateAvatarAction(formData: FormData) {
  const file = formData.get("avatar") as File | null
  if (!file) return { ok: false, error: "No file provided." }
  try {
    const url = await uploadUserFile("avatars", file)
    if (!url) return { ok: false, error: "Upload failed." }
    const updated = await db.setAvatar(url)
    paths(updated.builderSettings.customUsername)
    return { ok: true, url }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed." }
  }
}

export async function updateEducationAction(formData: FormData) {
  const updated = await db.updateEducation({
    universityName: String(formData.get("universityName") || ""),
    collegeName: String(formData.get("collegeName") || ""),
    degree: String(formData.get("degree") || ""),
    branch: String(formData.get("branch") || ""),
    currentSemester: String(formData.get("currentSemester") || ""),
    graduationYear: String(formData.get("graduationYear") || ""),
    cgpa: String(formData.get("cgpa") || ""),
    tenthPercentage: String(formData.get("tenthPercentage") || ""),
    twelfthPercentage: String(formData.get("twelfthPercentage") || ""),
    academicSummary: String(formData.get("academicSummary") || ""),
  })
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function addCertificateAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim()
  const organization = String(formData.get("organization") || "").trim()
  if (!title || !organization) return { ok: false, error: "Title and organization are required." }

  let imageUrl: string | null = null
  const photo = formData.get("photo") as File | null
  if (photo && photo.size > 0) {
    try {
      imageUrl = await uploadUserFile("certificates", photo)
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Photo upload failed." }
    }
  }

  const updated = await db.addCertificate({
    title,
    organization,
    date: String(formData.get("date") || "").trim() || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    url: String(formData.get("url") || "").trim() || "#",
    imageUrl,
  })
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function deleteCertificateAction(id: string) {
  const updated = await db.deleteCertificate(id)
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function addAchievementAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim()
  const eventName = String(formData.get("eventName") || "").trim()
  if (!title || !eventName) return { ok: false, error: "Title and event name are required." }

  let imageUrl: string | null = null
  const photo = formData.get("photo") as File | null
  if (photo && photo.size > 0) {
    try {
      imageUrl = await uploadUserFile("achievements", photo)
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Photo upload failed." }
    }
  }

  const updated = await db.addAchievement({
    title,
    eventName,
    date: String(formData.get("date") || "").trim() || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    description: String(formData.get("description") || "").trim(),
    imageUrl,
  })
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function deleteAchievementAction(id: string) {
  const updated = await db.deleteAchievement(id)
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function updateBuilderSettingsAction(partial: Partial<db.BuilderSettings>) {
  // Needs the pre-change username to also invalidate the old public profile
  // URL if it's being renamed, so this one genuinely needs a fetch before
  // the mutation (unlike the other actions above).
  const before = await db.getStudent()
  const previousUsername = before.builderSettings.customUsername
  await db.updateBuilderSettings(partial)
  paths(previousUsername)
  if (partial.customUsername) paths(partial.customUsername)
  return { ok: true }
}

export async function updatePreferencesAction(partial: Partial<db.Preferences>) {
  const updated = await db.updatePreferences(partial)
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function submitIdentityVerificationAction() {
  const updated = await db.submitIdentityVerification()
  paths(updated.builderSettings.customUsername)
  return { ok: true }
}

export async function incrementProfileViewsAction(username: string) {
  const student = await db.getPublicStudentByUsername(username)
  if (!student) return { ok: false }
  await db.incrementProfileViews(username)
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function signOutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return { ok: true }
}