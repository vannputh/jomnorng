"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Building2, Upload, X } from "lucide-react"
import type { Language, CompanyProfile } from "@/lib/types"
import {
  BUSINESS_TYPES,
  TARGET_AUDIENCES,
  BRAND_VOICES,
  COMPANY_SIZES,
  MARKETING_GOALS,
} from "@/lib/constants"
import { getTranslations } from "@/lib/translations"
import { createClient } from "@/lib/supabase"

interface CompanyProfileFormProps {
  profile: CompanyProfile
  setProfile: (profile: CompanyProfile) => void
  onSave: () => void
  isSaving: boolean
  language: Language
  isFirstTime?: boolean
}

export default function CompanyProfileForm({
  profile,
  setProfile,
  onSave,
  isSaving,
  language,
  isFirstTime = false,
}: CompanyProfileFormProps) {
  const t = getTranslations(language)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMarketingGoalsChange = (goal: string, checked: boolean) => {
    const goals = checked ? [...profile.marketing_goals, goal] : profile.marketing_goals.filter((g) => g !== goal)
    setProfile({ ...profile, marketing_goals: goals })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === "km" ? "សូមជ្រើសរើសរូបភាព" : "Please select an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(language === "km" ? "រូបភាពធំពេក (អតិបរមា 10MB)" : "Image too large (max 10MB)")
      return
    }

    setIsUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`
      const filePath = `company-logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      setProfile({ ...profile, company_logo: publicUrl })
    } catch (error) {
      console.error('Upload error:', error)
      alert(language === "km" ? "បរាជ័យក្នុងការផ្ទុកឡើង" : "Failed to upload")
    } finally {
      setIsUploading(false)
    }
  }

  const clearLogo = () => {
    setProfile({ ...profile, company_logo: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t.basicInfo}</TabsTrigger>
          <TabsTrigger value="brand">{t.brandVoice}</TabsTrigger>
          <TabsTrigger value="goals">{t.goalsStrategy}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {/* Company Logo Upload */}
          <div className="space-y-2">
            <Label>{language === "km" ? "ស្លាកសញ្ញាក្រុមហ៊ុន" : "Company Logo"}</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 group">
                {profile.company_logo ? (
                  <>
                    <img
                      src={profile.company_logo}
                      alt="Company logo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={clearLogo}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </>
                ) : isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    {language === "km" ? "ផ្ទុកឡើង" : "Upload"}
                  </Button>
                </div>
                <Input
                  value={profile.company_logo || ""}
                  onChange={(e) => setProfile({ ...profile, company_logo: e.target.value })}
                  placeholder={language === "km" ? "ឬបិទភ្ជាប់ URL រូបភាព" : "Or paste image URL"}
                  className="bg-gray-50 dark:bg-gray-800 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">{t.companyName}</Label>
              <Input
                id="company-name"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder={language === "km" ? "ឈ្មោះក្រុមហ៊ុនរបស់អ្នក" : "Your company name"}
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-type">{t.businessType}</Label>
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
            <Label htmlFor="description">{t.companyDescription}</Label>
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
              <Label htmlFor="company-size">{t.companySize}</Label>
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
              <Label htmlFor="website-url">{t.websiteUrl}</Label>
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
              <Label htmlFor="target-audience">{t.targetAudience}</Label>
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
              <Label htmlFor="brand-voice">{t.brandVoiceLabel}</Label>
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
              <Label htmlFor="brand-colors">{t.brandColors}</Label>
              <Input
                id="brand-colors"
                value={profile.brand_colors}
                onChange={(e) => setProfile({ ...profile, brand_colors: e.target.value })}
                placeholder={language === "km" ? "ឧ. ខៀវ ទង ស" : "e.g., Blue, Gold, White"}
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-handles">{t.socialHandles}</Label>
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
            <Label htmlFor="unique-selling-points">{t.uniqueSellingPoints}</Label>
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
            <Label htmlFor="industry-focus">{t.industryFocus}</Label>
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
            <Label>{t.marketingGoals}</Label>
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
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {language === "km" ? "កំពុងរក្សាទុក..." : "Saving..."}
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 mr-2" />
              {t.saveProfile}
            </>
          )}
        </Button>
      )}
    </div>
  )
} 