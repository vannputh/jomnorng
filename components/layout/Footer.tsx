"use client"

import React from "react"
import { Heart } from "lucide-react"
import type { Language } from "@/lib/types"

interface FooterProps {
  language: Language
}

export default function Footer({ language }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {currentYear} {language === "km" ? "ចំណង" : "Jomnorng"}. {language === "km" ? "រក្សាសិទ្ធិគ្រប់យ៉ាង" : "All rights reserved"}.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {language === "km" ? "បានបង្កើតដោយ" : "Made with"}
            </span>
            <Heart className="w-4 h-4 text-teal-500 dark:text-teal-400 animate-pulse" />
            <span className="text-gray-600 dark:text-gray-300">
              {language === "km" ? "នៅកម្ពុជា" : "in Cambodia"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
} 