"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Palette } from "lucide-react"
import type { Language, ColorTheme, CompanyProfile } from "@/lib/types"
import { VIBE_OPTIONS } from "@/lib/constants"
import { getTranslations } from "@/lib/translations"

interface VibeSelectionProps {
  selectedVibe: string
  setSelectedVibe: (vibe: string) => void
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  language: Language
  currentTheme: ColorTheme
  onAnalyze: () => void
  isAnalyzing: boolean
}

export default function VibeSelection({
  selectedVibe,
  setSelectedVibe,
  customPrompt,
  setCustomPrompt,
  language,
  currentTheme,
  onAnalyze,
  isAnalyzing,
}: VibeSelectionProps) {
  const t = getTranslations(language)

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
          <Palette className="w-5 h-5" />
          {t.chooseVibe}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {VIBE_OPTIONS.map((vibe) => {
            const Icon = vibe.icon
            return (
              <Button
                key={vibe.value}
                variant={selectedVibe === vibe.value ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col gap-2 transition-all ${
                  selectedVibe === vibe.value
                    ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg`
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedVibe(vibe.value)}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{language === "km" ? vibe.label : vibe.labelEn}</span>
              </Button>
            )
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-prompt">{t.customInstructions}</Label>
          <Textarea
            id="custom-prompt"
            placeholder={
              language === "km"
                ? "បន្ថែមសេចក្តីណែនាំជាក់លាក់... (ព័ត៌មានក្រុមហ៊ុនរបស់អ្នកនឹងត្រូវបានរួមបញ្ចូលដោយស្វ័យប្រវត្តិ)"
                : "Add specific instructions... (Your company profile will be automatically included)"
            }
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            className="bg-gray-50 dark:bg-gray-800"
          />
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 shadow-lg`}
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.analyzingImage}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {t.generateCaptions}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 