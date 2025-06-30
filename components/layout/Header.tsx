"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Sparkles,
  Sun,
  Moon,
  User,
  LogOut,
  Building2,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { UserType, Language, ColorTheme } from "@/lib/types"
import { COLOR_THEMES } from "@/lib/constants"
import { getTranslations } from "@/lib/translations"

interface HeaderProps {
  user: UserType | null
  language: Language
  setLanguage: (language: Language) => void
  colorTheme: string
  setColorTheme: (theme: string) => void
  showProfile: boolean
  setShowProfile: (show: boolean) => void
  onLogout: () => void
  children?: React.ReactNode
}

export default function Header({
  user,
  language,
  setLanguage,
  colorTheme,
  setColorTheme,
  showProfile,
  setShowProfile,
  onLogout,
  children,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const t = getTranslations(language)
  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0]

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center`}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.full_name || user?.email}!
          </p>
        </div>
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

        <Select value={colorTheme} onValueChange={setColorTheme}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLOR_THEMES.map((theme) => (
              <SelectItem key={theme.value} value={theme.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                  {theme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button variant="outline" size="icon" onClick={() => setShowProfile(true)}>
          <User className="w-4 h-4" />
        </Button>

        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t.companyProfile}
              </DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="icon" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 