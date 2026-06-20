"use client"

import { useState } from "react"
import { useSync } from "@/components/sync-context"
import { ProgressRing, SectionCard } from "@/components/sync-ui"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarDays, Droplets, GlassWater, Scale } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function CycleTracker() {
  const { periodDays, togglePeriodDay, profile } = useSync()
  
  // Calculate phase logic
  const target = Number(profile?.cycleLength) || 28
  let phase = "Follicular phase"
  if (periodDays.length > 0) {
    const last = Math.max(...periodDays)
    const today = new Date().getDate()
    const sinceFlow = today - last
    if (periodDays.includes(today) || sinceFlow <= 1) phase = "Menstrual phase"
    else if (sinceFlow <= 9) phase = "Follicular phase"
    else if (sinceFlow <= 14) phase = "Ovulatory window"
    else phase = "Luteal phase"
  }

  const horizon = [
    { month: "Apr", length: 31 },
    { month: "May", length: 34 },
    { month: "Jun", length: 29 },
    { month: "Jul", length: 36 },
    { month: "Aug", length: target + (periodDays.length > 6 ? 7 : periodDays.length) },
  ]

  return (
    <SectionCard
      title="Menstrual Cycle — Calendar Tracker"
      subtitle="Tap any date to toggle period flow"
      icon={<CalendarDays className="size-5" />}
    >
      <div className="flex justify-center py-2">
        <DayPicker
          mode="multiple"
          showOutsideDays={true}
          selected={periodDays.map(day => {
            const d = new Date(); d.setDate(day); return d;
          })}
          onSelect={(_, selectedDay) => {
            togglePeriodDay(selectedDay.getDate());
          }}
          className="rounded-xl border border-border p-3"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-primary" /> {periodDays.length} flow days logged
        </span>
        <span className="ml-auto rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Current: {phase}
        </span>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-foreground">Cycle Horizon — length variance</p>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={horizon} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} domain={[24, 40]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
              <Line type="monotone" dataKey="length" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  )
}

export function WeightTracker() {
  const { weightLogs, addWeight } = useSync()
  const [input, setInput] = useState("")

  const submit = () => {
    const kg = Number.parseFloat(input)
    if (!Number.isNaN(kg) && kg > 0) {
      addWeight(kg)
      setInput("")
    }
  }

  return (
    <SectionCard
      title="Weight Tracker"
      subtitle="Catch metabolic pattern shifts"
      icon={<Scale className="size-5" />}
    >
      <div className="flex gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Log today's weight (kg)"
          className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <Button onClick={submit} className="rounded-2xl px-5">Add Data</Button>
      </div>
      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightLogs} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
            <Line type="monotone" dataKey="kg" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

export function WaterTracker() {
  const { water, setWater } = useSync()
  const goal = 8
  const pct = Math.round((water / goal) * 100)

  return (
    <SectionCard
      title="Water Intake"
      subtitle="Stay gently hydrated"
      icon={<Droplets className="size-5" />}
    >
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <ProgressRing value={pct} size={120} label={`${pct}%`} sublabel="Hydrated" />
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          {Array.from({ length: goal }, (_, i) => {
            const filled = i < water
            return (
              <button
                key={i}
                onClick={() => setWater(filled && i + 1 === water ? i : i + 1)}
                className="flex flex-col items-center gap-1"
                aria-label={`Glass ${i + 1}`}
              >
                <GlassWater className={cn("size-9 transition-colors", filled ? "text-primary" : "text-border")} fill={filled ? "var(--accent)" : "transparent"} />
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              </button>
            )
          })}
        </div>
      </div>
    </SectionCard>
  )
}