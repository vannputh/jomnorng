import { useState, useCallback } from "react"
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
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = typeof window !== "undefined" ? createClient() : null

  const loadCompanyProfile = useCallback(async (userId: string, skipRedirect = false) => {
    if (!supabase || !userId) return
    
    setIsLoading(true)
    try {
      console.log("Loading company profile for user:", userId)
      
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()

      if (error) {
        console.error("Database error loading profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        console.log("Profile loaded successfully:", data)
        setCompanyProfile(data as unknown as CompanyProfile)
        setIsFirstTimeUser(false)
      } else {
        console.log("No profile found - first time user")
        setIsFirstTimeUser(true)
        setCompanyProfile({
          user_id: userId,
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
        if (!skipRedirect) {
          router.push("/setup")
        }
      }
    } catch (error: any) {
      console.error("Error loading profile:", {
        message: error?.message || "Unknown error",
        error: error,
        userId: userId
      })
      setIsFirstTimeUser(true)
      setCompanyProfile(prev => ({ ...prev, user_id: userId }))
      if (!skipRedirect) {
        router.push("/setup")
      }
    } finally {
      setIsLoading(false)
    }
  }, [supabase, router])

  // Manual upsert function that doesn't rely on database constraints
  const saveCompanyProfile = async (redirectToDashboard = false) => {
    if (!supabase) return
    
    setIsSaving(true)
    try {
      if (!companyProfile.user_id) {
        throw new Error("User ID is required to save company profile")
      }
      
      console.log("Saving company profile:", companyProfile)
      
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("user_id", companyProfile.user_id)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing profile:", checkError)
        throw checkError
      }

      let data, error

      if (existingProfile) {
        // Update existing profile
        console.log("Updating existing profile with id:", existingProfile.id)
        const result = await supabase
          .from("company_profiles")
          .update(companyProfile as any)
          .eq("user_id", companyProfile.user_id)
          .select()
          .single()
        
        data = result.data
        error = result.error
      } else {
        // Insert new profile
        console.log("Creating new profile")
        const result = await supabase
          .from("company_profiles")
          .insert([companyProfile as any])
          .select()
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) {
        console.error("Error saving profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        console.log("Profile saved successfully:", data)
        setCompanyProfile(data as unknown as CompanyProfile)
      }

      setIsFirstTimeUser(false)

      toast({
        title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
        description: language === "km" ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក" : "Company profile saved successfully.",
      })

      if (redirectToDashboard) {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Save profile error:", error)
      toast({
        title: "Error",
        description: `Failed to save profile: ${error?.message || "Unknown error"}`,
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
      const minimalProfile = {
        ...companyProfile,
        company_name: companyProfile.company_name || "My Company",
      }

      // Use the same manual upsert logic
      const { data: existingProfile } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("user_id", companyProfile.user_id)
        .maybeSingle()

      let data, error

      if (existingProfile) {
        const result = await supabase
          .from("company_profiles")
          .update(minimalProfile as any)
          .eq("user_id", companyProfile.user_id)
          .select()
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from("company_profiles")
          .insert([minimalProfile as any])
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) {
        console.error("Error saving minimal profile:", error)
        // Don't throw error for skip - just proceed
      }

      if (data) {
        setCompanyProfile(data as unknown as CompanyProfile)
      }

      setIsFirstTimeUser(false)

      toast({
        title: language === "km" ? "រំលងបានជោគជ័យ!" : "Skipped successfully!",
        description: language === "km" ? "អ្នកអាចកំណត់ព័ត៌មានក្រុមហ៊ុននៅពេលក្រោយ" : "You can set up your company profile later.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error in skip setup:", error)
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
    isLoading,
    loadCompanyProfile,
    saveCompanyProfile,
    skipSetup,
  }
} 