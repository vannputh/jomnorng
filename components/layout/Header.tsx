"use client"

import React from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building2,
} from "lucide-react"
import type { UserType, Language, CompanyProfile } from "@/lib/types"
import { getTranslations } from "@/lib/translations"
import HamburgerMenu from "./HamburgerMenu"

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
  user,
  language,
  setLanguage,
  showProfile,
  setShowProfile,
  onLogout,
  companyProfile,
  children,
}: HeaderProps) {
  const t = getTranslations(language)
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex items-center gap-4"> {/* Group logo/title with new navigation buttons */}
        <Link href={"/dashboard"} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Jomnorng Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {language === "km" ? "ចំណង" : "Jomnorng"}
            </h1>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2 ml-8"> {/* Navigation buttons for larger screens */}
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/captions")}
            className={
              pathname === "/dashboard/captions"
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }
          >
            {language === "km" ? "ចំណងជើង" : "Captions"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/images")}
            className={
              pathname === "/dashboard/images"
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }
          >
            {language === "km" ? "រូបភាព" : "Images"}
          </Button>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className="flex items-center">
        <HamburgerMenu
          user={user}
          language={language}
          setLanguage={setLanguage}
          onShowProfile={() => setShowProfile(true)}
          onLogout={onLogout}
          companyProfile={companyProfile}
        />
      </div>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t.companyProfile}
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
} 