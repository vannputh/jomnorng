"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Language } from "@/lib/types"
import LandingPage from "@/components/landing/LandingPage"

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("km")
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
