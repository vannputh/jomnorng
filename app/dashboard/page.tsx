"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Plus,
    Library,
    ArrowRight,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useToast } from "@/hooks/use-toast";
import type { CompanyProfile } from "@/lib/types";

// Component imports
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
    const { language, setLanguage } = useLanguage();
    const [showProfile, setShowProfile] = useState(false);

    const router = useRouter();
    const { user, isLoading: authLoading, handleLogout } = useAuth();
    const {
        companyProfile: globalProfile,
        isFirstTimeUser,
        loadCompanyProfile,
        saveCompanyProfile,
        isSaving: globalSaving,
    } = useCompanyProfile(language);
    const { toast } = useToast();

    // Local form state for the company profile
    const [localCompanyProfile, setLocalCompanyProfile] =
        useState<CompanyProfile>({
            user_id: "",
            company_name: "",
            business_type: "",
            description: "",
            target_audience: "",
            brand_voice: "",
            company_size: "",
            industry_focus: "",
            marketing_goals: [],
            brand_colors: "",
            website_url: "",
            social_handles: "",
            unique_selling_points: "",
        });

    // Flag to prevent clearing form data when user is actively editing
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasUserInput, setHasUserInput] = useState(false);

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Load company profile when user is available
    useEffect(() => {
        if (user) {
            loadCompanyProfile(user.id, true); // Skip redirect, stay on dashboard
        }
    }, [user, loadCompanyProfile]);

    // Update local state when global profile loads or changes (only on initial load)
    useEffect(() => {
        if (globalProfile.user_id && !isInitialized) {
            setLocalCompanyProfile(globalProfile);
            setIsInitialized(true);
        }
    }, [globalProfile, isInitialized]);

    // Set user_id when user is available (fallback)
    useEffect(() => {
        if (user && user.id && !localCompanyProfile.user_id) {
            setLocalCompanyProfile((prev: CompanyProfile) => ({
                ...prev,
                user_id: user.id,
            }));
        }
    }, [user, localCompanyProfile.user_id]);

    // Enhanced setter to track user input
    const updateLocalProfile = (
        updates: Partial<CompanyProfile> | CompanyProfile
    ) => {
        setHasUserInput(true);
        setLocalCompanyProfile((prev) => ({
            ...prev,
            ...updates,
        }));
    };

    // Custom save function that works with local state
    const handleSaveProfile = async () => {
        if (!user) return;

        // Use the hook's save function with local data
        const profileData = { ...localCompanyProfile, user_id: user.id };

        // Update global state without mutating it
        Object.assign(globalProfile, profileData);

        await saveCompanyProfile(false);

        // Reset the user input flag after successful save
        setHasUserInput(false);

        // Reload the profile to get the latest data
        await loadCompanyProfile(user.id, true);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to auth
    }

    const displayName =
        localCompanyProfile.company_name || user.full_name || "Friend";
    const currentHour = new Date().getHours();
    let greeting = language === "km" ? "សូមស្វាគមន៍" : "Welcome back";

    if (currentHour < 12) {
        greeting = language === "km" ? "អរុណសួស្តី" : "Good morning";
    } else if (currentHour < 18) {
        greeting = language === "km" ? "សួស្តី" : "Good afternoon";
    } else {
        greeting = language === "km" ? "សាយ័ណ្ណសួស្តី" : "Good evening";
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                <Header
                    user={user}
                    language={language}
                    setLanguage={setLanguage}
                    showProfile={showProfile}
                    setShowProfile={setShowProfile}
                    onLogout={handleLogout}
                    companyProfile={localCompanyProfile}
                >
                    <CompanyProfileForm
                        profile={localCompanyProfile}
                        setProfile={updateLocalProfile}
                        onSave={handleSaveProfile}
                        isSaving={globalSaving}
                        language={language}
                    />
                </Header>

                {/* Enhanced Welcome Section */}
                <div className="relative overflow-visible">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
                    <div className="relative text-center space-y-6 py-14 md:py-16 px-6 overflow-visible">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white leading-[1.4] mb-2 overflow-visible">
                                {greeting}, {displayName}!
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {language === "km"
                                    ? "តើអ្នកចង់បង្កើតចំណងជើងអ្វីថ្ងៃនេះ?"
                                    : "What would you like to create today?"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                        className="relative border border-gray-200 dark:border-gray-800 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        onClick={() => router.push("/dashboard/generate")}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {language === "km"
                                        ? "បង្កើតចំណងជើង"
                                        : "Generate Captions"}
                                </h3>
                                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                    {language === "km"
                                        ? "ផ្ទុករូបភាពហើយបង្កើតចំណងជើង AI ដែលគួរឱ្យទាក់ទាញ"
                                        : "Upload an image and create engaging AI-powered captions"}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                    <Sparkles className="w-4 h-4" />
                                    {language === "km"
                                        ? "រហ័ស និងកម្លាំង"
                                        : "Fast & Powerful"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="relative border border-gray-200 dark:border-gray-800 shadow-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        onClick={() => router.push("/dashboard/library")}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <Library className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                    {language === "km"
                                        ? "បណ្ណាល័យរបស់ខ្ញុំ"
                                        : "My Library"}
                                </h3>
                                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                                    {language === "km"
                                        ? "មើលនិងគ្រប់គ្រងចំណងជើងដែលបានបង្កើតរបស់អ្នក"
                                        : "View and manage your generated caption collection"}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="w-4 h-4" />
                                    {language === "km"
                                        ? "ស្ថិតិនិងការវិភាគ"
                                        : "Stats & Analytics"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content with enhanced container */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                    <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                        <DashboardAnalytics
                            userId={user.id}
                            language={language}
                        />
                    </div>
                </div>

                <Footer language={language} />
            </div>
        </div>
    );
}
