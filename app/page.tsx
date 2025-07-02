"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import LandingPage from "@/components/landing/LandingPage"

export default function HomePage() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

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
