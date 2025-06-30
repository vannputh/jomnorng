"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  ArrowRight,
  Globe,
  Palette,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { Language } from "@/lib/types"
import { getTranslations } from "@/lib/translations"
import FeatureCard from "./FeatureCard"

interface LandingPageProps {
  language: Language
  setLanguage: (language: Language) => void
  onGetStarted: () => void
}

export default function LandingPage({
  language,
  setLanguage,
  onGetStarted,
}: LandingPageProps) {
  const { theme, setTheme } = useTheme()
  const t = getTranslations(language)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>



            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white">{t.heroTitle}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.heroSubtitle}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              className="px-8 py-3 text-lg"
            >
              {t.getStarted}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={Sparkles}
              title={t.aiPowered}
              description={t.aiDesc}
            />
            <FeatureCard
              icon={Globe}
              title={t.multilingual}
              description={t.multilingualDesc}
            />
            <FeatureCard
              icon={Palette}
              title={t.customizable}
              description={t.customizableDesc}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 