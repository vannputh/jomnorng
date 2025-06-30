export interface UserType {
  id: string
  email: string
  full_name?: string
}

export interface CompanyProfile {
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

export type Language = "km" | "en"
export type AuthMode = "login" | "signup"
export type CurrentView = "landing" | "auth" | "app"

export interface VibeOption {
  value: string
  label: string
  labelEn: string
  icon: any
}

export interface BusinessType {
  value: string
  label: string
  labelEn: string
}

export interface TargetAudience {
  value: string
  label: string
  labelEn: string
}

export interface BrandVoice {
  value: string
  label: string
  labelEn: string
}

export interface CompanySize {
  value: string
  label: string
  labelEn: string
}

export interface MarketingGoal {
  value: string
  label: string
  labelEn: string
}

export interface ColorTheme {
  name: string
  value: string
  gradient: string
  color: string
} 