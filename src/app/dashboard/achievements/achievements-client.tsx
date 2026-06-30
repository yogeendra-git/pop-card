"use client"

import React, { useRef, useState, useTransition } from "react"
import { Plus, Trophy, X, Loader2, Camera } from "lucide-react"
import { addAchievementAction, deleteAchievementAction } from "@/lib/actions"
import type { Achievement } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card } from "@/components/ui/Card"
import { Input, FormField } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { EmptyState } from "@/components/ui/EmptyState"

export function AchievementsClient({ achievements }: { achievements: Achievement[] }) {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image under 5MB.")
      e.target.value = ""
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  const closeModal = () => {
    setShowModal(false)
    clearPhoto()
  }

  const handleAdd = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await addAchievementAction(formData)
      if (res.ok) {
        formRef.current?.reset()
        clearPhoto()
        setShowModal(false)
      } else {
        setError(res.error || "Something went wrong.")
      }
    })
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      await deleteAchievementAction(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Achievements"
        description="Showcase your competition wins and awards."
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Add Achievement
          </Button>
        }
      />

      {achievements.length === 0 ? (
        <EmptyState icon={Trophy} title="No achievements yet" description="Add your first competition win or award." />
      ) : (
        <div className="relative space-y-6 before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-border">
          {achievements.map((ach) => (
            <div key={ach.id} className="relative flex gap-6 pl-14">
              <div className="absolute left-0 top-1 h-10 w-10 rounded-full bg-gradient-to-tr from-warning to-warning/60 flex items-center justify-center shadow-md z-10 overflow-hidden">
                {ach.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ach.imageUrl} alt={ach.title} className="h-full w-full object-cover" />
                ) : (
                  <Trophy className="h-5 w-5 text-white" />
                )}
              </div>
              <Card hover="lift" className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{ach.title}</h3>
                    <p className="text-xs font-semibold text-primary mt-0.5">{ach.eventName}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{ach.description}</p>
                    {ach.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ach.imageUrl} alt={ach.title} className="mt-3 max-h-48 w-auto rounded-lg border border-border object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-muted-foreground">{ach.date}</span>
                    <button
                      onClick={() => handleDelete(ach.id)}
                      disabled={isPending && deletingId === ach.id}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {isPending && deletingId === ach.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onOpenChange={(open) => (open ? setShowModal(true) : closeModal())} title="Add Achievement">
        <form ref={formRef} action={handleAdd} className="space-y-4">
          <FormField label="Achievement Photo (optional)">
            <input ref={photoInputRef} type="file" name="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            {photoPreview ? (
              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Achievement preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-1.5 right-1.5 p-1 bg-foreground/60 text-background rounded-full hover:bg-foreground/80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-full h-24 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span className="text-xs font-semibold">Upload Photo</span>
              </button>
            )}
            <p className="text-[10px] text-muted-foreground mt-1.5">JPG or PNG, up to 5MB.</p>
          </FormField>
          <FormField label="Achievement Title">
            <Input name="title" required placeholder="e.g. 1st Place - Hackathon" />
          </FormField>
          <FormField label="Event Name">
            <Input name="eventName" required placeholder="e.g. Smart India Hackathon" />
          </FormField>
          <FormField label="Date">
            <Input name="date" placeholder="e.g. Dec 2025" />
          </FormField>
          <FormField label="Description">
            <Textarea name="description" rows={3} placeholder="Describe your achievement..." />
          </FormField>
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={isPending}>
              Save Achievement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
