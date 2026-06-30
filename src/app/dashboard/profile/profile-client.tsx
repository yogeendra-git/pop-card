"use client"

import React, { useRef, useState, useTransition } from "react"
import { Plus, X, Loader2, Check, Camera } from "lucide-react"
import { updateProfileAction, updateAvatarAction } from "@/lib/actions"
import { PageHeader } from "@/components/ui/PageHeader"
import { DashboardCard } from "@/components/ui/DashboardCard"
import { Input, FormField } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

export function ProfileClient(props: {
  fullName: string
  headline: string
  bio: string
  email: string
  phone: string
  location: string
  skills: string[]
  hobbies: string[]
  languages: string[]
  careerGoals: string[]
  avatarDataUrl: string | null
}) {
  const [fullName, setFullName] = useState(props.fullName)
  const [headline, setHeadline] = useState(props.headline)
  const [bio, setBio] = useState(props.bio)
  const [email, setEmail] = useState(props.email)
  const [phone, setPhone] = useState(props.phone)
  const [location, setLocation] = useState(props.location)
  const [skills, setSkills] = useState(props.skills)
  const [newSkill, setNewSkill] = useState("")
  const [hobbies, setHobbies] = useState(props.hobbies)
  const [newHobby, setNewHobby] = useState("")
  const [languages, setLanguages] = useState(props.languages)
  const [newLanguage, setNewLanguage] = useState("")
  const [careerGoals, setCareerGoals] = useState(props.careerGoals)
  const [avatarDataUrl, setAvatarDataUrl] = useState(props.avatarDataUrl)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()])
      setNewHobby("")
    }
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()])
      setNewLanguage("")
    }
  }

  const handlePhotoClick = () => fileInputRef.current?.click()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5MB.")
      return
    }
    // Show an instant local preview while the real file uploads to Supabase
    // Storage in the background (see updateAvatarAction in lib/actions.ts).
    const localPreview = URL.createObjectURL(file)
    setAvatarDataUrl(localPreview)
    setAvatarUploading(true)
    const formData = new FormData()
    formData.set("avatar", file)
    startTransition(async () => {
      const res = await updateAvatarAction(formData)
      if (res.ok && res.url) {
        setAvatarDataUrl(res.url)
      }
      setAvatarUploading(false)
    })
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.set("fullName", fullName)
    formData.set("headline", headline)
    formData.set("bio", bio)
    formData.set("email", email)
    formData.set("phone", phone)
    formData.set("location", location)
    formData.set("skills", JSON.stringify(skills))
    formData.set("hobbies", JSON.stringify(hobbies))
    formData.set("languages", JSON.stringify(languages))
    formData.set("careerGoals", JSON.stringify(careerGoals.filter((g) => g.trim())))

    startTransition(async () => {
      await updateProfileAction(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader title="My Profile" description="Manage your personal and professional information." />

      <DashboardCard title="Personal Information">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            {avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarDataUrl} alt="Profile photo" className="h-20 w-20 rounded-full object-cover border-2 border-card shadow-md" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-black text-2xl flex items-center justify-center shadow-glow">
                {initialsOf(fullName)}
              </div>
            )}
            {avatarUploading && (
              <div className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <Button type="button" variant="secondary" size="sm" onClick={handlePhotoClick}>
              <Camera className="h-3.5 w-3.5" /> Upload Photo
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1.5">JPG or PNG, up to 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormField>
          <FormField label="Headline">
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Phone Number">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <FormField label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </FormField>
          <FormField label="Bio" className="sm:col-span-2">
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </FormField>
        </div>
      </DashboardCard>

      <DashboardCard title="Professional Information">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="primary">
                {skill}
                <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={addSkill}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Hobbies</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary">
                {hobby}
                <button type="button" onClick={() => setHobbies(hobbies.filter((h) => h !== hobby))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHobby())}
              placeholder="Add a hobby..."
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={addHobby}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Languages</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {languages.map((language) => (
              <Badge key={language} variant="info">
                {language}
                <button type="button" onClick={() => setLanguages(languages.filter((l) => l !== language))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
              placeholder="Add a language..."
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={addLanguage}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Career Goals</label>
          <div className="space-y-2">
            {careerGoals.map((goal, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={goal}
                  onChange={(e) => setCareerGoals(careerGoals.map((g, gi) => (gi === i ? e.target.value : g)))}
                  className="flex-1"
                />
                <button type="button" onClick={() => setCareerGoals(careerGoals.filter((_, gi) => gi !== i))} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setCareerGoals([...careerGoals, ""])} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add a career goal
            </button>
          </div>
        </div>
      </DashboardCard>

      <Button onClick={handleSave} loading={isPending} size="lg">
        {saved ? <Check className="h-4 w-4" /> : null}
        {saved ? "Saved" : "Save Changes"}
      </Button>
    </div>
  )
}