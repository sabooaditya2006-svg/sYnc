"use client"

import { useRef, useState, useEffect } from "react"
import { useSync } from "@/components/sync-context"
import { SectionCard } from "@/components/sync-ui"
import { Button } from "@/components/ui/button"
import { SPECIALISTS } from "@/lib/sync-data"
import { cn } from "@/lib/utils"
import { Pill, Send, Shield, ShieldCheck, Star, Stethoscope, Trash2, RotateCcw } from "lucide-react"
import { specialistsData } from '../specialistsData';
function MedicationTimeline() {
  const { medications, addMedication, toggleMedTaken, removeMedication, resetMedication } = useSync()
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState(1)
  const [times, setTimes] = useState<string[]>(["09:00"])

  const add = () => {
    if (!name.trim()) return
    addMedication({ name, dosage, frequency, times: times.slice(0, frequency) })
    setName(""); setDosage(""); setFrequency(1); setTimes(["09:00"])
  }

  return (
    <SectionCard title="Smart Medication Timeline" subtitle="Set schedule for each dose" icon={<Pill className="size-5" />}>
      <div className="space-y-3 rounded-2xl bg-secondary/40 p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medicine name" className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none" />
        <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (e.g. 500mg)" className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none" />
        
        <div className="flex items-center gap-3">
          <label className="text-xs">Frequency per day:</label>
          <input type="number" min={1} max={5} value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-16 rounded-lg border p-1 text-sm text-center" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: frequency }).map((_, i) => (
            <input 
              key={i} 
              type="time" 
              value={times[i] || "09:00"} 
              onChange={(e) => {
                const newTimes = [...times];
                newTimes[i] = e.target.value;
                setTimes(newTimes);
              }}
              className="rounded-xl border p-2 text-sm bg-card" 
            />
          ))}
        </div>
        <Button onClick={add} className="w-full rounded-2xl">Add to timeline</Button>
      </div>

      <div className="mt-5 space-y-3">
        {(medications || []).map((med) => (
          <div key={med.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex gap-1">
              {(med.times || []).map((time, i) => (
                <button
                  key={i}
                  onClick={() => toggleMedTaken(med.id)}
                  className={cn("size-6 rounded-full border-2 transition-all", i < (med.takenCount || 0) ? "bg-primary border-primary" : "border-border")}
                  title={`Scheduled for ${time}`}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{med.name} <span className="text-xs text-muted-foreground">{med.dosage}</span></p>
            </div>
            <button onClick={() => removeMedication(med.id)} className="text-muted-foreground hover:text-red-500 transition"><Trash2 className="size-4" /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={resetMedication} className="w-full mt-4 rounded-xl gap-2 text-muted-foreground">
          <RotateCcw className="size-4" /> Reset All Progress
        </Button>
      </div>
    </SectionCard>
  )
}
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

// ... (MedicationTimeline component remains exactly the same as your original code)

function MythbusterChat() {
  const { messages, sendMessage } = useSync()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = async (text: string) => {
    const t = text.trim()
    if (!t) return
    
    // Add user message to UI
    sendMessage(t, "...") 

    // Fetch AI response from your new API route
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: t }),
      })
      const data = await response.json()
      sendMessage("AI", data.reply)
    } catch (error) {
      sendMessage("AI", "Sorry, I'm having trouble connecting right now.")
    }
    
    setInput("")
  }

  return (
    <SectionCard title="Stigma-Free Mythbuster Chatbox" subtitle="Ask anything" icon={<Shield className="size-5" />}>
      <div ref={scrollRef} className="no-scrollbar max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-secondary/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border")}>
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Type your question…" className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none" />
        <Button onClick={() => send(input)} className="rounded-2xl px-4" disabled={!input.trim()}><Send className="size-4" /></Button>
      </div>
    </SectionCard>
  )
}

function SpecialistDirectory() {
  const [localSpecialists, setLocalSpecialists] = useState(SPECIALISTS)

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        // This is where you would call an API to get real local doctors
        console.log("Fetching doctors near:", latitude, longitude)
      })
    }
  }, [])

  return (
    <SectionCard title="Verified Specialist Directory" subtitle="Experts near you" icon={<Stethoscope className="size-5" />}>
  <div className="space-y-3">
    {specialistsData.map((doc) => (
      <div key={doc.id} className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-semibold text-primary-foreground">
          {doc.name.split(" ")[1]?.[0] ?? doc.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            {doc.name} <ShieldCheck className="size-3.5 text-primary" />
          </p>
          <p className="truncate text-xs text-muted-foreground">{doc.specialty}</p>
        </div>
        <p className="flex items-center gap-1 text-sm font-medium">
          <Star className="size-3.5 fill-primary text-primary" /> {doc.rating}
        </p>
      </div>
    ))}
  </div>
</SectionCard>
  )
}
