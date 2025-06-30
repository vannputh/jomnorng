"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Loader2,
    Copy,
    RefreshCw,
    Sparkles,
    Building2,
    User,
    LogOut,
    Moon,
    Sun,
    Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase";
import { useTheme } from "next-themes";

import { COLOR_THEMES } from "@/app/data/color-themes";
import { VIBE_OPTIONS } from "@/app/data/vibe-options";
import { COMPANY_SIZES } from "@/app/data/company-sizes";
import { MARKETING_GOALS } from "@/app/data/marketing-goals";
import { TARGET_AUDIENCES } from "./data/target-audiences";
import { BUSINESS_TYPES } from "./data/business-types";
import { BRAND_VOICES } from "./data/brand-voices";

import { t } from "@/app/data/translate";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import VibeSelector from "@/components/VibeSelector";
import ImageUploader from "@/components/ImageUploader";
import CaptionsDisplay from "@/components/CaptionsDisplay";
import FirstTimeSetup from "@/components/FirstTimeSetup";
import CompanyProfileForm, {
    CompanyProfile,
} from "@/components/CompanyProfileForm";

export interface UserType {
    id: string;
    email: string;
    full_name?: string;
}

export default function Component() {
    const [currentView, setCurrentView] = useState<"landing" | "auth" | "app">(
        "landing"
    );
    const [language, setLanguage] = useState<"km" | "en">("km");
    const [colorTheme, setColorTheme] = useState("classic");
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [captions, setCaptions] = useState<string[]>([]);
    const [selectedVibe, setSelectedVibe] = useState("casual");
    const [customPrompt, setCustomPrompt] = useState("");
    const [selectedCaption, setSelectedCaption] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
        //*
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
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const supabase = createClient();
    const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

    const currentTheme =
        COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0];

    // Clear any stale auth data
    const clearAuthData = async () => {
        try {
            // Sign out from Supabase
            await supabase.auth.signOut();

            // Clear any local storage items related to auth
            if (typeof window !== "undefined") {
                // Clear Supabase auth tokens
                const keys = Object.keys(localStorage);
                keys.forEach((key) => {
                    if (
                        key.startsWith("supabase.auth") ||
                        key.includes("auth")
                    ) {
                        localStorage.removeItem(key);
                    }
                });

                // Clear session storage
                sessionStorage.clear();

                console.log("Auth data cleared successfully");
            }
        } catch (error) {
            console.error("Error clearing auth data:", error);
            // Even if there's an error, try to clear local storage
            if (typeof window !== "undefined") {
                try {
                    localStorage.removeItem("supabase.auth.token");
                    sessionStorage.clear();
                } catch (storageError) {
                    console.error("Error clearing storage:", storageError);
                }
            }
        }
    };

    // Authentication functions
    const handleAuth = async () => {
        setIsLoading(true);
        try {
            if (authMode === "signup") {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                toast({
                    title: "Success!",
                    description:
                        "Please check your email to verify your account.",
                });
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                setCurrentView("app");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        console.log("Logout button clicked - starting logout process");
        try {
            // Clear all application state first
            setUser(null);
            setCurrentView("landing");
            setShowFirstTimeSetup(false);
            setIsFirstTimeUser(false);
            setImage(null);
            setCaptions([]);
            setSelectedCaption("");
            setCompanyProfile({
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

            console.log("Application state cleared, now clearing auth data");

            // Then clear auth data
            await clearAuthData();

            console.log("Logout completed successfully");

            toast({
                title:
                    language === "km"
                        ? "ចេញបានជោគជ័យ!"
                        : "Logged out successfully!",
                description:
                    language === "km"
                        ? "អ្នកបានចេញពីគណនី"
                        : "You have been logged out of your account.",
            });
        } catch (error) {
            console.error("Error during logout:", error);
            // Even if logout fails, still clear the UI state
            setUser(null);
            setCurrentView("landing");
            toast({
                title: "Logout Error",
                description:
                    "There was an issue logging out, but you've been signed out locally.",
                variant: "destructive",
            });
        }
    };

    // Load user and profile
    useEffect(() => {
        let mounted = true;

        const getUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!mounted) return;

                if (user) {
                    setUser({
                        id: user.id,
                        email: user.email!,
                        full_name: user.user_metadata?.full_name,
                    });
                    setCurrentView("app");
                    await loadCompanyProfile(user.id);
                } else {
                    setCurrentView("landing");
                }
            } catch (error) {
                console.log("Error getting user:", error);
                if (mounted) {
                    await clearAuthData();
                    setCurrentView("landing");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        // Check if we can get user synchronously first (faster loading)
        const checkSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    // We have a session, set user immediately and skip loading
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        full_name: session.user.user_metadata?.full_name,
                    });
                    setCurrentView("app");
                    setIsLoading(false);
                    await loadCompanyProfile(session.user.id);
                } else {
                    // No session, do full user check
                    await getUser();
                }
            } catch (error) {
                console.log("Error checking session:", error);
                // Fallback to regular user check
                await getUser();
            }
        };

        // Initial load
        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);

            if (!mounted) return;

            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    full_name: session.user.user_metadata?.full_name,
                });
                setCurrentView("app");
                await loadCompanyProfile(session.user.id);
                setIsLoading(false);
            } else {
                setUser(null);
                setCurrentView("landing");
                setShowFirstTimeSetup(false);
                setIsFirstTimeUser(false);
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const loadCompanyProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("company_profiles")
                .select("*")
                .eq("user_id", userId)
                .single();

            if (error) {
                // Handle specific error cases
                if (
                    error.code === "PGRST116" ||
                    error.message.includes("No rows found")
                ) {
                    // No profile found - first time user
                    console.log("No profile found - first time user");
                    setIsFirstTimeUser(true);
                    setShowFirstTimeSetup(true);
                    return;
                } else if (
                    error.code === "406" ||
                    error.message.includes("Not Acceptable")
                ) {
                    // User might be deleted from database but still has auth token
                    console.log("User not found in database, clearing auth");
                    await clearAuthData();
                    setCurrentView("landing");
                    return;
                }
                throw error;
            }

            if (data) {
                setCompanyProfile(data as unknown as CompanyProfile);
                setIsFirstTimeUser(false);
                setShowFirstTimeSetup(false);
            }
        } catch (error: any) {
            console.log("Error loading profile:", error);
            // If there's any error, treat as first time user but don't block the app
            setIsFirstTimeUser(true);
            setShowFirstTimeSetup(true);
        }
    };

    const skipFirstTimeSetup = async () => {
        if (!user) return;

        setIsSavingProfile(true);
        try {
            // Create a minimal empty profile to mark that setup was attempted
            const emptyProfile = {
                user_id: user.id,
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
            };

            const { data, error } = await supabase
                .from("company_profiles")
                .upsert([emptyProfile])
                .select();

            if (error) {
                console.log("Error saving empty profile:", error);
                // Even if save fails, still close the popup
            } else if (data && data[0]) {
                setCompanyProfile(data[0] as unknown as CompanyProfile);
            }

            // Always close the popup regardless of save success
            setShowFirstTimeSetup(false);
            setIsFirstTimeUser(false);

            toast({
                title:
                    language === "km"
                        ? "រំលងបានជោគជ័យ!"
                        : "Skipped successfully!",
                description:
                    language === "km"
                        ? "អ្នកអាចកំណត់ព័ត៌មានក្រុមហ៊ុននៅពេលក្រោយ"
                        : "You can set up your company profile later.",
            });
        } catch (error) {
            console.log("Error in skip setup:", error);
            // Still close popup even on error
            setShowFirstTimeSetup(false);
            setIsFirstTimeUser(false);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const saveCompanyProfile = async (isFirstTime = false) => {
        if (!user) return;

        setIsSavingProfile(true);
        try {
            const profileData = { ...companyProfile, user_id: user.id };
            const { data, error } = await supabase
                .from("company_profiles")
                .upsert([profileData])
                .select();

            if (error) throw error;

            if (data && data[0]) {
                setCompanyProfile(data[0] as unknown as CompanyProfile);
            }

            if (isFirstTime) {
                setShowFirstTimeSetup(false);
                setIsFirstTimeUser(false);
            }

            toast({
                title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
                description:
                    language === "km"
                        ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក"
                        : "Company profile saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save profile.",
                variant: "destructive",
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleImageUpload = useCallback(
        (file: File) => {
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target?.result as string);
                    setCaptions([]);
                    setSelectedCaption("");
                };
                reader.readAsDataURL(file);
            } else {
                toast({
                    title: "Invalid file",
                    description: "Please upload a valid image file.",
                    variant: "destructive",
                });
            }
        },
        [toast]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handlePaste = useCallback(
        (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.startsWith("image/")) {
                        const file = items[i].getAsFile();
                        if (file) {
                            handleImageUpload(file);
                        }
                        break;
                    }
                }
            }
        },
        [handleImageUpload]
    );

    const analyzeImage = async () => {
        if (!image || !user) return;

        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/analyze-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: image.split(",")[1],
                    vibe: selectedVibe,
                    customPrompt,
                    companyProfile,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze image");
            }

            const data = await response.json();
            setCaptions(data.captions);
            setSelectedCaption(data.captions[0] || "");

            toast({
                title:
                    language === "km"
                        ? "ការវិភាគបានបញ្ចប់!"
                        : "Analysis complete!",
                description:
                    language === "km"
                        ? "បានបង្កើតចំណងជើង"
                        : "Generated captions based on your image.",
            });
        } catch (error) {
            toast({
                title: language === "km" ? "ការវិភាគបរាជ័យ" : "Analysis failed",
                description:
                    language === "km"
                        ? "សូមព្យាយាមម្តងទៀត"
                        : "Failed to analyze the image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: language === "km" ? "បានចម្លង!" : "Copied!",
            description:
                language === "km"
                    ? "ចំណងជើងបានចម្លង"
                    : "Caption copied to clipboard.",
        });
    };

    // Add a useEffect to handle page visibility changes and refocus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user) {
                // Page became visible and user exists, ensure we're in app view
                if (currentView !== "app") {
                    setCurrentView("app");
                }
                setIsLoading(false);
            }
        };

        const handleFocus = () => {
            if (user && currentView !== "app") {
                setCurrentView("app");
                setIsLoading(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("focus", handleFocus);
        };
    }, [user, currentView]);

    // Fallback: if user exists but we're still loading after 2 seconds, force app view
    useEffect(() => {
        if (user && isLoading) {
            const timeout = setTimeout(() => {
                console.log("Forcing app view due to timeout");
                setCurrentView("app");
                setIsLoading(false);
            }, 2000); // Reduced from 3 seconds to 2 seconds

            return () => clearTimeout(timeout);
        }
    }, [user, isLoading]);

    useEffect(() => {
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const selectedVibeOption = VIBE_OPTIONS.find(
        (v) => v.value === selectedVibe
    );

    // If user exists but we're not in app view and not loading, force app view
    useEffect(() => {
        if (user && currentView !== "app" && !isLoading) {
            setCurrentView("app");
        }
    }, [user, currentView, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto" />
                    <p className="text-sm text-gray-500">
                        {user
                            ? "Loading your workspace..."
                            : "Loading your account..."}
                    </p>
                </div>
            </div>
        );
    }

    // Landing Page
    if (currentView === "landing") {
        return (
            <div>
                {/* Header */}
                <Header />

                {/* Hero Section */}
                <HeroSection
                    language={language}
                    colorTheme={colorTheme}
                    onGetStarted={() => setCurrentView("auth")}
                />
            </div>
        );
    }

    // Auth Page
    if (currentView === "auth") {
        return (
            <AuthForm
                language={language}
                currentTheme={currentTheme}
                t={t}
                authMode={authMode}
                setAuthMode={setAuthMode}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                fullName={fullName}
                setFullName={setFullName}
                onAuth={handleAuth}
                onBack={() => setCurrentView("landing")}
            />
        );
    }

    // First-time setup dialog
    if (showFirstTimeSetup && currentView === "app") {
        return (
            <FirstTimeSetup
                language={language}
                currentTheme={currentTheme}
                companyProfile={companyProfile}
                setCompanyProfile={setCompanyProfile}
                onSave={() => saveCompanyProfile(true)}
                onSkip={skipFirstTimeSetup}
                isSaving={isSavingProfile}
                t={t}
            />
        );
    }

    // Main App
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-6xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center`}
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">
                                {language === "km"
                                    ? "ចំណង (Jomnorng)"
                                    : "Jomnorng (ចំណង)"}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome back, {user?.full_name || user?.email}!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={language}
                            onValueChange={(value: "km" | "en") =>
                                setLanguage(value)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                                <SelectItem value="en">🇺🇸 English</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={colorTheme}
                            onValueChange={setColorTheme}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {COLOR_THEMES.map((theme) => (
                                    <SelectItem
                                        key={theme.value}
                                        value={theme.value}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${theme.color}`}
                                            />
                                            {theme.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowProfile(true)}
                        >
                            <User className="w-4 h-4" />
                        </Button>

                        <Dialog
                            open={showProfile}
                            onOpenChange={setShowProfile}
                        >
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        {t[language].companyProfile}
                                    </DialogTitle>
                                </DialogHeader>
                                <CompanyProfileForm
                                    profile={companyProfile}
                                    setProfile={setCompanyProfile}
                                    onSave={saveCompanyProfile}
                                    isSaving={isSavingProfile}
                                    language={language}
                                    t={t}
                                    currentTheme={currentTheme}
                                />
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image Upload & Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Upload */}
                        <ImageUploader
                            image={image}
                            language={language}
                            currentTheme={currentTheme}
                            t={t}
                            onFileChange={handleFileChange}
                            onClearImage={() => {
                                setImage(null);
                                setCaptions([]);
                                setSelectedCaption("");
                            }}
                        />

                        {/* Vibe Selection */}
                        {image && (
                            <VibeSelector
                                language={language}
                                currentTheme={currentTheme}
                                t={t}
                                vibeOptions={VIBE_OPTIONS}
                                selectedVibe={selectedVibe}
                                setSelectedVibe={setSelectedVibe}
                                customPrompt={customPrompt}
                                setCustomPrompt={setCustomPrompt}
                                onAnalyzeImage={analyzeImage}
                                isAnalyzing={isAnalyzing}
                            />
                        )}
                    </div>

                    {/* Right Column - Generated Captions */}
                    <div className="space-y-6">
                        <CaptionsDisplay
                            captions={captions}
                            selectedCaption={selectedCaption}
                            setSelectedCaption={setSelectedCaption}
                            selectedVibeOption={selectedVibeOption}
                            language={language}
                            currentTheme={currentTheme}
                            t={t}
                            isGenerating={isGenerating}
                            onAnalyzeImage={analyzeImage}
                            onCopyToClipboard={copyToClipboard}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
