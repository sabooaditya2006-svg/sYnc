"use client"

import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from "@/lib/sync-data"
import { useSync } from "@/components/sync-context"
import { SelectorPill } from "@/components/sync-ui"
import { Apple, Brain, Dumbbell, Moon } from "lucide-react"

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Nutrition: <Apple className="size-4" />,
  Sleep: <Moon className="size-4" />,
  "Mental Health": <Brain className="size-4" />,
  Exercise: <Dumbbell className="size-4" />,
}

function SyncSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="mt-2">
      <input
        type="range"
        min={1}
        max={10}
        value={value || 5}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sync-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((value || 5) - 1) * 11.1}%, var(--secondary) ${((value || 5) - 1) * 11.1}%, var(--secondary) 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span className="font-semibold text-foreground">Selected: {value || "—"}</span>
        <span>10</span>
      </div>

      {/* Add cross-browser thumb styles so the circular thumb has a visible border */}
      <style jsx global>{`
        .sync-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
        }

        /* WebKit/Blink */
        .sync-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 3px solid var(--border);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.03);
          margin-top: -6px; /* vertically center the thumb over the track */
          cursor: pointer;
        }

        /* Firefox */
        .sync-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 3px solid var(--border);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.03);
          cursor: pointer;
        }

        /* IE/Edge Legacy */
        .sync-slider::-ms-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          border: 3px solid var(--border);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.03);
          cursor: pointer;
        }
      `}</style>
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
