"use client"

import { useRef, useState, useEffect } from "react"
import { useSync } from "@/components/sync-context"
import { SectionCard } from "@/components/sync-ui"
import { Button } from "@/components/ui/button"
import { MYTH_ANSWERS, SPECIALISTS } from "@/lib/sync-data"
import { cn } from "@/lib/utils"
import { Check, Pill, Plus, Send, Shield, ShieldCheck, Star, Stethoscope } from "lucide-react"

const SLOTS = ["Morning", "Afternoon", "Evening", "Bedtime"]

export function CareCircle() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground text-balance md:text-3xl">
          Care Circle
        </h1>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Your routine, your questions, your community of care.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <MedicationTimeline />
        <div className="space-y-6">
          <MythbusterChat />
          <SpecialistDirectory />
        </div>
      </div>
    </div>
  )
}
function MedicationTimeline() {
  const { medications, addMedication, toggleMedTaken, removeMedication, resetMedication } = useSync()
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState(1)
  const [time, setTime] = useState("09:00")

  const add = () => {
    if (!name.trim()) return
    addMedication({ name, dosage, frequency, time }) // frequency and time are new
    setName(""); setDosage(""); setFrequency(1)
  }

  return (
    <SectionCard title="Smart Medication Timeline" subtitle="Build your routine" icon={<Pill className="size-5" />}>
      {/* Input Area */}
      <div className="space-y-3 rounded-2xl bg-secondary/40 p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medicine name" className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none" />
        <div className="flex gap-2">
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage" className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-2xl border border-border bg-card px-3 text-sm" />
        </div>
        <div className="flex items-center gap-3 px-2">
          <span className="text-xs text-muted-foreground">Times/day:</span>
          <input type="number" min={1} max={5} value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-16 rounded-lg border px-2 py-1 text-center text-sm" />
        </div>
        <Button onClick={add} className="w-full rounded-2xl">Add to timeline</Button>
      </div>

      {/* List Area */}
      <div className="mt-5 space-y-3">
        {medications.map((med) => (
          <div key={med.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex gap-1">
              {/* If frequency is undefined (old data), fallback to 1 */}
              {[...Array(med.frequency || 1)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => toggleMedTaken(med.id)}
                  className={cn("size-6 rounded-full border-2 transition-all", i < (med.takenCount || 0) ? "bg-primary border-primary" : "border-border")}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {med.name} <span className="text-muted-foreground text-xs">{med.dosage} · {med.time}</span>
              </p>
            </div>
            <button onClick={() => removeMedication(med.id)} className="text-muted-foreground hover:text-red-500">✕</button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={resetMedication} className="w-full mt-4">Reset Daily Progress</Button>
      </div>
    </SectionCard>
  )
}

function MythbusterChat() {
  const { messages, sendMessage } = useSync()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const tags = Object.keys(MYTH_ANSWERS)

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    const answer =
      MYTH_ANSWERS[t] ??
      "Thank you for trusting this space with your question. Whatever you're feeling is valid. PMOS is manageable with steady care, and you are never alone in it — consider bringing this to one of the verified specialists below for personalised guidance."
    sendMessage(t, answer)
    setInput("")
  }

  return (
    <SectionCard
      title="Stigma-Free Mythbuster Chatbox"
      subtitle="Ask anything without judgment or societal stigma"
      icon={<Shield className="size-5" />}
    >
      <div ref={scrollRef} className="no-scrollbar max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-secondary/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border",
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => send(tag)}
            className="rounded-full border border-primary/40 bg-accent/40 px-3 py-1.5 text-xs font-medium text-accent-foreground transition hover:bg-accent"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your question…"
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <Button onClick={() => send(input)} className="rounded-2xl px-4" disabled={!input.trim()}>
          <Send className="size-4" />
        </Button>
      </div>
    </SectionCard>
  )
}

function SpecialistDirectory() {
  return (
    <SectionCard
      title="Verified Specialist Directory"
      subtitle="Community-reviewed gynecologists & endocrinologists"
      icon={<Stethoscope className="size-5" />}
    >
      <div className="space-y-3">
        {SPECIALISTS.map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-semibold text-primary-foreground">
              {doc.name.split(" ")[1]?.[0] ?? doc.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {doc.name}
                <ShieldCheck className="size-3.5 text-primary" />
              </p>
              <p className="truncate text-xs text-muted-foreground">{doc.specialty}</p>
              <p className="text-xs text-muted-foreground">{doc.location}</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-sm font-medium text-foreground">
                <Star className="size-3.5 fill-primary text-primary" />
                {doc.rating}
              </p>
              <p className="text-xs text-muted-foreground">{doc.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
