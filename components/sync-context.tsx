"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type Profile = {
  name: string
  age: string
  cycleLength: string
}

export type SymptomState = {
  energy: string | null
  cravings: string | null
  postMealSluggish: string | null
  skin: string | null
  hirsutism: string | null
  acanthosis: string | null
  bloating: number
  gut: string | null
  mood: string | null
  brainFog: string | null
}

export type Medication = {
  id: string
  name: string
  dosage: string
  times: string[] 
  frequency: number
  takenCount: number
}

export type ChatMessage = {
  id: string
  role: "user" | "sync"
  text: string
}

export type WeightLog = { label: string; kg: number }

type View = "home" | "studio" | "circle"

const EXERCISE_ITEMS = [
  "Post-Meal Stroll",
  "Cortisol-Drop Yoga Flow",
  "10 Squats",
  "15 Heel Raises",
  "5-Min Endorphin Booster",
]

const SLEEP_ITEMS = [
  "Lay out workout clothes",
  "Prep protein breakfast",
  "Dim the lights",
  "Clear meditation floor space",
]

type SyncContextValue = {
  profile: Profile | null
  setProfile: (p: Profile) => void
  onboarded: boolean
  completeOnboarding: () => void
  skipped: boolean
  setSkipped: (v: boolean) => void
  view: View
  setView: (v: View) => void
  nutrition: { stroll: boolean; protein: boolean; alarm: boolean }
  toggleNutrition: (key: "stroll" | "protein" | "alarm") => void
  insulinNote: string
  setInsulinNote: (s: string) => void
  journal: string
  setJournal: (s: string) => void
  journalSaved: boolean
  saveJournal: () => void
  moodNote: string
  setMoodNote: (s: string) => void
  exerciseItems: string[]
  exerciseChecked: boolean[]
  toggleExercise: (i: number) => void
  sleepItems: string[]
  sleepChecked: boolean[]
  toggleSleep: (i: number) => void
  pillarProgress: { nutrition: number; mental: number; exercise: number; sleep: number }
  pillarsWon: number
  masterProgress: number
  quizAnswers: Record<number, string | number>
  setQuizAnswer: (id: number, value: string | number) => void
  quizSubmitted: boolean
  submitQuiz: () => void
  quizAnsweredCount: number
  periodDays: number[]
  togglePeriodDay: (day: number) => void
  weightLogs: WeightLog[]
  addWeight: (kg: number) => void
  water: number
  setWater: (n: number) => void
  symptoms: SymptomState
  setSymptom: <K extends keyof SymptomState>(key: K, value: SymptomState[K]) => void
  riskScore: number
  riskLabel: string
  hasBaseline: boolean
  medications: Medication[]
  addMedication: (m: Omit<Medication, "id" | "takenCount">) => void
  toggleMedTaken: (id: string) => void
  removeMedication: (id: string) => void
  resetMedication: () => void
  messages: ChatMessage[]
  sendMessage: (userText: string, answer: string) => void
}

const SyncContext = createContext<SyncContextValue | null>(null)

