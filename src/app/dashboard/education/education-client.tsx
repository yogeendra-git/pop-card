"use client"

import React, { useState, useTransition } from "react"
import { Check } from "lucide-react"
import { updateEducationAction } from "@/lib/actions"
import type { Education } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { DashboardCard } from "@/components/ui/DashboardCard"
import { Input, FormField } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"

const FIELDS: { key: keyof Education; label: string }[] = [
  { key: "universityName", label: "University Name" },
  { key: "collegeName", label: "College Name" },
  { key: "degree", label: "Degree" },
  { key: "branch", label: "Branch / Specialization" },
  { key: "currentSemester", label: "Current Semester" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "cgpa", label: "CGPA" },
  { key: "tenthPercentage", label: "10th Percentage" },
  { key: "twelfthPercentage", label: "12th / PU Percentage" },
]

export function EducationClient({ education }: { education: Education }) {
  const [form, setForm] = useState(education)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const set = (key: keyof Education, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = () => {
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.set(k, v))
    startTransition(async () => {
      await updateEducationAction(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader title="Education" description="Your academic details are used for verification and profile display." />

      <DashboardCard title="Academic Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map((field) => (
            <FormField key={field.key} label={field.label}>
              <Input value={form[field.key]} onChange={(e) => set(field.key, e.target.value)} />
            </FormField>
          ))}
          <FormField label="Academic Summary" className="sm:col-span-2">
            <Textarea value={form.academicSummary} onChange={(e) => set("academicSummary", e.target.value)} rows={3} />
          </FormField>
        </div>
        <Button onClick={handleSave} loading={isPending}>
          {saved ? <Check className="h-4 w-4" /> : null}
          {saved ? "Saved" : "Save Academic Information"}
        </Button>
      </DashboardCard>
    </div>
  )
}
