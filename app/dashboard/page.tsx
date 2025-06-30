"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useCompanyProfile } from "@/hooks/use-company-profile"
import { COLOR_THEMES, VIBE_OPTIONS } from "@/lib/constants"
import { getTranslations } from "@/lib/translations"
import type { Language } from "@/lib/types"

// Component imports
import Header from "@/components/layout/Header"
import ImageUpload from "@/components/image/ImageUpload"
import VibeSelection from "@/components/image/VibeSelection"
import CaptionList from "@/components/captions/CaptionList"
import CompanyProfileForm from "@/components/company/CompanyProfileForm"

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>("km")
  const [colorTheme, setColorTheme] = useState("classic")
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [captions, setCaptions] = useState<string[]>([])
  const [selectedVibe, setSelectedVibe] = useState("casual")
  const [customPrompt, setCustomPrompt] = useState("")
  const [selectedCaption, setSelectedCaption] = useState("")
  const [showProfile, setShowProfile] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading, handleLogout } = useAuth()
  const { 
    companyProfile, 
    setCompanyProfile, 
    isSaving: isSavingProfile, 
    loadCompanyProfile, 
    saveCompanyProfile 
  } = useCompanyProfile(language)

  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0]
  const selectedVibeOption = VIBE_OPTIONS.find((v) => v.value === selectedVibe)
  const t = getTranslations(language)

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  // Load company profile when user is available
  useEffect(() => {
    if (user) {
      loadCompanyProfile(user.id)
    }
  }, [user, loadCompanyProfile])

  // Image and caption handling
  const handleImageReset = () => {
    setImage(null)
    setCaptions([])
    setSelectedCaption("")
  }

  const analyzeImage = async () => {
    if (!image || !user) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image.split(",")[1],
          vibe: selectedVibe,
          customPrompt,
          companyProfile,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()
      setCaptions(data.captions)
      setSelectedCaption(data.captions[0] || "")

      toast({
        title: language === "km" ? "ការវិភាគបានបញ្ចប់!" : "Analysis complete!",
        description: language === "km" ? "បានបង្កើតចំណងជើង" : "Generated captions based on your image.",
      })
    } catch (error) {
      toast({
        title: language === "km" ? "ការវិភាគបរាជ័យ" : "Analysis failed",
        description: language === "km" ? "សូមព្យាយាមម្តងទៀត" : "Failed to analyze the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: language === "km" ? "បានចម្លង!" : "Copied!",
      description: language === "km" ? "ចំណងជើងបានចម្លង" : "Caption copied to clipboard.",
    })
  }

  const handleSaveProfile = () => {
    saveCompanyProfile(false) // false = don't redirect after saving
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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Header
          user={user}
          language={language}
          setLanguage={setLanguage}
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          onLogout={handleLogout}
        >
          <CompanyProfileForm
            profile={companyProfile}
            setProfile={setCompanyProfile}
            onSave={handleSaveProfile}
            isSaving={isSavingProfile}
            language={language}
            currentTheme={currentTheme}
          />
        </Header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <ImageUpload
              image={image}
              setImage={setImage}
              language={language}
              currentTheme={currentTheme}
              onReset={handleImageReset}
            />

            {image && (
              <VibeSelection
                selectedVibe={selectedVibe}
                setSelectedVibe={setSelectedVibe}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                language={language}
                currentTheme={currentTheme}
                onAnalyze={analyzeImage}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>

          {/* Right Column - Generated Captions */}
          <div className="space-y-6">
            <CaptionList
              captions={captions}
              selectedCaption={selectedCaption}
              setSelectedCaption={setSelectedCaption}
              selectedVibeOption={selectedVibeOption}
              language={language}
              currentTheme={currentTheme}
              onRefresh={analyzeImage}
              onCopy={copyToClipboard}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 