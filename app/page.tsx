"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  Camera,
  Upload,
  Copy,
  RefreshCw,
  Sparkles,
  Heart,
  Zap,
  Coffee,
  Smile,
  Building2,
  User,
  LogOut,
  Moon,
  Sun,
  Palette,
  ArrowRight,
  Globe,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { useTheme } from "next-themes"

const COLOR_THEMES = [
  { name: "Classic", value: "classic", gradient: "from-gray-600 to-gray-800", color: "bg-gray-600" },
  { name: "Ocean", value: "ocean", gradient: "from-blue-600 to-cyan-600", color: "bg-blue-600" },
  { name: "Forest", value: "forest", gradient: "from-green-600 to-emerald-600", color: "bg-green-600" },
  { name: "Sunset", value: "sunset", gradient: "from-orange-600 to-pink-600", color: "bg-orange-600" },
  { name: "Purple", value: "purple", gradient: "from-purple-600 to-violet-600", color: "bg-purple-600" },
  { name: "Rose", value: "rose", gradient: "from-pink-600 to-rose-600", color: "bg-pink-600" },
  { name: "Mint", value: "mint", gradient: "from-teal-600 to-green-600", color: "bg-teal-600" },
]

const VIBE_OPTIONS = [
  { value: "casual", label: "ធម្មតា", labelEn: "Casual", icon: Coffee },
  { value: "professional", label: "វិជ្ជាជីវៈ", labelEn: "Professional", icon: Zap },
  { value: "fun", label: "កំសាន្ត", labelEn: "Fun & Playful", icon: Smile },
  { value: "inspirational", label: "បំផុសគំនិត", labelEn: "Inspirational", icon: Sparkles },
  { value: "trendy", label: "ទាន់សម័យ", labelEn: "Trendy", icon: Heart },
]

const BUSINESS_TYPES = [
  { value: "restaurant", label: "ភោជនីយដ្ឋាន/អាហារ", labelEn: "Restaurant/Food" },
  { value: "fashion", label: "ម៉ូដ/សម្លៀកបំពាក់", labelEn: "Fashion/Clothing" },
  { value: "technology", label: "បច្ចេកវិទ្យា", labelEn: "Technology" },
  { value: "healthcare", label: "សុខាភិបាល", labelEn: "Healthcare" },
  { value: "education", label: "អប់រំ", labelEn: "Education" },
  { value: "realestate", label: "អចលនទ្រព្យ", labelEn: "Real Estate" },
  { value: "tourism", label: "ទេសចរណ៍", labelEn: "Tourism" },
  { value: "beauty", label: "សម្រស់/គ្រឿងសម្អាង", labelEn: "Beauty/Cosmetics" },
  { value: "automotive", label: "យានយន្ត", labelEn: "Automotive" },
  { value: "finance", label: "ហិរញ្ញវត្ថុ", labelEn: "Finance" },
  { value: "other", label: "ផ្សេងៗ", labelEn: "Other" },
]

const TARGET_AUDIENCES = [
  { value: "young-adults", label: "យុវជន (១៨-២៥)", labelEn: "Young Adults (18-25)" },
  { value: "adults", label: "មនុស្សពេញវ័យ (២៦-៤០)", labelEn: "Adults (26-40)" },
  { value: "middle-aged", label: "វ័យកណ្តាល (៤១-៥៥)", labelEn: "Middle-aged (41-55)" },
  { value: "seniors", label: "មនុស្សចាស់ (៥៥+)", labelEn: "Seniors (55+)" },
  { value: "students", label: "និស្សិត", labelEn: "Students" },
  { value: "professionals", label: "អ្នកជំនាញ", labelEn: "Professionals" },
  { value: "parents", label: "ឪពុកម្តាយ", labelEn: "Parents" },
  { value: "entrepreneurs", label: "សហគ្រិន", labelEn: "Entrepreneurs" },
  { value: "general", label: "សាធារណជន", labelEn: "General Public" },
]

