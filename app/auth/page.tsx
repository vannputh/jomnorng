"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import AuthPage from "@/components/auth/AuthPage"

export default function AuthPageRoute() {
  const { language } = useLanguage()
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