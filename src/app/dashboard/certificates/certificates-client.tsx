"use client"

import React, { useRef, useState, useTransition } from "react"
import { Plus, ExternalLink, Trash2, Award, Loader2, Camera, X } from "lucide-react"
import { VerificationBadge } from "@/components/ui/CustomComponents"
import { addCertificateAction, deleteCertificateAction } from "@/lib/actions"
import type { Certificate } from "@/lib/db"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card } from "@/components/ui/Card"
import { Input, FormField } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { EmptyState } from "@/components/ui/EmptyState"

export function CertificatesClient({ certificates }: { certificates: Certificate[] }) {
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
      const res = await addCertificateAction(formData)
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
      await deleteCertificateAction(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Certificates"
        description="Manage your course and professional certificates."
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        }
      />

      {certificates.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" description="Add your first one to start building your verified credential record." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <Card key={cert.id} padding="none" hover="lift" className="overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                {cert.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cert.imageUrl} alt={cert.title} className="h-full w-full object-cover" />
                ) : (
                  <Award className="h-12 w-12 text-primary" />
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-snug">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.organization}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.date}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <VerificationBadge status={cert.status} />
                  <div className="flex gap-2">
                    {cert.url && cert.url !== "#" && (
                      <a href={cert.url} target="_blank" rel="noreferrer" className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(cert.id)}
                      disabled={isPending && deletingId === cert.id}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {isPending && deletingId === cert.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onOpenChange={(open) => (open ? setShowModal(true) : closeModal())} title="Add Certificate">
        <form ref={formRef} action={handleAdd} className="space-y-4">
          <FormField label="Certificate Photo (optional)">
            <input ref={photoInputRef} type="file" name="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            {photoPreview ? (
              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Certificate preview" className="h-full w-full object-cover" />
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
          <FormField label="Certificate Title">
            <Input name="title" required placeholder="e.g. AWS Cloud Practitioner" />
          </FormField>
          <FormField label="Organization">
            <Input name="organization" required placeholder="e.g. Amazon Web Services" />
          </FormField>
          <FormField label="Issue Date">
            <Input name="date" placeholder="e.g. Jan 2026" />
          </FormField>
          <FormField label="Certificate URL">
            <Input name="url" type="url" placeholder="https://..." />
          </FormField>
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={isPending}>
              Add Certificate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