export function useSync() {
  const ctx = useContext(SyncContext)
  if (!ctx) throw new Error("useSync must be used within SyncProvider")
  return ctx
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [onboarded, setOnboarded] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const [view, setView] = useState<View>("home")
  const [nutrition, setNutrition] = useState({ stroll: false, protein: false, alarm: false })
  const [insulinNote, setInsulinNote] = useState("Insulin is the key that lets sugar move from your blood into your cells for energy.")
  const [journal, setJournal] = useState("")
  const [journalSaved, setJournalSaved] = useState(false)
  const [moodNote, setMoodNote] = useState("Mood shifts are not 'all in your head.'")
  const [exerciseChecked, setExerciseChecked] = useState<boolean[]>(Array(EXERCISE_ITEMS.length).fill(false))
  const [sleepChecked, setSleepChecked] = useState<boolean[]>(Array(SLEEP_ITEMS.length).fill(false))
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string | number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [periodDays, setPeriodDays] = useState<number[]>([])
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([{ label: "Wk 1", kg: 68.2 }])
  const [water, setWater] = useState(0)
  const [symptoms, setSymptoms] = useState<SymptomState>({ energy: null, cravings: null, postMealSluggish: null, skin: null, hirsutism: null, acanthosis: null, bloating: 0, gut: null, mood: null, brainFog: null })
  
  // CORRECTED: Initializing with 'times' array to match your new Medication type
  const [medications, setMedications] = useState<Medication[]>([
    { id: "med-1", name: "Inositol", dosage: "2g", times: ["09:00", "21:00"], frequency: 2, takenCount: 0 },
  ])
  
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "welcome", role: "sync", text: "Hi, I'm your sYnc companion." }])

  const setProfile = (p: Profile) => setProfileState(p)
  const completeOnboarding = () => setOnboarded(true)
  const toggleNutrition = (key: "stroll" | "protein" | "alarm") => setNutrition((prev) => ({ ...prev, [key]: !prev[key] }))
  const saveJournal = () => setJournalSaved(true)
  const toggleExercise = (i: number) => setExerciseChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  const toggleSleep = (i: number) => setSleepChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  const setQuizAnswer = (id: number, value: string | number) => setQuizAnswers((prev) => ({ ...prev, [id]: value }))
  const submitQuiz = () => setQuizSubmitted(true)
  const togglePeriodDay = (day: number) => setPeriodDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)))
  const addWeight = (kg: number) => setWeightLogs((prev) => [...prev, { label: `Wk ${prev.length + 1}`, kg }])
  const setSymptom = <K extends keyof SymptomState>(key: K, value: SymptomState[K]) => setSymptoms((prev) => ({ ...prev, [key]: value }))

  // Medication Actions
  const addMedication = (m: Omit<Medication, "id" | "takenCount">) => setMedications((prev) => [...prev, { ...m, id: `med-${Date.now()}`, takenCount: 0 }])
  const removeMedication = (id: string) => setMedications((prev) => prev.filter((m) => m.id !== id))
  const resetMedication = () => setMedications((prev) => prev.map((m) => ({ ...m, takenCount: 0 })))
  const toggleMedTaken = (id: string) => setMedications((prev) => prev.map((m) => m.id === id ? { ...m, takenCount: m.takenCount >= m.frequency ? 0 : m.takenCount + 1 } : m))

  const sendMessage = (userText: string, answer: string) => {
    const base = Date.now()
    setMessages((prev) => [...prev, { id: `u-${base}`, role: "user", text: userText }, { id: `s-${base}`, role: "sync", text: answer }])
  }

  const pillarProgress = useMemo(() => ({ nutrition: 0, mental: 0, exercise: 0, sleep: 0 }), []) 
  const pillarsWon = 0
  const masterProgress = 0
  const quizAnsweredCount = Object.keys(quizAnswers).length
  const hasBaseline = quizAnsweredCount >= 5
  const riskScore = 0
  const riskLabel = "Low"

  const value: SyncContextValue = {
    profile, setProfile, onboarded, completeOnboarding, skipped, setSkipped, view, setView,
    nutrition, toggleNutrition, insulinNote, setInsulinNote, journal, setJournal, journalSaved, saveJournal,
    moodNote, setMoodNote, exerciseItems: EXERCISE_ITEMS, exerciseChecked, toggleExercise, sleepItems: SLEEP_ITEMS,
    sleepChecked, toggleSleep, pillarProgress, pillarsWon, masterProgress, quizAnswers, setQuizAnswer,
    quizSubmitted, submitQuiz, quizAnsweredCount, periodDays, togglePeriodDay, weightLogs, addWeight,
    water, setWater, symptoms, setSymptom, riskScore, riskLabel, hasBaseline, medications, addMedication,
    toggleMedTaken, removeMedication, resetMedication, messages, sendMessage,
  }

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}
