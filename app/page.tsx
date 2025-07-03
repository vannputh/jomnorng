"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { useAuth } from "@/hooks/use-auth"
import LandingPage from "@/components/landing/LandingPage"

export default function HomePage() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  // Redirect authenticated users directly to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard")
    }
  }, [authLoading, user, router])

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <LandingPage
      language={language}
      setLanguage={setLanguage}
      onGetStarted={handleGetStarted}
    />
  )
}
