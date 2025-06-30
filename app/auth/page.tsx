"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { COLOR_THEMES } from "@/lib/constants"
import type { Language } from "@/lib/types"
import AuthPage from "@/components/auth/AuthPage"

export default function AuthPageRoute() {
  const [language, setLanguage] = useState<Language>("km")
  const [colorTheme, setColorTheme] = useState("classic")
  const router = useRouter()
  const { handleAuth, isLoading } = useAuth()

  console.log("AuthPageRoute: handleAuth function exists:", typeof handleAuth === 'function')

  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0]

  const handleBack = () => {
    router.push("/")
  }

  return (
    <AuthPage
      language={language}
      colorTheme={colorTheme}
      currentTheme={currentTheme}
      onBack={handleBack}
      onAuth={handleAuth}
      isLoading={isLoading}
    />
  )
} 