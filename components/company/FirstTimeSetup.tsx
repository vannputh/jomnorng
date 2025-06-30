"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, Building2 } from "lucide-react"
import type { Language, CompanyProfile } from "@/lib/types"
import { getTranslations } from "@/lib/translations"
import CompanyProfileForm from "./CompanyProfileForm"

interface FirstTimeSetupProps {
  language: Language
  companyProfile: CompanyProfile
  setCompanyProfile: (profile: CompanyProfile) => void
  onSave: () => void
  onSkip: () => void
  isSaving: boolean
}

export default function FirstTimeSetup({
  language,
  companyProfile,
  setCompanyProfile,
  onSave,
  onSkip,
  isSaving,
}: FirstTimeSetupProps) {
  const t = getTranslations(language)

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
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
            onSave={onSave}
            isSaving={isSaving}
            language={language}
            isFirstTime={true}
          />
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onSkip} className="flex-1" disabled={isSaving}>
              {isSaving ? (
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
              onClick={onSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
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