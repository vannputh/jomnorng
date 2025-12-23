"use client"

import React from "react"
import { Heart } from "lucide-react"
import GlassSurface from "@/components/ui/GlassSurface"
import { useTheme } from "next-themes"
import type { Language } from "@/lib/types"

interface FooterProps {
  language: Language
}

export default function Footer({ language }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()

  // GlassSurface Brightness based on theme
  const glassBrightness = theme === "dark" ? 10 : 90

  return (
    <footer className="mt-auto w-full flex justify-center pb-6 relative z-10 pointer-events-none">
      <div className="pointer-events-auto">
        <GlassSurface
          width="auto"
          height="auto"
          borderRadius={50}
          opacity={0.6}
          blur={10}
          brightness={glassBrightness}
          className="border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
        >
          <div className="px-6 py-3 flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              © {currentYear} {language === "km" ? "ចំណង" : "Jomnorng"}. {language === "km" ? "រក្សាសិទ្ធិគ្រប់យ៉ាង" : "All rights reserved"}.
            </p>
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="text-gray-600 dark:text-gray-300">
                {language === "km" ? "បានបង្កើតដោយ" : "Made with"}
              </span>
              <Heart className="w-4 h-4 text-teal-500 dark:text-teal-400 animate-pulse" />
              <span className="text-gray-600 dark:text-gray-300">
                {language === "km" ? "នៅកម្ពុជា" : "in Cambodia"}
              </span>
            </div>
          </div>
        </GlassSurface>
      </div>
    </footer>
  )
} 