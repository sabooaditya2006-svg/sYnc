"use client"

import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from "@/lib/sync-data"
import { useSync } from "@/components/sync-context"
import { SelectorPill } from "@/components/sync-ui"
import { Apple, Brain, Dumbbell, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Nutrition: <Apple className="size-4" />,
  Sleep: <Moon className="size-4" />,
  "Mental Health": <Brain className="size-4" />,
  Exercise: <Dumbbell className="size-4" />,
}

function SyncSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const val = value || 0
  const markers = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="mt-4">
      {/* Interactive single row of circles */}
      <div className="flex items-center justify-between px-1">
        {markers.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-all duration-200",
              m === val
                ? "border-primary bg-primary scale-110 shadow-sm"
                : "border-primary/40 bg-card hover:border-primary"
            )}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span className="font-semibold text-foreground">Selected: {val || "—"}</span>
        <span>10</span>
      </div>
    </div>
  )
}

export function BodyWeatherQuiz({ compact = false }: { compact?: boolean }) {
  const { quizAnswers, setQuizAnswer } = useSync()

  return (
    <div className="space-y-6">
      {QUIZ_CATEGORIES.map((category) => {
        const questions = QUIZ_QUESTIONS.filter((q) => q.category === category)
        return (
          <div key={category} className="rounded-3xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                {CATEGORY_ICON[category]}
              </span>
              <h4 className="font-heading text-base font-semibold text-foreground">{category}</h4>
            </div>
            <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl bg-secondary/50 p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">
                    <span className="mr-1 text-muted-foreground">{q.id}.</span>
                    {q.prompt}
                  </p>
                  {q.type === "slider" ? (
                    <SyncSlider
                      value={Number(quizAnswers[q.id]) || 0}
                      onChange={(n) => setQuizAnswer(q.id, n)}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {q.options?.map((opt) => (
                        <SelectorPill
                          key={opt}
                          active={quizAnswers[q.id] === opt}
                          onClick={() => setQuizAnswer(q.id, opt)}
                        >
                          {opt}
                        </SelectorPill>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
