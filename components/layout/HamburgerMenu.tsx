"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Sun, Moon, User, LogOut, Menu, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import type { UserType, Language, CompanyProfile } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface HamburgerMenuProps {
    user: UserType | null;
    language: Language;
    setLanguage: (language: Language) => void;
    onShowProfile: () => void;
    onLogout: () => void;
    companyProfile?: CompanyProfile;
}

export default function HamburgerMenu({
    user,
    language,
    setLanguage,
    onShowProfile,
    onLogout,
    companyProfile,
}: HamburgerMenuProps) {
    const { theme, setTheme } = useTheme();
    const t = getTranslations(language);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="w-4 h-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 flex flex-col h-full">
                <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <SheetTitle className="text-left text-teal-600 dark:text-teal-400">
                        {language === "km"
                            ? "ចំណង"
                            : "Jomnorng"}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col flex-1 mt-4 min-h-0">
                    {/* User Info */}
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === "km" ? "សួស្តី" : "Welcome"},{" "}
                            {user?.full_name || user?.email?.split("@")[0]}!
                        </p>
                    </div>

                    {/* Company Profile Section */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {t.companyProfile}
                        </h4>

                        {companyProfile?.company_name ? (
                            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-200 dark:border-teal-800 mb-3">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-teal-900 dark:text-teal-100 text-sm">
                                            {companyProfile.company_name}
                                        </h3>
                                        {companyProfile.business_type && (
                                            <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                                                {companyProfile.business_type}
                                            </p>
                                        )}
                                    </div>
                                    <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                                </div>

                                {companyProfile.industry_focus && (
                                    <p className="text-xs text-teal-600 dark:text-teal-400 mb-2">
                                        🏢 {companyProfile.industry_focus}
                                    </p>
                                )}

                                {companyProfile.target_audience && (
                                    <p className="text-xs text-teal-600 dark:text-teal-400 mb-2">
                                        🎯 {companyProfile.target_audience}
                                    </p>
                                )}

                                {companyProfile.brand_voice && (
                                    <p className="text-xs text-teal-600 dark:text-teal-400">
                                        💬 {companyProfile.brand_voice}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 mb-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {language === "km"
                                        ? "មិនទាន់បានកំណត់ព័ត៌មានក្រុមហ៊ុន"
                                        : "No company profile set up"}
                                </p>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full justify-center text-teal-600 border-teal-200 dark:border-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-medium"
                            onClick={() => {
                                onShowProfile();
                                setIsOpen(false);
                            }}
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            {companyProfile?.company_name
                                ? language === "km"
                                    ? "កែប្រែព័ត៌មាន"
                                    : "Edit Profile"
                                : language === "km"
                                ? "កំណត់ព័ត៌មាន"
                                : "Set Up Profile"}
                        </Button>
                    </div>

                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto py-4">
                        {/* Settings Section */}
                        <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                {language === "km" ? "ការកំណត់" : "Settings"}
                            </h4>

                            <div className="space-y-3">
                                {/* Theme Toggle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {language === "km"
                                            ? "រៀបចំពន្លឺ"
                                            : "Theme"}
                                    </label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() =>
                                            setTheme(
                                                theme === "dark"
                                                    ? "light"
                                                    : "dark"
                                            )
                                        }
                                    >
                                        {theme === "dark" ? (
                                            <Sun className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Moon className="w-4 h-4 mr-2" />
                                        )}
                                        {theme === "dark"
                                            ? language === "km"
                                                ? "ពន្លឺ"
                                                : "Light"
                                            : language === "km"
                                            ? "ងងឹត"
                                            : "Dark"}
                                    </Button>
                                </div>

                                {/* Language Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {language === "km"
                                            ? "ភាសា"
                                            : "Language"}
                                    </label>
                                    <div className="px-1">
                                        <Select
                                            value={language}
                                            onValueChange={(value: Language) =>
                                                setLanguage(value)
                                            }
                                        >
                                            <SelectTrigger className="w-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 h-9 text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="km">
                                                    🇰🇭 ខ្មែរ
                                                </SelectItem>
                                                <SelectItem value="en">
                                                    🇬🇧 English
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Account Section at bottom */}
                    <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {language === "km" ? "គណនី" : "Account"}
                        </h4>
                        <Button
                            variant="outline"
                            className="w-full justify-center border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {language === "km" ? "ចាកចេញ" : "Sign Out"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
