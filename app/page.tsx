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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { useTheme } from "next-themes"

const VIBE_OPTIONS = [
  { value: "casual", label: "ធម្មតា", labelEn: "Casual", icon: Coffee, gradient: "from-amber-500 to-orange-500" },
  {
    value: "professional",
    label: "វិជ្ជាជីវៈ",
    labelEn: "Professional",
    icon: Zap,
    gradient: "from-blue-500 to-indigo-500",
  },
  { value: "fun", label: "កំសាន្ត", labelEn: "Fun & Playful", icon: Smile, gradient: "from-pink-500 to-rose-500" },
  {
    value: "inspirational",
    label: "បំផុសគំនិត",
    labelEn: "Inspirational",
    icon: Sparkles,
    gradient: "from-purple-500 to-violet-500",
  },
  { value: "trendy", label: "ទាន់សម័យ", labelEn: "Trendy", icon: Heart, gradient: "from-red-500 to-pink-500" },
]

const BUSINESS_TYPES = [
  "Restaurant/Food",
  "Fashion/Clothing",
  "Technology",
  "Healthcare",
  "Education",
  "Real Estate",
  "Tourism",
  "Beauty/Cosmetics",
  "Automotive",
  "Finance",
  "Other",
]

const TARGET_AUDIENCES = [
  "Young Adults (18-25)",
  "Adults (26-40)",
  "Middle-aged (41-55)",
  "Seniors (55+)",
  "Students",
  "Professionals",
  "Parents",
  "Entrepreneurs",
  "General Public",
]

