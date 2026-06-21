"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square, CheckCircle2 } from "lucide-react"

type BoxBreathingProps = {
  onComplete?: () => void
  isCompleted?: boolean
}

export function BoxBreathing({ onComplete, isCompleted = false }: BoxBreathingProps) {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes total
  const [cycleStep, setCycleStep] = useState<"In" | "Hold" | "Out" | "Hold Again">("In")
  const [stepSeconds, setStepSeconds] = useState(4)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            if (onComplete) onComplete()
            return 0
          }
          return prev - 1
        })

        setStepSeconds((prevStep) => {
          if (prevStep <= 1) {
            setCycleStep((current) => {
              if (current === "In") return "Hold"
              if (current === "Hold") return "Out"
              if (current === "Out") return "Hold Again"
              return "In"
            })
            return 4
          }
          return prevStep - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isActive, timeLeft, onComplete])

  const startSession = () => {
    if (isCompleted) return
    setIsActive(true)
    setCycleStep("In")
    setStepSeconds(4)
    setTimeLeft(180)
  }

  const stopSession = () => {
    setIsActive(false)
    setCycleStep("In")
    setStepSeconds(4)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm mx-auto">
      <div className="relative flex size-56 items-center justify-center rounded-full bg-primary/10 shadow-inner">
        <div 
          className="absolute rounded-full bg-primary/20 transition-all duration-1000 ease-in-out"
          style={{
            width: isActive && (cycleStep === "In" || cycleStep === "Hold") ? "100%" : "35%",
            height: isActive && (cycleStep === "In" || cycleStep === "Hold") ? "100%" : "35%",
          }}
        />
        
        <div className="z-10 flex flex-col items-center justify-center text-center p-4">
          {isCompleted ? (
            <div className="flex flex-col items-center gap-1 animate-scale-in">
              <CheckCircle2 className="size-10 text-primary" />
              <span className="text-sm font-semibold text-foreground">Done</span>
            </div>
          ) : (
            <>
              <span className="text-xl font-medium tracking-wide text-foreground min-h-[28px] capitalize">
                {isActive ? cycleStep : "Box Breath"}
              </span>
              
              <span className="text-3xl font-bold font-mono tracking-tighter text-foreground mt-1">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
              
              {isActive && (
                <span className="mt-1.5 text-xs font-mono bg-primary/15 text-primary px-2 py-0.5 rounded-md font-medium">
                  {stepSeconds}s
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 w-full px-4">
        {isCompleted ? (
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-xs font-semibold text-primary border border-primary/20">
            ✓ Breathing Session Complete
          </div>
        ) : isActive ? (
          <Button onClick={stopSession} variant="destructive" className="w-full rounded-2xl py-5 shadow-sm text-sm font-medium flex items-center justify-center gap-2">
            <Square className="size-4 fill-current" /> Stop Breath
          </Button>
        ) : (
          <Button onClick={startSession} className="w-full rounded-2xl py-5 shadow-sm text-sm font-medium flex items-center justify-center gap-2">
            <Play className="size-4 fill-current" /> Start Breath
          </Button>
        )}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground tracking-normal text-center">
        3-minute reset • 4s In • 4s Hold • 4s Out • 4s Hold Again
      </p>
    </div>
  )
}