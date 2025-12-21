"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase";
import { CompanyProfile } from "@/lib/types";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import CaptionGenerator from "@/components/generate/CaptionGenerator";
import { Button } from "@/components/ui/button";
import { GenerateSkeleton } from "@/components/skeletons/GenerateSkeleton";
import { useToast } from "@/hooks/use-toast";

export default function CaptionsPage() {
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const { user, isLoading: authLoading, handleLogout } = useAuth();
    const { toast } = useToast();

    // Using company profile hook
    const {
        companyProfile: globalProfile,
        loadCompanyProfile,
    } = useCompanyProfile(language);

    const [showProfile, setShowProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const profileLoadedRef = useRef(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Local state for company profile
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

    const supabase = typeof window !== "undefined" ? createClient() : null;

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && !profileLoadedRef.current) {
            loadCompanyProfile(user.id, true);
            profileLoadedRef.current = true;
        }
    }, [user, loadCompanyProfile]);

    useEffect(() => {
        if (globalProfile.user_id && !isInitialized) {
            setLocalCompanyProfile(globalProfile);
            setIsInitialized(true);
        }
    }, [globalProfile, isInitialized]);

    useEffect(() => {
        if (user && user.id && !localCompanyProfile.user_id) {
            setLocalCompanyProfile((prev) => ({ ...prev, user_id: user.id }));
        }
    }, [user, localCompanyProfile.user_id]);

    const handleSaveProfile = async () => {
        if (!user || !supabase) return;

        setIsSavingProfile(true);
        try {
            const profileToSave = { ...localCompanyProfile, user_id: user.id };

            const { data, error } = await supabase
                .from("company_profiles")
                .upsert([profileToSave as any], {
                    onConflict: "user_id",
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setLocalCompanyProfile(data as unknown as CompanyProfile);
            }

            toast({
                title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
                description: language === "km" ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក" : "Company profile saved successfully.",
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Error",
                description: "Failed to save profile.",
                variant: "destructive",
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (authLoading) return <GenerateSkeleton />;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex flex-col">
            <div className="flex-1">
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
                            setProfile={setLocalCompanyProfile}
                            onSave={handleSaveProfile}
                            isSaving={isSavingProfile}
                            language={language}
                        />
                    </Header>

                    {/* Page Header */}
                    <div className="relative overflow-visible">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
                        <div className="relative py-8 px-6">
                            <div className="flex items-center gap-4 mb-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/dashboard")}
                                    className="flex items-center gap-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {language === "km" ? "ត្រលប់ក្រោយ" : "Back"}
                                </Button>
                            </div>

                            <div className="text-center space-y-4">
                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white leading-[1.4]">
                                    {language === "km" ? "បង្កើតចំណងជើង" : "Generate Captions"}
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    {language === "km" ? "បង្កើតចំណងជើងដោយ AI" : "Generate engaging captions with AI"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <CaptionGenerator
                            user={user}
                            language={language}
                            localCompanyProfile={localCompanyProfile}
                            setLocalCompanyProfile={setLocalCompanyProfile}
                            setShowProfile={setShowProfile}
                        />
                    </div>
                </div>
            </div>
            <Footer language={language} />
        </div>
    );
}
