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
      subtitle="Select days to mark active period flow"
      icon={<CalendarDays className="size-5" />}
    >
      <div className="flex justify-center py-2">
        <DayPicker
          mode="multiple"
          selected={periodDays.map(day => {
            const d = new Date(); d.setDate(day); return d;
          })}
          onSelect={(days) => {
            const day = days?.[days.length - 1]?.getDate();
            if (day) togglePeriodDay(day);
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
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="length"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  )
}

// ... Keep your existing WeightTracker and WaterTracker functions below ...