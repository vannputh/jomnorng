"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import AuthPage from "@/components/auth/AuthPage"
import { AuthSkeleton } from "@/components/skeletons/AuthSkeleton"

export default function AuthPageRoute() {
  const { language } = useLanguage()
  const router = useRouter()
  const { handleAuth, handleGoogleSignIn, isLoading } = useAuth()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isLoading, isInitialLoad])

  if (isLoading && isInitialLoad) {
    return <AuthSkeleton />
  }

  console.log("AuthPageRoute: handleAuth function exists:", typeof handleAuth === 'function')

  const handleBack = () => {
    router.push("/")
  }

  return (
    <AuthPage
      language={language}
      onBack={handleBack}
      onAuth={handleAuth}
      onGoogleAuth={handleGoogleSignIn}
      isLoading={isLoading}
    />
  )
} 