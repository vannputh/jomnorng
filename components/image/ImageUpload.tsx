"use client"

import React, { useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload } from "lucide-react"
import Image from "next/image"
import type { Language, ColorTheme } from "@/lib/types"
import { getTranslations } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  image: string | null
  setImage: (image: string | null) => void
  language: Language
  currentTheme: ColorTheme
  onReset: () => void
}

export default function ImageUpload({
  image,
  setImage,
  language,
  currentTheme,
  onReset,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const t = getTranslations(language)

  const handleImageUpload = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImage(e.target?.result as string)
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
    [setImage, toast],
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

  useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [handlePaste])

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
          <Camera className="w-5 h-5" />
          {t.uploadImage}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.uploadDesc}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t.chooseFile}
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Camera className="w-4 h-4 mr-2" />
                {t.camera}
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
            <Button variant="outline" onClick={onReset}>
              {t.uploadDifferent}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 