const BRAND_VOICES = [
  { value: "friendly", label: "មិត្តភាព និងងាយស្រួល", labelEn: "Friendly & Approachable" },
  { value: "professional", label: "វិជ្ជាជីវៈ និងអាជ្ញាធរ", labelEn: "Professional & Authoritative" },
  { value: "fun", label: "កំសាន្ត និងលេង", labelEn: "Fun & Playful" },
  { value: "sophisticated", label: "ទំនើប និងឆើតឆាយ", labelEn: "Sophisticated & Elegant" },
  { value: "bold", label: "ក្លាហាន និងច្នៃប្រឌិត", labelEn: "Bold & Edgy" },
  { value: "warm", label: "កក់ក្តៅ និងយកចិត្តទុកដាក់", labelEn: "Warm & Caring" },
  { value: "innovative", label: "ច្នៃប្រឌិត និងទំនើប", labelEn: "Innovative & Forward-thinking" },
]

const COMPANY_SIZES = [
  { value: "1-10", label: "១-១០ នាក់", labelEn: "1-10 employees" },
  { value: "11-50", label: "១១-៥០ នាក់", labelEn: "11-50 employees" },
  { value: "51-200", label: "៥១-២០០ នាក់", labelEn: "51-200 employees" },
  { value: "201-1000", label: "២០១-១០០០ នាក់", labelEn: "201-1000 employees" },
  { value: "1000+", label: "១០០០+ នាក់", labelEn: "1000+ employees" },
]

const MARKETING_GOALS = [
  { value: "brand-awareness", label: "ការស្គាល់ម៉ាក", labelEn: "Brand Awareness" },
  { value: "lead-generation", label: "បង្កើតអតិថិជនសក្តានុពល", labelEn: "Lead Generation" },
  { value: "sales", label: "ការលក់", labelEn: "Sales" },
  { value: "engagement", label: "ការចូលរួម", labelEn: "Engagement" },
  { value: "community", label: "បង្កើតសហគមន៍", labelEn: "Community Building" },
  { value: "retention", label: "រក្សាអតិថិជន", labelEn: "Customer Retention" },
  { value: "product-launch", label: "បើកដំណើរការផលិតផល", labelEn: "Product Launch" },
]

interface UserType {
  id: string
  email: string
  full_name?: string
}

interface CompanyProfile {
  id?: string
  user_id: string
  company_name: string
  business_type: string
  description: string
  target_audience: string
  brand_voice: string
  company_size: string
  industry_focus: string
  marketing_goals: string[]
  brand_colors: string
  website_url?: string
  social_handles?: string
  unique_selling_points: string
  created_at?: string
}

