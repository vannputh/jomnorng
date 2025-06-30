"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Library, Zap, BarChart3, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCompanyProfile } from "@/hooks/use-company-profile"
import { useToast } from "@/hooks/use-toast"
import type { Language, CompanyProfile } from "@/lib/types"

// Component imports
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics"
import CaptionsLibrary from "@/components/dashboard/CaptionsLibrary"
import QuickTemplates from "@/components/dashboard/QuickTemplates"
import CompanyProfileForm from "@/components/company/CompanyProfileForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>("km")
  const [showProfile, setShowProfile] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const router = useRouter()
  const { user, isLoading: authLoading, handleLogout } = useAuth()
  const {
    companyProfile: globalProfile,
    isFirstTimeUser,
    loadCompanyProfile,
    saveCompanyProfile,
    isSaving: globalSaving,
  } = useCompanyProfile(language)
  const { toast } = useToast()

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
      loadCompanyProfile(user.id, true) // Skip redirect, stay on dashboard
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
            isSaving={globalSaving}
            language={language}
          />
        </Header>

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {language === "km" 
              ? `សូមស្វាគមន៍ ${localCompanyProfile.company_name || user.email?.split('@')[0] || 'មិត្តភ័ក្តិ'}!`
              : `Welcome back, ${localCompanyProfile.company_name || user.email?.split('@')[0] || 'Friend'}!`
            }
          </h1>
          <p className="text-lg text-muted-foreground">
            {language === "km" 
              ? "តើអ្នកចង់បង្កើតចំណងជើងអ្វីថ្ងៃនេះ?" 
              : "What would you like to create today?"
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => router.push('/dashboard/generate')}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {language === "km" ? "បង្កើតចំណងជើង" : "Generate Captions"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "km" 
                    ? "ផ្ទុករូបភាពហើយបង្កើតចំណងជើង AI" 
                    : "Upload an image and create AI captions"
                  }
                </p>
              </div>
              <ArrowRight className="w-5 h-5 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>

          <Card 
            className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => setActiveTab('templates')}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {language === "km" ? "គំរូរហ័ស" : "Quick Templates"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "km" 
                    ? "ប្រើគំរូដែលបានបង្កើតរួចស្រេច" 
                    : "Use pre-made templates for quick posts"
                  }
                </p>
              </div>
              <ArrowRight className="w-5 h-5 mx-auto text-muted-foreground group-hover:text-yellow-600 transition-colors" />
            </CardContent>
          </Card>

          <Card 
            className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => setActiveTab('library')}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Library className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {language === "km" ? "បណ្ណាល័យ" : "My Library"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "km" 
                    ? "មើលចំណងជើងដែលបានបង្កើត" 
                    : "View your generated captions"
                  }
                </p>
              </div>
              <ArrowRight className="w-5 h-5 mx-auto text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "km" ? "ទិដ្ឋភាព" : "Overview"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "km" ? "គំរូ" : "Templates"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "km" ? "បណ្ណាល័យ" : "Library"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "km" ? "បង្កើត" : "Generate"}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardAnalytics userId={user.id} language={language} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <QuickTemplates language={language} />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <CaptionsLibrary userId={user.id} language={language} />
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">
                {language === "km" ? "បង្កើតចំណងជើងថ្មី" : "Create New Captions"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {language === "km" 
                  ? "ចូលទៅកាន់ទំព័របង្កើតដើម្បីផ្ទុករូបភាព និងបង្កើតចំណងជើង AI" 
                  : "Go to the generation page to upload images and create AI-powered captions"
                }
              </p>
              <Button 
                onClick={() => router.push('/dashboard/generate')}
                size="lg"
                className="mt-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === "km" ? "ចាប់ផ្តើម" : "Get Started"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Footer language={language} />
      </div>
    </div>
  )
} 