"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCompanyProfile } from "@/hooks/use-company-profile"
import { COLOR_THEMES } from "@/lib/constants"
import type { Language } from "@/lib/types"
import FirstTimeSetup from "@/components/company/FirstTimeSetup"

export default function SetupPage() {
  const [language, setLanguage] = useState<Language>("km")
  const [colorTheme, setColorTheme] = useState("classic")
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { companyProfile, setCompanyProfile, isSaving, saveCompanyProfile, skipSetup } = useCompanyProfile(language)

  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0]

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  // Update company profile user_id when user changes
  useEffect(() => {
    if (user && companyProfile.user_id !== user.id) {
      setCompanyProfile({ ...companyProfile, user_id: user.id })
    }
  }, [user, companyProfile, setCompanyProfile])

  const handleSave = () => {
    saveCompanyProfile(true) // true = redirect to dashboard after saving
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <FirstTimeSetup
      language={language}
      currentTheme={currentTheme}
      companyProfile={companyProfile}
      setCompanyProfile={setCompanyProfile}
      onSave={handleSave}
      onSkip={skipSetup}
      isSaving={isSaving}
    />
  )
} 