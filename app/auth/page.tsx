"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

import type { Language } from "@/lib/types"
import AuthPage from "@/components/auth/AuthPage"

export default function AuthPageRoute() {
  const [language, setLanguage] = useState<Language>("km")
  const router = useRouter()
  const { handleAuth, isLoading } = useAuth()

  console.log("AuthPageRoute: handleAuth function exists:", typeof handleAuth === 'function')

  const handleBack = () => {
    router.push("/")
  }

  return (
    <AuthPage
      language={language}
      onBack={handleBack}
      onAuth={handleAuth}
      isLoading={isLoading}
    />
  )
} 