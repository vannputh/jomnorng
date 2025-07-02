"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { createClient } from "@/lib/supabase";
import { VIBE_OPTIONS } from "@/lib/constants";
import type { Language, CompanyProfile } from "@/lib/types";

// Individual component imports
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageUpload from "@/components/image/ImageUpload";
import VibeSelection from "@/components/image/VibeSelection";
import CaptionList from "@/components/captions/CaptionList";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import { Stepper } from "@/components/ui/stepper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
    const { language, setLanguage } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [selectedVibe, setSelectedVibe] = useState("professional");
    const [customPrompt, setCustomPrompt] = useState("");
    const [captions, setCaptions] = useState<string[]>([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [includeCompanyProfile, setIncludeCompanyProfile] = useState(true);
    const [captionLength, setCaptionLength] = useState("medium");
    const [workflowStage, setWorkflowStage] = useState<"initial" | "selecting" | "editing" | "improving" | "done">("initial");
    const [selectedFavorite, setSelectedFavorite] = useState("");
    const [finalCaption, setFinalCaption] = useState("");
    const [isImproving, setIsImproving] = useState(false);
    const [improvedCaptions, setImprovedCaptions] = useState<string[]>([]);

    const router = useRouter();
    const { user, isLoading: authLoading, handleLogout } = useAuth();
    const {
        companyProfile: globalProfile,
        isFirstTimeUser,
        loadCompanyProfile,
    } = useCompanyProfile(language);
    const { toast } = useToast();
    const supabase = typeof window !== "undefined" ? createClient() : null;
    const profileLoadedRef = useRef(false);

    // Flag to prevent clearing form data when user is actively editing
    const [isInitialized, setIsInitialized] = useState(false);

    // Local form state for the company profile - prevents resets during typing
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

    const selectedVibeOption = VIBE_OPTIONS.find(
        (v) => v.value === selectedVibe
    );

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Load company profile when user is available - only once
    useEffect(() => {
        if (user && !profileLoadedRef.current) {
            loadCompanyProfile(user.id, true); // Skip redirect, stay on dashboard
            profileLoadedRef.current = true;
        }
    }, [user, loadCompanyProfile]);

    // Update local state when global profile loads - only on initial load
    useEffect(() => {
        if (globalProfile.user_id && !isInitialized) {
            setLocalCompanyProfile(globalProfile);
            setIsInitialized(true);
        }
    }, [globalProfile, isInitialized]);

    // Set user_id when user is available
    useEffect(() => {
        if (user && user.id && !localCompanyProfile.user_id) {
            setLocalCompanyProfile((prev: CompanyProfile) => ({
                ...prev,
                user_id: user.id,
            }));
        }
    }, [user, localCompanyProfile.user_id]);

    // Image and caption handling
    const handleImageReset = () => {
        setImage(null);
        setCaptions([]);
        setSelectedCaption("");
        setWorkflowStage("initial");
        setSelectedFavorite("");
        setFinalCaption("");
        setImprovedCaptions([]);
    };

    const analyzeImage = async () => {
        if (!image || !user) return;

        setIsAnalyzing(true);
        try {
            // Create the payload and log it for debugging
            const payload = {
                image: image.split(",")[1],
                vibe: selectedVibe,
                customPrompt,
                captionLength,
                companyProfile: includeCompanyProfile ? localCompanyProfile : null,
                language,
            };

            console.log("Analyzing image with payload:", payload);

            const response = await fetch("/api/analyze-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze image");
            }

            const data = await response.json();
            setCaptions(data.captions);
            setSelectedCaption(data.captions[0] || "");
            setWorkflowStage("selecting");

            // Will save to database later when user finalizes

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

    const handleSelectFavorite = (caption: string) => {
        setSelectedFavorite(caption);
        setFinalCaption(caption);
        setWorkflowStage("editing");
    };

    const handleAIImprove = async (customImprovementMessage?: string) => {
        if (!finalCaption) return;
        
        setIsImproving(true);
        try {
            const improvePayload = {
                originalCaption: finalCaption,
                vibe: selectedVibe,
                customPrompt,
                captionLength,
                companyProfile: includeCompanyProfile ? localCompanyProfile : null,
                language,
                customImprovementMessage,
            };

            const response = await fetch("/api/improve-caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(improvePayload),
            });

            if (!response.ok) {
                throw new Error("Failed to improve caption");
            }

            const data = await response.json();
            setImprovedCaptions(data.improvedCaptions || []);
            setWorkflowStage("improving");
            
            toast({
                title: language === "km" ? "បានកែលម្អ!" : "Improvements Ready!",
                description: language === "km" ? "ជ្រើសរើសការកែលម្អដែលអ្នកចូលចិត្ត" : "Choose your favorite improvement",
            });
        } catch (error) {
            toast({
                title: language === "km" ? "កែលម្អបរាជ័យ" : "Improvement failed",
                description: language === "km" ? "សូមព្យាយាមម្តងទៀត" : "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsImproving(false);
        }
    };

    const handleSelectImprovedCaption = (caption: string) => {
        setFinalCaption(caption);
        setWorkflowStage("editing");
    };

    const handleBackFromImproving = () => {
        setWorkflowStage("editing");
        setImprovedCaptions([]);
    };

    const handleDone = async () => {
        if (!finalCaption || !user || !supabase) return;

        try {
            await supabase.from("generated_captions").insert({
                user_id: user.id,
                image_url: image,
                captions: captions, // Original 3 captions
                final_caption: finalCaption, // User's final choice
                vibe: selectedVibe,
                custom_prompt: customPrompt,
                caption_length: captionLength,
                company_profile: includeCompanyProfile ? localCompanyProfile : null,
                language: language,
                created_at: new Date().toISOString(),
            });

            setWorkflowStage("done");
            
            toast({
                title: language === "km" ? "រក្សាទុកបានជោគជ័យ!" : "Saved successfully!",
                description: language === "km" ? "ចំណងជើងបានរក្សាទុកក្នុងបណ្ណាល័យ" : "Caption saved to your library",
            });
        } catch (error) {
            console.error("Error saving final caption:", error);
            toast({
                title: "Error",
                description: "Failed to save caption",
                variant: "destructive",
            });
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

    // Custom save function that works with local state
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
                // Update local state with saved data
                setLocalCompanyProfile(data as unknown as CompanyProfile);
            }

            toast({
                title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
                description:
                    language === "km"
                        ? "ព័ត៌មានក្រុមហ៊ុនបានរក្សាទុក"
                        : "Company profile saved successfully.",
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

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                        Loading generator...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to auth
    }

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

                {/* Back Button & Page Header */}
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
                                {language === "km"
                                    ? "ផ្ទុករូបភាពហើយបង្កើតចំណងជើង AI ដែលគួរឱ្យទាក់ទាញ"
                                    : "Upload an image and create engaging AI-powered captions"}
                            </p>
                        </div>
                    </div>
                </div>

                

                {/* Progress Indicator */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <Stepper
                            steps={[
                                {
                                    title:
                                        language === "km"
                                            ? "ផ្ទុករូបភាព"
                                            : "Upload",
                                    completed: !!image,
                                    active: !image,
                                },
                                {
                                    title:
                                        language === "km"
                                            ? "ជ្រើសស្ទីល"
                                            : "Choose Style",
                                    completed: captions.length > 0,
                                    active: !!image && captions.length === 0,
                                },
                                {
                                    title:
                                        language === "km"
                                            ? "ទទួលលទ្ធផល"
                                            : "Get Results",
                                    completed: captions.length > 0,
                                    active: false,
                                },
                            ]}
                        />

                        {!image && (
                            <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {language === "km"
                                        ? "ចាប់ផ្តើមដោយការផ្ទុករូបភាពរបស់អ្នក"
                                        : "Start by uploading your image below"}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>



                {/* Main Content */}
                {!image ? (
                    /* Full width layout when no image */
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                            <ImageUpload
                                image={image}
                                setImage={setImage}
                                language={language}
                                onReset={handleImageReset}
                            />
                        </div>
                    </div>
                ) : (
                    /* Improved two-column layout with flexible heights */
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                        {/* Left Column - Image Upload & Controls */}
                        <div className="flex flex-col">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                                <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 flex flex-col space-y-6">
                                    <ImageUpload
                                        image={image}
                                        setImage={setImage}
                                        language={language}
                                        onReset={handleImageReset}
                                        disabled={isAnalyzing || captions.length > 0}
                                    />
                                    
                                    <VibeSelection
                                        selectedVibe={selectedVibe}
                                        setSelectedVibe={setSelectedVibe}
                                        customPrompt={customPrompt}
                                        setCustomPrompt={setCustomPrompt}
                                        language={language}
                                        onAnalyze={analyzeImage}
                                        isAnalyzing={isAnalyzing}
                                        includeCompanyProfile={includeCompanyProfile}
                                        setIncludeCompanyProfile={setIncludeCompanyProfile}
                                        localCompanyProfile={localCompanyProfile}
                                        onShowProfile={() => setShowProfile(true)}
                                        captionLength={captionLength}
                                        setCaptionLength={setCaptionLength}
                                        disabled={isAnalyzing || captions.length > 0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Generated Captions */}
                        <div className="flex flex-col">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                                <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                                    <CaptionList
                                        captions={captions}
                                        selectedCaption={selectedCaption}
                                        setSelectedCaption={setSelectedCaption}
                                        selectedVibeOption={selectedVibeOption}
                                        language={language}
                                        onRefresh={analyzeImage}
                                        onCopy={copyToClipboard}
                                        isGenerating={isGenerating}
                                        workflowStage={workflowStage}
                                        onSelectFavorite={handleSelectFavorite}
                                        selectedFavorite={selectedFavorite}
                                        finalCaption={finalCaption}
                                        setFinalCaption={setFinalCaption}
                                        onAIImprove={handleAIImprove}
                                        isImproving={isImproving}
                                        onDone={handleDone}
                                        improvedCaptions={improvedCaptions}
                                        onSelectImprovedCaption={handleSelectImprovedCaption}
                                        onBackFromImproving={handleBackFromImproving}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                </div>
            </div>
            <Footer language={language} />
        </div>
    );
}
