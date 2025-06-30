"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  title: string
  completed: boolean
  active: boolean
}

interface StepperProps {
  steps: Step[]
  className?: string
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold transition-colors shadow-lg",
                  {
                    "bg-teal-600 text-white": step.completed || step.active,
                    "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400": !step.completed && !step.active,
                  }
                )}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium text-center max-w-20",
                  {
                    "text-teal-600 dark:text-teal-400": step.completed || step.active,
                    "text-gray-600 dark:text-gray-400": !step.completed && !step.active,
                  }
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-6 transition-colors rounded-full",
                  {
                    "bg-teal-600": step.completed,
                    "bg-gray-300 dark:bg-gray-600": !step.completed,
                  }
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
} 