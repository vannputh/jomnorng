"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCompanyProfile } from "@/hooks/use-company-profile"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase"
import { VIBE_OPTIONS } from "@/lib/constants"
import type { Language, CompanyProfile } from "@/lib/types"

// Individual component imports
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ImageUpload from "@/components/image/ImageUpload"
import VibeSelection from "@/components/image/VibeSelection"
import CaptionList from "@/components/captions/CaptionList"
import CompanyProfileForm from "@/components/company/CompanyProfileForm"
import { Stepper } from "@/components/ui/stepper"

export default function GeneratePage() {
  const [language, setLanguage] = useState<Language>("km")
  const [image, setImage] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")
  const [captions, setCaptions] = useState<string[]>([])
  const [selectedCaption, setSelectedCaption] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const router = useRouter()
  const { user, isLoading: authLoading, handleLogout } = useAuth()
  const {
    companyProfile: globalProfile,
    isFirstTimeUser,
    loadCompanyProfile,
  } = useCompanyProfile(language)
  const { toast } = useToast()
  const supabase = typeof window !== "undefined" ? createClient() : null
  const profileLoadedRef = useRef(false)

  // Local form state for the company profile - prevents resets during typing
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

  const selectedVibeOption = VIBE_OPTIONS.find((v) => v.value === selectedVibe)

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  // Load company profile when user is available - only once
  useEffect(() => {
    if (user && !profileLoadedRef.current) {
      loadCompanyProfile(user.id, true) // Skip redirect, stay on dashboard
      profileLoadedRef.current = true
    }
  }, [user, loadCompanyProfile])

  // Update local state when global profile loads
  useEffect(() => {
    if (globalProfile.user_id && !localCompanyProfile.user_id) {
      setLocalCompanyProfile(globalProfile)
    }
  }, [globalProfile, localCompanyProfile.user_id])

  // Set user_id when user is available
  useEffect(() => {
    if (user && user.id && !localCompanyProfile.user_id) {
      setLocalCompanyProfile((prev: CompanyProfile) => ({ ...prev, user_id: user.id }))
    }
  }, [user, localCompanyProfile.user_id])



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
          companyProfile: localCompanyProfile,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()
      setCaptions(data.captions)
      setSelectedCaption(data.captions[0] || "")

      // Save generated caption to database
      if (supabase && data.captions.length > 0) {
        try {
          await supabase.from("generated_captions").insert({
            user_id: user.id,
            image_url: image,
            captions: data.captions,
            vibe: selectedVibe,
            custom_prompt: customPrompt,
            company_profile: localCompanyProfile,
            language: language,
            created_at: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Error saving caption:", error)
        }
      }

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

  // Custom save function that works with local state
  const handleSaveProfile = async () => {
    if (!user || !supabase) return
    
    setIsSavingProfile(true)
    try {
      const profileToSave = { ...localCompanyProfile, user_id: user.id }
      
      const { data, error } = await supabase
        .from("company_profiles")
        .upsert([profileToSave as any], {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        // Update local state with saved data
        setLocalCompanyProfile(data as unknown as CompanyProfile)
      }

      toast({
        title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
        description: language === "km" ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក" : "Company profile saved successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
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
      <div className="max-w-6xl mx-auto p-6 space-y-8">
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
            isSaving={isSavingProfile}
            language={language}
          />
        </Header>

        {/* Progress Indicator */}
        <div className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-lg">
          <div className="p-6">
            <Stepper
              steps={[
                {
                  title: language === "km" ? "ផ្ទុករូបភាព" : "Upload",
                  completed: !!image,
                  active: !image,
                },
                {
                  title: language === "km" ? "ជ្រើសស្ទីល" : "Choose Style",
                  completed: captions.length > 0,
                  active: !!image && captions.length === 0,
                },
                {
                  title: language === "km" ? "ទទួលលទ្ធផល" : "Get Results",
                  completed: captions.length > 0,
                  active: false,
                },
              ]}
            />
            
            {!image && (
              <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === "km" 
                    ? "ចាប់ផ្តើមដោយការផ្ទុករូបភាពរបស់អ្នក" 
                    : "Start by uploading your image below"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Full width layout when no image */
          <ImageUpload
            image={image}
            setImage={setImage}
            language={language}
            onReset={handleImageReset}
          />
        ) : (
          /* Two-column layout when image is uploaded */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Upload & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <ImageUpload
                image={image}
                setImage={setImage}
                language={language}
                onReset={handleImageReset}
              />

              <VibeSelection
                selectedVibe={selectedVibe}
                setSelectedVibe={setSelectedVibe}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                language={language}
                onAnalyze={analyzeImage}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Right Column - Generated Captions */}
            <div className="space-y-6">
              <CaptionList
                captions={captions}
                selectedCaption={selectedCaption}
                setSelectedCaption={setSelectedCaption}
                selectedVibeOption={selectedVibeOption}
                language={language}
                onRefresh={analyzeImage}
                onCopy={copyToClipboard}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}

        <Footer language={language} />
      </div>
    </div>
  )
} 