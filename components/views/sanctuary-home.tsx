"use client"

import { useState } from "react"
import { useSync } from "@/components/sync-context"
import { ProgressRing, SectionCard } from "@/components/sync-ui"
import { BoxBreathing } from "@/components/box-breathing"
import { Button } from "@/components/ui/button"
import { LITERACY_CARDS } from "@/lib/sync-data"
import { cn } from "@/lib/utils"
import {
  Apple,
  Bell,
  BellOff,
  Brain,
  Check,
  ChevronDown,
  Dumbbell,
  Moon,
  Sparkles,
  Trophy,
} from "lucide-react"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export function SanctuaryHome() {
  const { profile, pillarProgress, pillarsWon, masterProgress } = useSync()
  const name = profile?.name || "friend"

  return (
    <div className="space-y-6">
      {/* greeting */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground text-balance md:text-3xl">
            {getGreeting()}, {name}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Your body is resilient, and you are in complete sYnc today.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-accent/60 px-4 py-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="size-4" />
          Active Care Streak: 1 Day
        </span>
      </header>

      {/* master tracker */}
      <MasterTracker
        pillarProgress={pillarProgress}
        masterProgress={masterProgress}
        pillarsWon={pillarsWon}
        name={name}
      />

      {/* panes */}
      <div className="space-y-4">
        <NutritionPane />
        <MentalPane />
        <ExercisePane />
        <SleepPane />
      </div>

      {/* literacy carousel */}
      <LiteracyCarousel />
    </div>
  )
}

function MasterTracker({
  pillarProgress,
  masterProgress,
  pillarsWon,
  name,
}: {
  pillarProgress: { nutrition: number; mental: number; exercise: number; sleep: number }
  masterProgress: number
  pillarsWon: number
  name: string
}) {
  const pillars = [
    { label: "Nutrition", value: pillarProgress.nutrition, icon: Apple },
    { label: "Mental Health", value: pillarProgress.mental, icon: Brain },
    { label: "Exercise", value: pillarProgress.exercise, icon: Dumbbell },
    { label: "Sleep", value: pillarProgress.sleep, icon: Moon },
  ]

  return (
    <SectionCard
      title="Master Progress Tracker"
      subtitle="Four pillars working in harmony"
      icon={<Trophy className="size-5" />}
    >
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <ProgressRing value={masterProgress} size={132} label={`${masterProgress}%`} sublabel="Daily sYnc" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon
            const won = p.value >= 100
            return (
              <div key={p.label} className="rounded-2xl bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon className="size-4 text-primary" />
                    {p.label}
                  </span>
                  {won && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      Win
                    </span>
                  )}
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-card">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${p.value}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <FeedbackBanner pillarsWon={pillarsWon} name={name} />
    </SectionCard>
  )
}

function FeedbackBanner({ pillarsWon, name }: { pillarsWon: number; name: string }) {
  if (pillarsWon === 0) return null
  const isChampion = pillarsWon >= 3
  return (
    <div
      className={cn(
        "animate-fade-up mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        isChampion
          ? "border-primary bg-primary/15 text-foreground"
          : "border-primary/40 bg-accent/50 text-accent-foreground",
      )}
    >
      <span className="text-lg leading-none">{isChampion ? "👑" : "✨"}</span>
      <p className="leading-relaxed">
        {isChampion
          ? `Absolute sYnc Champion! Hitting your daily wins shows incredible consistency. Your body is thanking you right now, ${name}.`
          : `A beautiful start, ${name}. You've already taken your first steps toward balancing your energy today!`}
      </p>
    </div>
  )
}

function Pane({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-secondary/40"
      >
        <span className="flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ChevronDown className={cn("size-5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-2xl bg-secondary/50 px-4 py-3 text-left transition hover:bg-secondary"
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
        )}
      >
        {checked && <Check className="size-4" />}
      </span>
      <span className={cn("text-sm", checked ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  )
}

function NutritionPane() {
  const { nutrition, toggleNutrition, insulinNote, setInsulinNote } = useSync()
  return (
    <Pane
      title="Nutrition"
      subtitle="Steady your energy, meal by meal"
      icon={<Apple className="size-5" />}
      defaultOpen
    >
      <div className="space-y-3">
        <CheckRow label="10-Min Post-Meal Stroll" checked={nutrition.stroll} onToggle={() => toggleNutrition("stroll")} />
        <CheckRow
          label="Protein-First Breakfast"
          checked={nutrition.protein}
          onToggle={() => toggleNutrition("protein")}
        />
        <button
          onClick={() => toggleNutrition("alarm")}
          className="flex w-full items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3 text-left transition hover:bg-secondary"
        >
          <span className="flex items-center gap-2 text-sm text-foreground">
            {nutrition.alarm ? <Bell className="size-4 text-primary" /> : <BellOff className="size-4 text-muted-foreground" />}
            Meal reminder alarm
          </span>
          <span
            className={cn(
              "relative h-6 w-11 rounded-full transition",
              nutrition.alarm ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-card transition-all",
                nutrition.alarm ? "left-[1.375rem]" : "left-0.5",
              )}
            />
          </span>
        </button>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Insulin resistance, in plain words (editable)
          </p>
          <textarea
            value={insulinNote}
            onChange={(e) => setInsulinNote(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-border bg-secondary/40 p-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
    </Pane>
  )
}

function MentalPane() {
  const { journal, setJournal, saveJournal, journalSaved, moodNote, setMoodNote } = useSync()
  return (
    <Pane title="Mental Health" subtitle="A calmer nervous system" icon={<Brain className="size-5" />}>
      <div className="grid gap-5 md:grid-cols-2">
        <BoxBreathing />
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">5-minute Cognitive Offload Journal</p>
            <textarea
              value={journal}
              onChange={(e) => {
                setJournal(e.target.value)
              }}
              rows={4}
              placeholder="Empty your mind here…"
              className="w-full resize-none rounded-2xl border border-border bg-secondary/40 p-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <div className="mt-2 flex items-center gap-3">
              <Button onClick={saveJournal} className="rounded-full px-5" disabled={!journal.trim()}>
                Save Note
              </Button>
              {journalSaved && (
                <span className="animate-fade-up flex items-center gap-1 text-xs font-medium text-primary">
                  <Check className="size-3.5" /> Saved · pillar marked a Win
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">How mood mechanics work (editable)</p>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-secondary/40 p-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>
    </Pane>
  )
}

function ExercisePane() {
  const { exerciseItems, exerciseChecked, toggleExercise } = useSync()
  const done = exerciseChecked.filter(Boolean).length
  return (
    <Pane
      title="Exercise"
      subtitle={`Tick any 2 of 5 to win · ${done}/5 done`}
      icon={<Dumbbell className="size-5" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {exerciseItems.map((item, i) => (
          <CheckRow key={item} label={item} checked={exerciseChecked[i]} onToggle={() => toggleExercise(i)} />
        ))}
      </div>
      {done >= 2 && (
        <p className="animate-fade-up mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
          <Trophy className="size-4" /> Exercise pillar marked as a Win!
        </p>
      )}
    </Pane>
  )
}

function SleepPane() {
  const { sleepItems, sleepChecked, toggleSleep } = useSync()
  return (
    <Pane
      title="Sleep"
      subtitle="Friction reduction for tomorrow"
      icon={<Moon className="size-5" />}
    >
      <div className="relative space-y-3 border-l-2 border-dashed border-primary/30 pl-5">
        {sleepItems.map((item, i) => (
          <div key={item} className="relative">
            <span className="absolute -left-[1.6rem] top-3 size-3 rounded-full border-2 border-primary bg-background" />
            <CheckRow label={item} checked={sleepChecked[i]} onToggle={() => toggleSleep(i)} />
          </div>
        ))}
      </div>
    </Pane>
  )
}

function LiteracyCarousel() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 px-1">
        <Sparkles className="size-4 text-primary" />
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Reproductive Health &amp; PMOS Literacy
        </h2>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {LITERACY_CARDS.map((card) => (
          <article
            key={card.title}
            className="flex w-72 shrink-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {card.tag}
            </span>
            <h3 className="font-heading text-base font-semibold text-foreground text-balance">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
