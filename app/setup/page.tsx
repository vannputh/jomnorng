"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

import type { Language, CompanyProfile } from "@/lib/types";
import FirstTimeSetup from "@/components/company/FirstTimeSetup";

export default function SetupPage() {
    const { language, setLanguage } = useLanguage();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const supabase = typeof window !== "undefined" ? createClient() : null;

    // Local form state - completely independent
    const [localFormData, setLocalFormData] = useState<CompanyProfile>({
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

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Set user_id once when user is available and load existing profile if any
    useEffect(() => {
        if (user && user.id && !localFormData.user_id) {
            loadExistingProfile(user.id);
        }
    }, [user, localFormData.user_id]);

    const loadExistingProfile = async (userId: string) => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from("company_profiles")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();

            if (data) {
                // Load existing profile for editing
                setLocalFormData(data as unknown as CompanyProfile);
            } else {
                // New user - just set the user_id
                setLocalFormData((prev) => ({ ...prev, user_id: userId }));
            }
        } catch (error) {
            console.error("Error loading existing profile:", error);
            // Fallback to new profile with user_id
            setLocalFormData((prev) => ({ ...prev, user_id: userId }));
        }
    };

    const handleSave = async () => {
        if (!user || !supabase) return;

        setIsSaving(true);
        try {
            const profileToSave = { ...localFormData, user_id: user.id };

            const { data, error } = await supabase
                .from("company_profiles")
                .upsert([profileToSave as any], {
                    onConflict: "user_id",
                })
                .select()
                .single();

            if (error) throw error;

            toast({
                title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
                description:
                    language === "km"
                        ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក"
                        : "Company profile saved successfully.",
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Error",
                description: "Failed to save profile.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = async () => {
        if (!user || !supabase) return;

        setIsSaving(true);
        try {
            const minimalProfile = {
                ...localFormData,
                user_id: user.id,
                company_name: localFormData.company_name || "My Company",
            };

            const { data, error } = await supabase
                .from("company_profiles")
                .upsert([minimalProfile as any], {
                    onConflict: "user_id",
                })
                .select()
                .single();

            if (error) {
                console.warn("Error saving minimal profile:", error);
                // Don't throw error for skip - just proceed
            }

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

            router.push("/dashboard");
        } catch (error) {
            console.error("Error in skip setup:", error);
            // Still redirect to dashboard
            router.push("/dashboard");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to auth
    }

    return (
        <FirstTimeSetup
            language={language}
            companyProfile={localFormData}
            setCompanyProfile={setLocalFormData}
            onSave={handleSave}
            onSkip={handleSkip}
            isSaving={isSaving}
        />
    );
}
