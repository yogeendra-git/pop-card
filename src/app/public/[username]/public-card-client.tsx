"use client"

import React, { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { VerificationBadge } from "@/components/ui/CustomComponents"
import { incrementProfileViewsAction } from "@/lib/actions"
import type { StudentData } from "@/lib/db"
import { ShieldCheck, GraduationCap, Award, Trophy, Share2, Download, Briefcase, Sparkles, LayoutGrid, Target, Heart, Check } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

/**
 * Redesigned using popcard-platform's premium card aesthetic (gradient
 * banner, glass elevation, gradient identity avatar) while keeping the
 * exact data flow, recruiter-mode toggle, share/print/view-count logic
 * from the original product page untouched.
 */
export function PublicCardClient({ data, username, origin }: { data: StudentData; username: string; origin: string }) {
  const [interviewMode, setInterviewMode] = useState(false)
  const [shared, setShared] = useState(false)
  const visible = data.builderSettings
  const profileUrl = `${origin}/public/${username}`

  const overallStatus =
    data.verification.identity === "verified" && data.verification.tenth === "verified" && data.verification.twelfth === "verified"
      ? "verified"
      : data.verification.identity === "rejected"
      ? "rejected"
      : data.verification.identity === "review"
      ? "review"
      : "pending"

  useEffect(() => {
    incrementProfileViewsAction(username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: `${data.fullName} — POP Card`, text: data.headline, url: profileUrl })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(profileUrl)
    } catch {
      // ignore
    }
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const handleDownloadResume = () => {
    window.print()
  }

  return (
    <div className="bg-background text-foreground min-h-screen pb-16">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
        }
      `}</style>

      {/* Banner */}
      <div className="h-44 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] animate-gradient relative shadow-inner print:hidden">
        <div className="absolute inset-0 bg-grid-glow opacity-10" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setInterviewMode(!interviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all shadow-sm ${
              interviewMode ? "bg-white text-primary border-white" : "bg-card/90 text-foreground border-border backdrop-blur hover:bg-card"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            {interviewMode ? "Disable Recruiter Mode" : "Recruiter Mode"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 print:mt-4 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Identity card */}
          <Card hover="none" className="shadow-elevated flex flex-col items-center text-center">
            {data.avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.avatarDataUrl} alt={data.fullName} className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-md" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-secondary font-black text-3xl text-primary-foreground flex items-center justify-center border-4 border-background shadow-glow">
                {initialsOf(data.fullName)}
              </div>
            )}
            <h2 className="text-xl font-bold mt-4 tracking-tight font-display">{data.fullName}</h2>
            <p className="text-xs text-muted-foreground font-medium px-2 mt-1 leading-normal">{data.headline}</p>
            <div className="mt-3"><VerificationBadge status={overallStatus} /></div>
            <div className="w-full border-t border-border mt-5 pt-5 space-y-2 text-xs text-muted-foreground text-left">
              <p className="flex justify-between"><span>Location:</span><span className="text-foreground font-medium">{data.location}</span></p>
              {data.preferences.showEmail && <p className="flex justify-between"><span>Email:</span><span className="text-foreground font-medium">{data.email}</span></p>}
              {data.preferences.showPhone && <p className="flex justify-between"><span>Phone:</span><span className="text-foreground font-medium">{data.phone}</span></p>}
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-5 print:hidden">
              <Button variant="outline" onClick={handleDownloadResume} className="py-2">
                <Download className="h-3.5 w-3.5" /> Resume
              </Button>
              <Button onClick={handleShare} className="py-2">
                {shared ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {shared ? "Copied!" : "Share"}
              </Button>
            </div>
          </Card>

          {/* Languages */}
          {!interviewMode && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((l) => (
                  <Badge key={l} variant="neutral">{l}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* QR Code */}
          {!interviewMode && (
            <Card className="flex flex-col items-center space-y-3 print:hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scan to View Profile</span>
              <div className="p-2 bg-white rounded-xl border border-border shadow-inner">
                <QRCodeSVG value={profileUrl} size={110} level="M" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground break-all text-center">{profileUrl.replace(/^https?:\/\//, "")}</span>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <Card>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><Sparkles className="h-4 w-4 text-primary" /> About Me</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.bio}</p>
          </Card>

          {/* Education */}
          {visible.showEducation && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4"><GraduationCap className="h-4 w-4 text-primary" /> Education</h3>
              <div className="border-l-2 border-primary pl-4 space-y-1 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-foreground">{data.education.degree} in {data.education.branch}</h4>
                  <VerificationBadge status={data.verification.tenth === "verified" && data.verification.twelfth === "verified" ? "verified" : "pending"} />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{data.education.collegeName} · {data.education.universityName}</p>
                <p className="text-xs text-muted-foreground">Class of {data.education.graduationYear} · {data.education.currentSemester}</p>
                <p className="text-sm text-muted-foreground pt-1 leading-relaxed">{data.education.academicSummary}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {visible.showCgpa && (
                  <div className="p-3 bg-muted rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">CGPA</span>
                    <span className="text-xl font-black text-primary font-display">{data.education.cgpa}</span>
                  </div>
                )}
                {visible.showTwelfth && (
                  <div className="p-3 bg-muted rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">12th</span>
                    <span className="text-xl font-black text-foreground font-display">{data.education.twelfthPercentage}</span>
                  </div>
                )}
                {visible.showTenth && (
                  <div className="p-3 bg-muted rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">10th</span>
                    <span className="text-xl font-black text-foreground font-display">{data.education.tenthPercentage}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Skills */}
          {visible.showSkills && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><LayoutGrid className="h-4 w-4 text-primary" /> Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="primary" size="md">
                    {skill} <ShieldCheck className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Goals */}
          {visible.showGoals && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><Target className="h-4 w-4 text-primary" /> Career Goals</h3>
              <ul className="space-y-2">
                {data.careerGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Hobbies */}
          {visible.showHobbies && !interviewMode && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><Heart className="h-4 w-4 text-destructive" /> Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby) => (
                  <Badge key={hobby} variant="destructive">{hobby}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Certificates */}
          {visible.showCertificates && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4"><Award className="h-4 w-4 text-primary" /> Course Certificates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.certificates.map((cert) => (
                  <div key={cert.id} className="p-4 bg-muted border border-border rounded-xl flex flex-col justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-snug">{cert.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{cert.organization} · {cert.date}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <VerificationBadge status={cert.status} />
                      {cert.url && cert.url !== "#" && (
                        <a href={cert.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">View Certificate</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Achievements */}
          {visible.showAchievements && (
            <Card>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4"><Trophy className="h-4 w-4 text-warning" /> Achievements</h3>
              <div className="space-y-4">
                {data.achievements.map((ach) => (
                  <div key={ach.id} className="border-l-2 border-border pl-4 relative">
                    <div className="absolute h-2.5 w-2.5 rounded-full bg-primary -left-[5.5px] top-1.5" />
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="text-xs font-bold text-foreground">{ach.title}</h4>
                      <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">{ach.date}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-primary mt-0.5">{ach.eventName}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">{ach.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
