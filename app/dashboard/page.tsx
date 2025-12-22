"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
    Loader2,
    Plus,
    Library,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Upload,
    User,
    X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import type { Language, CompanyProfile } from "@/lib/types";
import { getHighResAvatarUrl } from "@/lib/avatar-utils";

// Component imports
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import ProfileCard from "@/components/ProfileCard";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
    const { language, setLanguage } = useLanguage();
    const [showProfile, setShowProfile] = useState(false);
    const [showCompanySheet, setShowCompanySheet] = useState(false);
    const [tempFullName, setTempFullName] = useState("");

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

    useEffect(() => {
        if (user?.full_name) {
            setTempFullName(user.full_name);
        }
    }, [user]);

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

        // Pass the updated profile data directly to the save function
        await saveCompanyProfile(false, profileData);

        // Reset the user input flag after successful save
        setHasUserInput(false);

        // Reload the profile to get the latest data
        await loadCompanyProfile(user.id, true);
    };

    useEffect(() => {
        if (user) {
            console.log("User Metadata:", user.user_metadata);
            console.log("Avatar URL:", user.user_metadata?.avatar_url);
            console.log("High Res Avatar URL:", getHighResAvatarUrl(user.user_metadata?.avatar_url));
            console.log("Company Logo URL:", localCompanyProfile.company_logo);
        }
    }, [user, localCompanyProfile]);

    const handleNameUpdate = async () => {
        if (!user) return;
        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            data: { full_name: tempFullName }
        });

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: language === "km" ? "ជោគជ័យ" : "Success",
                description: language === "km" ? "ប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាព" : "Profile updated successfully",
            });
            setShowProfile(false);
            window.location.reload();
        }
    };

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: language === "km" ? "សូមជ្រើសរើសរូបភាព" : "Please select an image file",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: language === "km" ? "រូបភាពធំពេក (អតិបរមា 5MB)" : "Image too large (max 5MB)",
                variant: "destructive",
            });
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `user-avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);

            // Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            toast({
                title: language === "km" ? "ជោគជ័យ" : "Success",
                description: language === "km" ? "រូបភាពប្រវត្តិរូបត្រូវបានកែប្រែ" : "Profile picture updated",
            });

            // Reload page to reflect changes since user object needs a hard refresh or session update
            window.location.reload();

        } catch (error: any) {
            console.error('Avatar upload error:', error);
            toast({
                title: "Error",
                description: error.message || (language === "km" ? "បរាជ័យក្នុងការផ្ទុកឡើង" : "Failed to upload"),
                variant: "destructive",
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    if (authLoading) {
        return <DashboardSkeleton />;
    }

    if (!user) {
        return null; // Will redirect to auth
    }

    const displayName = user.full_name || user.email?.split('@')[0] || "Friend";

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
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
                    />

                    {/* Profile Cards Section */}
                    <div className="flex flex-col md:flex-row gap-8 pt-20 justify-center items-start max-w-5xl mx-auto w-full">
                        {/* User Profile Card */}
                        <div className="flex-1 w-full flex justify-center">
                            <ProfileCard
                                name={displayName}
                                title={language === "km" ? "អ្នកប្រើប្រាស់" : "User"}
                                handle={`${displayName.toLowerCase().replace(/\s+/g, '')}`}
                                avatarUrl={getHighResAvatarUrl(user.user_metadata?.avatar_url) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                miniAvatarUrl={getHighResAvatarUrl(user.user_metadata?.avatar_url) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                status={language === "km" ? "សកម្ម" : "Active"}
                                contactText={language === "km" ? "កែប្រែប្រវត្តិរូប" : "Edit Profile"}
                                onContactClick={() => setShowProfile(true)}
                                innerGradient="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)"
                                behindGlowColor="rgba(59, 130, 246, 0.4)"
                                className="w-full max-w-[400px]"
                            />
                        </div>

                        {/* Company Profile Card */}
                        <div className="flex-1 w-full flex justify-center">
                            <ProfileCard
                                name={localCompanyProfile.company_name || (language === "km" ? "ក្រុមហ៊ុនរបស់ខ្ញុំ" : "My Company")}
                                title={language === "km" ? "ក្រុមហ៊ុន" : "Company"}
                                handle={localCompanyProfile.website_url ? localCompanyProfile.website_url.replace(/^https?:\/\//, '') : "jomnorng.com"}
                                avatarUrl={localCompanyProfile.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(localCompanyProfile.company_name || "Company")}&background=random&color=fff&size=512`}
                                miniAvatarUrl={localCompanyProfile.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(localCompanyProfile.company_name || "Company")}&background=random&color=fff`}
                                status={language === "km" ? "បានផ្ទៀងផ្ទាត់" : "Verified"}
                                contactText={language === "km" ? "កែប្រែព័ត៌មាន" : "Edit Details"}
                                onContactClick={() => setShowCompanySheet(true)}
                                innerGradient="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
                                behindGlowColor="rgba(16, 185, 129, 0.4)"
                                className="w-full max-w-[400px]"
                            />
                        </div>
                    </div>

                    {/* Company Profile Sheet */}
                    <Sheet open={showCompanySheet} onOpenChange={setShowCompanySheet}>
                        <SheetContent className="sm:max-w-xl overflow-y-auto">
                            <SheetHeader className="mb-6">
                                <SheetTitle>{language === "km" ? "ប្រវត្តិក្រុមហ៊ុន" : "Company Profile"}</SheetTitle>
                                <SheetDescription>
                                    {language === "km"
                                        ? "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានក្រុមហ៊ុនរបស់អ្នកដើម្បីទទួលបានមាតិកាល្អជាងមុន"
                                        : "Update your company information for better AI-generated content."}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4">
                                <CompanyProfileForm
                                    profile={localCompanyProfile}
                                    setProfile={updateLocalProfile}
                                    onSave={async () => {
                                        await handleSaveProfile();
                                        setShowCompanySheet(false);
                                    }}
                                    isSaving={globalSaving}
                                    language={language}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* User Profile Sheet */}
                    <Sheet open={showProfile} onOpenChange={setShowProfile}>
                        <SheetContent>
                            <SheetHeader className="mb-6">
                                <SheetTitle>{language === "km" ? "កែប្រែប្រវត្តិរូប" : "Edit Profile"}</SheetTitle>
                                <SheetDescription>
                                    {language === "km"
                                        ? "កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក"
                                        : "Update your personal information."}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 py-4">
                                {/* Avatar Upload Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 group">
                                        {user.user_metadata?.avatar_url ? (
                                            <>
                                                <img
                                                    src={getHighResAvatarUrl(user.user_metadata?.avatar_url)}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Upload className="w-8 h-8 mb-1" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                    >
                                        {isUploadingAvatar ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {language === "km" ? "កំពុងផ្ទុកឡើង..." : "Uploading..."}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                {language === "km" ? "ប្តូររូបភាព" : "Change Photo"}
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        {language === "km" ? "អតិបរមា 5MB" : "Max 5MB. Supports PNG, JPG"}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_name">{language === "km" ? "ឈ្មោះពេញ" : "Full Name"}</Label>
                                    <Input
                                        id="full_name"
                                        value={tempFullName}
                                        onChange={(e) => setTempFullName(e.target.value)}
                                        placeholder={language === "km" ? "បញ្ចូលឈ្មោះរបស់អ្នក" : "Enter your name"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{language === "km" ? "អ៊ីមែល" : "Email"}</Label>
                                    <Input value={user.email} disabled className="bg-gray-50 dark:bg-gray-800" />
                                </div>
                                <Button className="w-full" onClick={handleNameUpdate}>
                                    {language === "km" ? "រក្សាទុក" : "Save Changes"}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>


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

                </div>
            </div>
            <Footer language={language} />
        </div>
    );
}
