import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { CompanyProfile, Language } from "@/lib/types"

export function useCompanyProfile(language: Language) {
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
  const [isSaving, setIsSaving] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = typeof window !== "undefined" ? createClient() : null

  const loadCompanyProfile = async (userId: string) => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase.from("company_profiles").select("*").eq("user_id", userId).single()

      if (error) {
        if (error.code === "PGRST116" || error.message.includes("No rows found")) {
          console.log("No profile found - first time user")
          setIsFirstTimeUser(true)
          router.push("/setup")
          return
        } else if (error.code === "406" || error.message.includes("Not Acceptable")) {
          console.log("User not found in database")
          router.push("/auth")
          return
        }
        throw error
      }

      if (data) {
        setCompanyProfile(data as unknown as CompanyProfile)
        setIsFirstTimeUser(false)
      }
    } catch (error: any) {
      console.log("Error loading profile:", error)
      setIsFirstTimeUser(true)
      router.push("/setup")
    }
  }

  const saveCompanyProfile = async (redirectToDashboard = false) => {
    if (!supabase) return
    
    setIsSaving(true)
    try {
      const { data, error } = await supabase.from("company_profiles").upsert([companyProfile as any]).select()

      if (error) throw error

      if (data && data[0]) {
        setCompanyProfile(data[0] as unknown as CompanyProfile)
      }

      setIsFirstTimeUser(false)

      toast({
        title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
        description: language === "km" ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក" : "Company profile saved successfully.",
      })

      if (redirectToDashboard) {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const skipSetup = async () => {
    if (!supabase) return
    
    setIsSaving(true)
    try {
      const emptyProfile = {
        ...companyProfile,
        // Keep user_id but reset other fields to empty
      }

      const { data, error } = await supabase.from("company_profiles").upsert([emptyProfile as any]).select()

      if (error) {
        console.log("Error saving empty profile:", error)
      } else if (data && data[0]) {
        setCompanyProfile(data[0] as unknown as CompanyProfile)
      }

      setIsFirstTimeUser(false)

      toast({
        title: language === "km" ? "រំលងបានជោគជ័យ!" : "Skipped successfully!",
        description: language === "km" ? "អ្នកអាចកំណត់ព័ត៌មានក្រុមហ៊ុននៅពេលក្រោយ" : "You can set up your company profile later.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.log("Error in skip setup:", error)
      router.push("/dashboard")
    } finally {
      setIsSaving(false)
    }
  }

  return {
    companyProfile,
    setCompanyProfile,
    isSaving,
    isFirstTimeUser,
    loadCompanyProfile,
    saveCompanyProfile,
    skipSetup,
  }
} 