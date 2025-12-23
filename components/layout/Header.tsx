"use client"

import React from "react"
import GlassSurface from "@/components/ui/GlassSurface"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import PillNav from "@/components/ui/PillNav"
import { useTheme } from "next-themes"
import { Moon, Sun, LogOut } from "lucide-react"
import type { UserType, Language, CompanyProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  user: UserType | null
  language: Language
  setLanguage: (language: Language) => void
  showProfile: boolean
  setShowProfile: (show: boolean) => void
  onLogout: () => void
  companyProfile?: CompanyProfile
  children?: React.ReactNode
}

export default function Header({
  language,
  setLanguage,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // GlassSurface Brightness based on theme
  const glassBrightness = theme === "dark" ? 10 : 90

  // Highlight color (for hover blobs and active dots)
  const highlightColor = theme === "dark" ? "#ffffff" : "#000000"

  // Text color
  const textColor = theme === "dark" ? "#ffffff" : "#000000"

  // Hover text color (inverse of highlight)
  const hoverTextColor = theme === "dark" ? "#000000" : "#ffffff"

  // Pill background (transparent as requested)
  const pillColor = "transparent"

  const navItems = [
    { label: language === "km" ? "ទំព័រដើម" : "Dashboard", href: "/dashboard" },
    { label: language === "km" ? "រូបភាព" : "Images", href: "/dashboard/images" },
    { label: language === "km" ? "ចំណងជើង" : "Captions", href: "/dashboard/captions" },
    { label: language === "km" ? "បណ្ណាល័យ" : "Library", href: "/dashboard/library" },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 pt-6 pointer-events-none">
      {/* Bubble 1: Logo */}
      <div className="pointer-events-auto justify-self-start">
        <GlassSurface
          width={48}
          height={48}
          borderRadius={50}
          opacity={0.6}
          blur={10}
          brightness={glassBrightness}
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-full h-full transition-transform hover:scale-105"
          >
            <div className="relative w-8 h-8">
              <Image
                src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                alt="Jomnorng Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </GlassSurface>
      </div>

      {/* Bubble 2: Menu */}
      <div className="pointer-events-auto justify-self-center">
        <PillNav
          items={navItems}
          activeHref={pathname}
          baseColor={highlightColor}
          pillColor={pillColor}
          pillTextColor={textColor}
          hoveredPillTextColor={hoverTextColor}
          brightness={glassBrightness}
        />
      </div>

      {/* Bubble 3: Theme & Language */}
      <div className="pointer-events-auto justify-self-end">
        <GlassSurface
          width={140}
          height={42}
          borderRadius={50}
          opacity={0.6}
          blur={10}
          brightness={glassBrightness}
        >
          <div className="flex items-center justify-center gap-2 w-full h-full px-2">
            {/* Toggle Theme */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-full hover:bg-white/20"
              style={{ color: textColor }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Toggle Language */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "km" ? "en" : "km")}
              className="w-8 h-8 rounded-full hover:bg-white/20"
              style={{ color: textColor }}
            >
              <span className="font-bold text-xs">{language === "km" ? "KM" : "EN"}</span>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="w-8 h-8 rounded-full hover:bg-white/20 hover:text-red-500"
              style={{ color: textColor }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </GlassSurface>
      </div>
    </div>
  )
}