export default function Component() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "app">("landing")
  const [language, setLanguage] = useState<"km" | "en">("km")
  const [colorTheme, setColorTheme] = useState("classic")
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [captions, setCaptions] = useState<string[]>([])
  const [selectedVibe, setSelectedVibe] = useState("casual")
  const [customPrompt, setCustomPrompt] = useState("")
  const [selectedCaption, setSelectedCaption] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
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
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const supabase = createClient()
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0]

  const t = {
    km: {
      title: "ចំណង",
      titleEn: "(Jomnorng)",
      subtitle: "កម្មវិធីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយ AI",
      heroTitle: "បង្កើតចំណងជើងដ៏ទាក់ទាញ",
      heroSubtitle: "ប្រើប្រាស់ AI ដើម្បីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយស្វ័យប្រវត្តិ",
      getStarted: "ចាប់ផ្តើម",
      features: "លក្ខណៈពិសេស",
      aiPowered: "ដំណើរការដោយ AI",
      aiDesc: "ប្រើប្រាស់បច្ចេកវិទ្យា AI ទំនើបបំផុត",
      multilingual: "ពហុភាសា",
      multilingualDesc: "គាំទ្រភាសាខ្មែរ និងអង់គ្លេស",
      customizable: "អាចកែប្រែបាន",
      customizableDesc: "កែប្រែតាមរបៀបរបស់អ្នក",
      colorTheme: "ពណ៌ធីម",
      login: "ចូលគណនី",
      signup: "បង្កើតគណនី",
      email: "អ៊ីមែល",
      password: "លេខសម្ងាត់",
      fullName: "ឈ្មោះពេញ",
      logout: "ចាកចេញ",
      profile: "ព័ត៌មានផ្ទាល់ខ្លួន",
      uploadImage: "ផ្ទុករូបភាព",
      uploadDesc: "ថតរូប ផ្ទុកពីកាលេរី ឬបិទភ្ជាប់រូបភាព (Ctrl+V)",
      chooseFile: "ជ្រើសរើសឯកសារ",
      camera: "កាមេរ៉ា",
      uploadDifferent: "ផ្ទុករូបភាពផ្សេង",
      chooseVibe: "ជ្រើសរើសបែបបទ",
      customInstructions: "សេចក្តីណែនាំផ្ទាល់ខ្លួន",
      generateCaptions: "បង្កើតចំណងជើង",
      analyzingImage: "កំពុងវិភាគរូបភាព...",
      generatedCaptions: "ចំណងជើងដែលបានបង្កើត",
      editCaption: "កែសម្រួលចំណងជើង",
      copyCaption: "ចម្លងចំណងជើង",
      companyProfile: "ព័ត៌មានក្រុមហ៊ុន",
      saveProfile: "រក្សាទុកព័ត៌មាន",
      basicInfo: "ព័ត៌មានមូលដ្ឋាន",
      brandVoice: "ម៉ាក និងសំឡេង",
      goalsStrategy: "គោលដៅ និងយុទ្ធសាស្ត្រ",
      companyName: "ឈ្មោះក្រុមហ៊ុន",
      businessType: "ប្រភេទអាជីវកម្ម",
      companyDescription: "ការពិពណ៌នាក្រុមហ៊ុន",
      companySize: "ទំហំក្រុមហ៊ុន",
      websiteUrl: "គេហទំព័រ",
      targetAudience: "ទស្សនិកជនគោលដៅ",
      brandVoiceLabel: "សំឡេងម៉ាក",
      brandColors: "ពណ៌ម៉ាក",
      socialHandles: "គណនីបណ្តាញសង្គម",
      uniqueSellingPoints: "ចំណុចលក់ពិសេស",
      industryFocus: "ការផ្តោតលើឧស្សាហកម្ម",
      marketingGoals: "គោលដៅទីផ្សារ",
    },
    en: {
      title: "Jomnorng",
      titleEn: "(ចំណង)",
      subtitle: "AI-powered social media caption generator",
      heroTitle: "Create Engaging Captions",
      heroSubtitle: "Use AI to automatically generate social media captions",
      getStarted: "Get Started",
      features: "Features",
      aiPowered: "AI Powered",
      aiDesc: "Using the latest AI technology",
      multilingual: "Multilingual",
      multilingualDesc: "Supports Khmer and English",
      customizable: "Customizable",
      customizableDesc: "Customize to your style",
      colorTheme: "Color Theme",
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      logout: "Logout",
      profile: "Profile",
      uploadImage: "Upload Image",
      uploadDesc: "Take a photo, upload from gallery, or paste an image (Ctrl+V)",
      chooseFile: "Choose File",
      camera: "Camera",
      uploadDifferent: "Upload Different Image",
      chooseVibe: "Choose Your Vibe",
      customInstructions: "Custom Instructions",
      generateCaptions: "Generate Captions",
      analyzingImage: "Analyzing Image...",
      generatedCaptions: "Generated Captions",
      editCaption: "Edit Caption",
      copyCaption: "Copy Caption",
      companyProfile: "Company Profile",
      saveProfile: "Save Profile",
      basicInfo: "Basic Info",
      brandVoice: "Brand & Voice",
      goalsStrategy: "Goals & Strategy",
      companyName: "Company Name",
      businessType: "Business Type",
      companyDescription: "Company Description",
      companySize: "Company Size",
      websiteUrl: "Website URL",
      targetAudience: "Target Audience",
      brandVoiceLabel: "Brand Voice",
      brandColors: "Brand Colors",
      socialHandles: "Social Media Handles",
      uniqueSellingPoints: "Unique Selling Points",
      industryFocus: "Industry Focus",
      marketingGoals: "Marketing Goals",
    },
  }

  // Clear any stale auth data
  const clearAuthData = async () => {
    try {
      await supabase.auth.signOut()
      // Clear any local storage items related to auth
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token")
        sessionStorage.clear()
      }
    } catch (error) {
      console.log("Error clearing auth data:", error)
    }
  }

  // Authentication functions
  const handleAuth = async () => {
    setIsLoading(true)
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setCurrentView("app")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await clearAuthData()
    setUser(null)
    setCurrentView("landing")
    setShowFirstTimeSetup(false)
    setIsFirstTimeUser(false)
    setCompanyProfile({
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
  }

  // Load user and profile
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name,
          })
          setCurrentView("app")
          await loadCompanyProfile(user.id)
        } else {
          setCurrentView("landing")
        }
      } catch (error) {
        console.log("Error getting user:", error)
        await clearAuthData()
        setCurrentView("landing")
      } finally {
        setIsLoading(false)
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
        })
        setCurrentView("app")
        await loadCompanyProfile(session.user.id)
      } else {
        setUser(null)
        setCurrentView("landing")
        setShowFirstTimeSetup(false)
        setIsFirstTimeUser(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadCompanyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("company_profiles").select("*").eq("user_id", userId).single()

      if (error) {
        // Handle specific error cases
        if (error.code === "PGRST116" || error.message.includes("No rows found")) {
          // No profile found - first time user
          console.log("No profile found - first time user")
          setIsFirstTimeUser(true)
          setShowFirstTimeSetup(true)
          return
        } else if (error.code === "406" || error.message.includes("Not Acceptable")) {
          // User might be deleted from database but still has auth token
          console.log("User not found in database, clearing auth")
          await clearAuthData()
          setCurrentView("landing")
          return
        }
        throw error
      }

      if (data) {
        setCompanyProfile(data)
        setIsFirstTimeUser(false)
        setShowFirstTimeSetup(false)
      }
    } catch (error: any) {
      console.log("Error loading profile:", error)
      // If there's any error, treat as first time user
      setIsFirstTimeUser(true)
      setShowFirstTimeSetup(true)
    }
  }

  const skipFirstTimeSetup = async () => {
    if (!user) return

    setIsSavingProfile(true)
    try {
      // Create a minimal empty profile to mark that setup was attempted
      const emptyProfile = {
        user_id: user.id,
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
      }

      const { data, error } = await supabase.from("company_profiles").upsert([emptyProfile]).select()

      if (error) {
        console.log("Error saving empty profile:", error)
        // Even if save fails, still close the popup
      } else if (data && data[0]) {
        setCompanyProfile(data[0])
      }

      // Always close the popup regardless of save success
      setShowFirstTimeSetup(false)
      setIsFirstTimeUser(false)

      toast({
        title: language === "km" ? "រំលងបានជោគជ័យ!" : "Skipped successfully!",
        description: language === "km" ? "អ្នកអាចកំណត់ព័ត៌មានក្រុមហ៊ុននៅពេលក្រោយ" : "You can set up your company profile later.",
      })
    } catch (error) {
      console.log("Error in skip setup:", error)
      // Still close popup even on error
      setShowFirstTimeSetup(false)
      setIsFirstTimeUser(false)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const saveCompanyProfile = async (isFirstTime = false) => {
    if (!user) return

    setIsSavingProfile(true)
    try {
      const profileData = { ...companyProfile, user_id: user.id }
      const { data, error } = await supabase.from("company_profiles").upsert([profileData]).select()

      if (error) throw error

      if (data && data[0]) {
        setCompanyProfile(data[0])
      }

      if (isFirstTime) {
        setShowFirstTimeSetup(false)
        setIsFirstTimeUser(false)
      }

      toast({
        title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
        description: language === "km" ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក" : "Company profile saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleImageUpload = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImage(e.target?.result as string)
          setCaptions([])
          setSelectedCaption("")
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a valid image file.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith("image/")) {
            const file = items[i].getAsFile()
            if (file) {
              handleImageUpload(file)
            }
            break
          }
        }
      }
    },
    [handleImageUpload],
  )

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

  useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [handlePaste])

  const selectedVibeOption = VIBE_OPTIONS.find((v) => v.value === selectedVibe)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  // Landing Page
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <header className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-black dark:text-white">
                {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(value: "km" | "en") => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>

              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_THEMES.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                        {theme.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white">{t[language].heroTitle}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t[language].heroSubtitle}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentView("auth")}
                className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-3 text-lg`}
              >
                {t[language].getStarted}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{t[language].aiPowered}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t[language].aiDesc}</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                  >
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{t[language].multilingual}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t[language].multilingualDesc}</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                  >
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{t[language].customizable}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t[language].customizableDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Auth Page
  if (currentView === "auth") {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="text-center space-y-4">
            <Button variant="ghost" onClick={() => setCurrentView("landing")} className="absolute top-4 left-4 p-2">
              ← Back
            </Button>
            <div
              className={`mx-auto w-16 h-16 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t[language].subtitle}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t[language].login}</TabsTrigger>
                <TabsTrigger value="signup">{t[language].signup}</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t[language].email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t[language].password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t[language].fullName}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t[language].email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t[language].password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <Button
              onClick={handleAuth}
              className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
            >
              {authMode === "login" ? t[language].login : t[language].signup}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // First-time setup dialog
  if (showFirstTimeSetup && currentView === "app") {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="text-center space-y-4">
            <div
              className={`mx-auto w-16 h-16 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {language === "km" ? "សូមស្វាគមន៍មកកាន់ ចំណង!" : "Welcome to Jomnorng!"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {language === "km"
                  ? "សូមបំពេញព័ត៌មានក្រុមហ៊ុនរបស់អ្នក ដើម្បីទទួលបានចំណងជើងដែលកំណត់តាមតម្រូវការ"
                  : "Set up your company profile to get personalized captions"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {language === "km"
                  ? "អ្នកអាចរំលងជំហាននេះ ហើយបំពេញនៅពេលក្រោយ"
                  : "You can skip this step and fill it out later"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <CompanyProfileForm
              profile={companyProfile}
              setProfile={setCompanyProfile}
              onSave={() => saveCompanyProfile(true)}
              isSaving={isSavingProfile}
              language={language}
              t={t}
              currentTheme={currentTheme}
              isFirstTime={true}
            />
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={skipFirstTimeSetup} className="flex-1" disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "km" ? "កំពុងរំលង..." : "Skipping..."}
                  </>
                ) : language === "km" ? (
                  "រំលង"
                ) : (
                  "Skip for now"
                )}
              </Button>
              <Button
                onClick={() => saveCompanyProfile(true)}
                disabled={isSavingProfile}
                className={`flex-1 bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "km" ? "កំពុងរក្សាទុក..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    {language === "km" ? "រក្សាទុក និងបន្ត" : "Save & Continue"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main App
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center`}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">
                {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.full_name || user?.email}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value: "km" | "en") => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>

            <Select value={colorTheme} onValueChange={setColorTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLOR_THEMES.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                      {theme.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="icon" onClick={() => setShowProfile(true)}>
              <User className="w-4 h-4" />
            </Button>

            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t[language].companyProfile}
                  </DialogTitle>
                </DialogHeader>
                <CompanyProfileForm
                  profile={companyProfile}
                  setProfile={setCompanyProfile}
                  onSave={saveCompanyProfile}
                  isSaving={isSavingProfile}
                  language={language}
                  t={t}
                  currentTheme={currentTheme}
                />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                  <Camera className="w-5 h-5" />
                  {t[language].uploadImage}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center space-y-4 bg-gray-50 dark:bg-gray-800">
                    <div
                      className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-black dark:text-white">
                        {language === "km" ? "ផ្ទុករូបភាពដើម្បីចាប់ផ្តើម" : "Upload an image to get started"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t[language].uploadDesc}</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t[language].chooseFile}
                      </Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="w-4 h-4 mr-2" />
                        {t[language].camera}
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt="Uploaded image"
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImage(null)
                        setCaptions([])
                        setSelectedCaption("")
                      }}
                    >
                      {t[language].uploadDifferent}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vibe Selection */}
            {image && (
              <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Palette className="w-5 h-5" />
                    {t[language].chooseVibe}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {VIBE_OPTIONS.map((vibe) => {
                      const Icon = vibe.icon
                      return (
                        <Button
                          key={vibe.value}
                          variant={selectedVibe === vibe.value ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col gap-2 transition-all ${
                            selectedVibe === vibe.value
                              ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg`
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setSelectedVibe(vibe.value)}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium">{language === "km" ? vibe.label : vibe.labelEn}</span>
                        </Button>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-prompt">{t[language].customInstructions}</Label>
                    <Textarea
                      id="custom-prompt"
                      placeholder={
                        language === "km"
                          ? "បន្ថែមសេចក្តីណែនាំជាក់លាក់... (ព័ត៌មានក្រុមហ៊ុនរបស់អ្នកនឹងត្រូវបានរួមបញ្ចូលដោយស្វ័យប្រវត្តិ)"
                          : "Add specific instructions... (Your company profile will be automatically included)"
                      }
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 shadow-lg`}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t[language].analyzingImage}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t[language].generateCaptions}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Generated Captions */}
          <div className="space-y-6">
            {captions.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Heart className="w-5 h-5" />
                    {t[language].generatedCaptions}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedVibeOption && (
                      <Badge className={`bg-gradient-to-r ${currentTheme.gradient} text-white border-0`}>
                        <selectedVibeOption.icon className="w-3 h-3 mr-1" />
                        {language === "km" ? selectedVibeOption.label : selectedVibeOption.labelEn}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => analyzeImage()} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {captions.map((caption, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all border ${
                          selectedCaption === caption
                            ? `ring-2 ring-gray-400 dark:ring-gray-600 bg-gray-50 dark:bg-gray-800 shadow-lg`
                            : "hover:shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => setSelectedCaption(caption)}
                      >
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-white">
                            {caption}
                          </div>
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(caption)
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedCaption && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Label htmlFor="selected-caption">{t[language].editCaption}</Label>
                      <Textarea
                        id="selected-caption"
                        value={selectedCaption}
                        onChange={(e) => setSelectedCaption(e.target.value)}
                        rows={6}
                        className="resize-none bg-gray-50 dark:bg-gray-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(selectedCaption)}
                        className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {t[language].copyCaption}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Company Profile Form Component
function CompanyProfileForm({
  profile,
  setProfile,
  onSave,
  isSaving,
  language,
  t,
  currentTheme,
  isFirstTime = false,
}: {
  profile: CompanyProfile
  setProfile: (profile: CompanyProfile) => void
  onSave: () => void
  isSaving: boolean
  language: "km" | "en"
  t: any
  currentTheme: any
  isFirstTime?: boolean
}) {
  const handleMarketingGoalsChange = (goal: string, checked: boolean) => {
    const goals = checked ? [...profile.marketing_goals, goal] : profile.marketing_goals.filter((g) => g !== goal)
    setProfile({ ...profile, marketing_goals: goals })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t[language].basicInfo}</TabsTrigger>
          <TabsTrigger value="brand">{t[language].brandVoice}</TabsTrigger>
          <TabsTrigger value="goals">{t[language].goalsStrategy}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">{t[language].companyName}</Label>
              <Input
                id="company-name"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder={language === "km" ? "ឈ្មោះក្រុមហ៊ុនរបស់អ្នក" : "Your company name"}
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-type">{t[language].businessType}</Label>
              <Select
                value={profile.business_type}
                onValueChange={(value) => setProfile({ ...profile, business_type: value })}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                  <SelectValue placeholder={language === "km" ? "ជ្រើសរើសប្រភេទអាជីវកម្ម" : "Select business type"} />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {language === "km" ? type.label : type.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t[language].companyDescription}</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={4}
              placeholder={
                language === "km"
                  ? "ពិពណ៌នាអំពីអ្វីដែលក្រុមហ៊ុនរបស់អ្នកធ្វើ បេសកកម្ម និងអ្វីដែលធ្វើឱ្យអ្នកពិសេស..."
                  : "Describe what your company does, your mission, and what makes you unique..."
              }
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-size">{t[language].companySize}</Label>
              <Select
                value={profile.company_size}
                onValueChange={(value) => setProfile({ ...profile, company_size: value })}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                  <SelectValue placeholder={language === "km" ? "ជ្រើសរើសទំហំក្រុមហ៊ុន" : "Select company size"} />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {language === "km" ? size.label : size.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-url">{t[language].websiteUrl}</Label>
              <Input
                id="website-url"
                value={profile.website_url}
                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brand" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-audience">{t[language].targetAudience}</Label>
              <Select
                value={profile.target_audience}
                onValueChange={(value) => setProfile({ ...profile, target_audience: value })}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                  <SelectValue placeholder={language === "km" ? "ជ្រើសរើសទស្សនិកជនគោលដៅ" : "Select target audience"} />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_AUDIENCES.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {language === "km" ? audience.label : audience.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-voice">{t[language].brandVoiceLabel}</Label>
              <Select
                value={profile.brand_voice}
                onValueChange={(value) => setProfile({ ...profile, brand_voice: value })}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                  <SelectValue placeholder={language === "km" ? "ជ្រើសរើសសំឡេងម៉ាក" : "Select brand voice"} />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_VOICES.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {language === "km" ? voice.label : voice.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand-colors">{t[language].brandColors}</Label>
              <Input
                id="brand-colors"
                value={profile.brand_colors}
                onChange={(e) => setProfile({ ...profile, brand_colors: e.target.value })}
                placeholder={language === "km" ? "ឧ. ខៀវ ទង ស" : "e.g., Blue, Gold, White"}
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-handles">{t[language].socialHandles}</Label>
              <Input
                id="social-handles"
                value={profile.social_handles}
                onChange={(e) => setProfile({ ...profile, social_handles: e.target.value })}
                placeholder="@yourhandle, @company_fb"
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unique-selling-points">{t[language].uniqueSellingPoints}</Label>
            <Textarea
              id="unique-selling-points"
              value={profile.unique_selling_points}
              onChange={(e) => setProfile({ ...profile, unique_selling_points: e.target.value })}
              rows={3}
              placeholder={
                language === "km"
                  ? "អ្វីដែលធ្វើឱ្យក្រុមហ៊ុនរបស់អ្នកខុសគេ? អត្ថប្រយោជន៍សំខាន់ៗ រង្វាន់ វិញ្ញាបនបត្រ..."
                  : "What makes your company different? Key benefits, awards, certifications..."
              }
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industry-focus">{t[language].industryFocus}</Label>
            <Textarea
              id="industry-focus"
              value={profile.industry_focus}
              onChange={(e) => setProfile({ ...profile, industry_focus: e.target.value })}
              rows={3}
              placeholder={
                language === "km"
                  ? "ពិពណ៌នាការផ្តោតលើឧស្សាហកម្ម ជំនាញ និងទីតាំងទីផ្សាររបស់អ្នក..."
                  : "Describe your industry focus, specializations, and market position..."
              }
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="space-y-3">
            <Label>{t[language].marketingGoals}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MARKETING_GOALS.map((goal) => (
                <div key={goal.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={goal.value}
                    checked={profile.marketing_goals.includes(goal.value)}
                    onChange={(e) => handleMarketingGoalsChange(goal.value, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={goal.value} className="text-sm">
                    {language === "km" ? goal.label : goal.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {!isFirstTime && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {language === "km" ? "កំពុងរក្សាទុក..." : "Saving..."}
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 mr-2" />
              {t[language].saveProfile}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
