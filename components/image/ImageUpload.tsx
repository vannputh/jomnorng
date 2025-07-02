"use client"

import React, { useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload } from "lucide-react"
import Image from "next/image"
import type { Language } from "@/lib/types"
import { getTranslations } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  image: string | null
  setImage: (image: string | null) => void
  language: Language
  onReset: () => void
  disabled?: boolean
}

export default function ImageUpload({
  image,
  setImage,
  language,
  onReset,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const t = getTranslations(language)

  const handleImageUpload = useCallback(
    (file: File) => {
      if (disabled) return
      
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
    [setImage, toast, disabled],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const file = e.target?.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return
      
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
    [handleImageUpload, disabled],
  )

  useEffect(() => {
    if (!disabled) {
      document.addEventListener("paste", handlePaste)
      return () => document.removeEventListener("paste", handlePaste)
    }
  }, [handlePaste, disabled])

  return (
    <Card className={`h-full border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-black dark:text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t.uploadImage}
            {disabled && (
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {language === "km" ? "ចាក់សោ" : "Locked"}
              </span>
            )}
          </div>
          {image && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onReset} 
              disabled={disabled}
            >
              {t.changeImage}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {!image ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center space-y-4 bg-gray-50 dark:bg-gray-800 flex-1 flex flex-col justify-center">
            <div
              className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center"
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
                onClick={() => !disabled && fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t.chooseFile}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => !disabled && fileInputRef.current?.click()}
                disabled={disabled}
              >
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
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 flex-1 flex items-center">
            <div className="aspect-video w-full max-w-md mx-auto">
              <Image
                src={image || "/placeholder.svg"}
                alt="Uploaded image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 