const BRAND_VOICES = [
  "Friendly & Approachable",
  "Professional & Authoritative",
  "Fun & Playful",
  "Sophisticated & Elegant",
  "Bold & Edgy",
  "Warm & Caring",
  "Innovative & Forward-thinking",
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
  const [language, setLanguage] = useState<"km" | "en">("km")
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
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

  const t = {
    km: {
      title: "ចំណង",
      titleEn: "(Jomnorng)",
      subtitle: "កម្មវិធីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយ AI",
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
    },
    en: {
      title: "Jomnorng",
      titleEn: "(ចំណង)",
      subtitle: "AI-powered social media caption generator",
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
    },
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
        setShowAuth(false)
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
    await supabase.auth.signOut()
    setUser(null)
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name,
        })
        loadCompanyProfile(user.id)
      }
      setIsLoading(false)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
        })
        loadCompanyProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadCompanyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("company_profiles").select("*").eq("user_id", userId).single()

      if (data) {
        setCompanyProfile(data)
      }
    } catch (error) {
      console.log("No profile found")
    }
  }

  const saveCompanyProfile = async () => {
    if (!user) return

    setIsSavingProfile(true)
    try {
      const profileData = { ...companyProfile, user_id: user.id }
      const { data, error } = await supabase.from("company_profiles").upsert([profileData]).select()

      if (error) throw error

      if (data && data[0]) {
        setCompanyProfile(data[0])
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{t[language].subtitle}</p>
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
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t[language].password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 dark:bg-gray-700/50"
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
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t[language].email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t[language].password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {authMode === "login" ? t[language].login : t[language].signup}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {language === "km" ? "ចំណង (Jomnorng)" : "Jomnorng (ចំណង)"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.full_name || user.email}!</p>
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

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </DialogTrigger>
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
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  {t[language].uploadImage}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-8 text-center space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {language === "km" ? "ផ្ទុករូបភាពដើម្បីចាប់ផ្តើម" : "Upload an image to get started"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t[language].uploadDesc}</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
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
                              ? `bg-gradient-to-r ${vibe.gradient} text-white shadow-lg`
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
                        language === "km" ? "បន្ថែមសេចក្តីណែនាំជាក់លាក់..." : "Add specific instructions for your caption..."
                      }
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                      className="bg-white/50 dark:bg-gray-700/50"
                    />
                  </div>

                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
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
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    {t[language].generatedCaptions}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedVibeOption && (
                      <Badge className={`bg-gradient-to-r ${selectedVibeOption.gradient} text-white border-0`}>
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
                        className={`cursor-pointer transition-all border-0 ${
                          selectedCaption === caption
                            ? "ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg"
                            : "hover:shadow-md bg-white/50 dark:bg-gray-700/50"
                        }`}
                        onClick={() => setSelectedCaption(caption)}
                      >
                        <CardContent className="p-4">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">{caption}</div>
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
                    <div className="space-y-3 pt-4 border-t">
                      <Label htmlFor="selected-caption">{t[language].editCaption}</Label>
                      <Textarea
                        id="selected-caption"
                        value={selectedCaption}
                        onChange={(e) => setSelectedCaption(e.target.value)}
                        rows={6}
                        className="resize-none bg-white/50 dark:bg-gray-700/50"
                      />
                      <Button
                        onClick={() => copyToClipboard(selectedCaption)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
}: {
  profile: CompanyProfile
  setProfile: (profile: CompanyProfile) => void
  onSave: () => void
  isSaving: boolean
  language: "km" | "en"
}) {
  const handleMarketingGoalsChange = (goal: string, checked: boolean) => {
    const goals = checked ? [...profile.marketing_goals, goal] : profile.marketing_goals.filter((g) => g !== goal)
    setProfile({ ...profile, marketing_goals: goals })
  }

  const marketingGoals = [
    "Brand Awareness",
    "Lead Generation",
    "Sales",
    "Engagement",
    "Community Building",
    "Customer Retention",
    "Product Launch",
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="brand">Brand & Voice</TabsTrigger>
          <TabsTrigger value="goals">Goals & Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select
                value={profile.business_type}
                onValueChange={(value) => setProfile({ ...profile, business_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={4}
              placeholder="Describe what your company does, your mission, and what makes you unique..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-size">Company Size</Label>
              <Select
                value={profile.company_size}
                onValueChange={(value) => setProfile({ ...profile, company_size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                value={profile.website_url}
                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brand" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Select
                value={profile.target_audience}
                onValueChange={(value) => setProfile({ ...profile, target_audience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_AUDIENCES.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-voice">Brand Voice</Label>
              <Select
                value={profile.brand_voice}
                onValueChange={(value) => setProfile({ ...profile, brand_voice: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand voice" />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_VOICES.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand-colors">Brand Colors</Label>
              <Input
                id="brand-colors"
                value={profile.brand_colors}
                onChange={(e) => setProfile({ ...profile, brand_colors: e.target.value })}
                placeholder="e.g., Blue, Gold, White"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-handles">Social Media Handles</Label>
              <Input
                id="social-handles"
                value={profile.social_handles}
                onChange={(e) => setProfile({ ...profile, social_handles: e.target.value })}
                placeholder="@yourhandle, @company_fb"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unique-selling-points">Unique Selling Points</Label>
            <Textarea
              id="unique-selling-points"
              value={profile.unique_selling_points}
              onChange={(e) => setProfile({ ...profile, unique_selling_points: e.target.value })}
              rows={3}
              placeholder="What makes your company different? Key benefits, awards, certifications..."
            />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industry-focus">Industry Focus</Label>
            <Textarea
              id="industry-focus"
              value={profile.industry_focus}
              onChange={(e) => setProfile({ ...profile, industry_focus: e.target.value })}
              rows={3}
              placeholder="Describe your industry focus, specializations, and market position..."
            />
          </div>

          <div className="space-y-3">
            <Label>Marketing Goals</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {marketingGoals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={goal}
                    checked={profile.marketing_goals.includes(goal)}
                    onChange={(e) => handleMarketingGoalsChange(goal, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={goal} className="text-sm">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4 mr-2" />
            Save Profile
          </>
        )}
      </Button>
    </div>
  )
}
