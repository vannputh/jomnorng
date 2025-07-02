"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCompanyProfile } from "@/hooks/use-company-profile"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import type { Language, CompanyProfile } from "@/lib/types"

// Component imports
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CaptionsLibrary from "@/components/dashboard/CaptionsLibrary"
import CompanyProfileForm from "@/components/company/CompanyProfileForm"
import { Button } from "@/components/ui/button"

export default function LibraryPage() {
  const { language, setLanguage } = useLanguage()
  const [showProfile, setShowProfile] = useState(false)

  const router = useRouter()
  const { user, isLoading: authLoading, handleLogout } = useAuth()
  const {
    companyProfile: globalProfile,
    isFirstTimeUser,
    loadCompanyProfile,
    saveCompanyProfile,
    isSaving: globalSaving,
  } = useCompanyProfile(language)

  // Local form state for the company profile
  const [localCompanyProfile, setLocalCompanyProfile] = useState<CompanyProfile>({
    user_id: "",
    company_name: "",
    business_type: "",
    description: "",
    target_audience: "",
    brand_voice: "",
    company_size: "",
    industry_focus: "",
    marketing_goals: [],
    brand_colors: "",
    website_url: "",
    social_handles: "",
    unique_selling_points: "",
  })

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  // Load company profile when user is available
  useEffect(() => {
    if (user) {
      loadCompanyProfile(user.id, true) // Skip redirect, stay on library
    }
  }, [user, loadCompanyProfile])

  // Update local state when global profile loads or changes
  useEffect(() => {
    if (globalProfile.user_id) {
      setLocalCompanyProfile(globalProfile)
    }
  }, [globalProfile])

  // Set user_id when user is available (fallback)
  useEffect(() => {
    if (user && user.id && !localCompanyProfile.user_id) {
      setLocalCompanyProfile((prev: CompanyProfile) => ({ ...prev, user_id: user.id }))
    }
  }, [user, localCompanyProfile.user_id])

  // Custom save function that works with local state
  const handleSaveProfile = async () => {
    if (!user) return
    
    // Update the global profile with local changes
    Object.assign(globalProfile, localCompanyProfile)
    
    // Use the hook's save function
    await saveCompanyProfile(false)
    
    // Reload the profile to get the latest data and update both states
    await loadCompanyProfile(user.id, true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Header
          user={user}
          language={language}
          setLanguage={setLanguage}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          onLogout={handleLogout}
          companyProfile={localCompanyProfile}
        >
          <CompanyProfileForm
            profile={localCompanyProfile}
            setProfile={setLocalCompanyProfile}
            onSave={handleSaveProfile}
            isSaving={globalSaving}
            language={language}
          />
        </Header>

        {/* Back Button & Page Title */}
        <div className="relative overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 rounded-3xl"></div>
          <div className="relative py-8 px-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === "km" ? "ត្រលប់ក្រោយ" : "Back"}
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white leading-[1.4] mb-2 overflow-visible">
                {language === "km" ? "បណ្ណាល័យរបស់ខ្ញុំ" : "My Library"}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "km" 
                  ? "មើលនិងគ្រប់គ្រងចំណងជើងដែលបានបង្កើតរបស់អ្នក" 
                  : "View and manage your generated caption collection"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with enhanced container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
          <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <CaptionsLibrary userId={user.id} language={language} />
          </div>
        </div>

        </div>
      </div>
      <Footer language={language} />
    </div>
  )
} 