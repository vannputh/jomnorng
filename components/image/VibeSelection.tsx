"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Palette, Settings } from "lucide-react"
import type { Language, CompanyProfile } from "@/lib/types"
import { VIBE_OPTIONS } from "@/lib/constants"
import { getTranslations } from "@/lib/translations"

interface VibeSelectionProps {
  selectedVibe: string
  setSelectedVibe: (vibe: string) => void
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  language: Language
  onAnalyze: () => void
  isAnalyzing: boolean
  includeCompanyProfile?: boolean
  setIncludeCompanyProfile?: (include: boolean) => void
  localCompanyProfile?: CompanyProfile
  onShowProfile?: () => void
  captionLength?: string
  setCaptionLength?: (length: string) => void
  disabled?: boolean
}

export default function VibeSelection({
  selectedVibe,
  setSelectedVibe,
  customPrompt,
  setCustomPrompt,
  language,
  onAnalyze,
  isAnalyzing,
  includeCompanyProfile,
  setIncludeCompanyProfile,
  localCompanyProfile,
  onShowProfile,
  captionLength,
  setCaptionLength,
  disabled = false,
}: VibeSelectionProps) {
  const t = getTranslations(language)

  return (
    <Card className={`border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
          <Palette className="w-5 h-5" />
          {t.chooseVibe}
          {disabled && (
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {language === "km" ? "ចាក់សោ" : "Locked"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {VIBE_OPTIONS.map((vibe) => {
            const Icon = vibe.icon
            return (
              <Button
                key={vibe.value}
                variant={selectedVibe === vibe.value ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col gap-2 transition-all ${
                  selectedVibe === vibe.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => !disabled && setSelectedVibe(vibe.value)}
                disabled={disabled}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{language === "km" ? vibe.label : vibe.labelEn}</span>
              </Button>
            )
          })}
        </div>

        {/* Company Profile Toggle */}
        {setIncludeCompanyProfile && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="use-company-profile" className="text-sm font-medium">
                  {language === "km" ? "ប្រើប្រាស់ព័ត៌មានក្រុមហ៊ុន" : "Use Company Profile"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === "km" 
                    ? "ប្រើប្រាស់ព័ត៌មានក្រុមហ៊ុនដើម្បីបង្កើតចំណងជើងដែលត្រូវនឹងម៉ាក"
                    : "Use your company information to create brand-aligned captions"}
                </p>
              </div>
              <Switch
                id="use-company-profile"
                checked={includeCompanyProfile}
                onCheckedChange={disabled ? undefined : setIncludeCompanyProfile}
                disabled={disabled}
              />
            </div>
            
            {includeCompanyProfile && !localCompanyProfile?.company_name && onShowProfile && !disabled && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                  {language === "km" 
                    ? "អ្នកមិនបានបំពេញព័ត៌មានក្រុមហ៊ុនទេ។"
                    : "You haven't set up your company profile yet."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowProfile}
                  className="h-7 text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 border-yellow-300 dark:border-yellow-600"
                  disabled={disabled}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  {language === "km" ? "បំពេញព័ត៌មាន" : "Set up Profile"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Caption Length Selection */}
        {setCaptionLength && (
          <div className="space-y-2">
            <Label htmlFor="caption-length">
              {language === "km" ? "ប្រវែងចំណងជើង" : "Caption Length"}
            </Label>
            <Select value={captionLength} onValueChange={disabled ? undefined : setCaptionLength} disabled={disabled}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                <SelectValue placeholder={language === "km" ? "ជ្រើសរើសប្រវែង" : "Select length"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  {language === "km" ? "ខ្លី" : "Short"}
                </SelectItem>
                <SelectItem value="medium">
                  {language === "km" ? "មធ្យម" : "Medium"}
                </SelectItem>
                <SelectItem value="long">
                  {language === "km" ? "វែង" : "Long"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="custom-prompt">{t.customInstructions}</Label>
          <Textarea
            id="custom-prompt"
            placeholder={
              language === "km"
                ? "បន្ថែមសេចក្តីណែនាំជាក់លាក់..."
                : "Add specific instructions..."
            }
            value={customPrompt}
            onChange={(e) => !disabled && setCustomPrompt(e.target.value)}
            rows={3}
            className="bg-gray-50 dark:bg-gray-800"
            disabled={disabled}
          />
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || disabled}
          className="w-full shadow-lg"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.analyzingImage}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {disabled 
                ? (language === "km" ? "ចាក់សោ" : "Locked")
                : t.generateCaptions
              }
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 