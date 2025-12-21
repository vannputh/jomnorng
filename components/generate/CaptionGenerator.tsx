"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CompanyProfile } from "@/lib/types";
import { VIBE_OPTIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase";
import CaptionList from "@/components/captions/CaptionList";
import ImageUpload from "@/components/image/ImageUpload";
import VibeSelection from "@/components/image/VibeSelection";
import { Stepper } from "@/components/ui/stepper";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

interface CaptionGeneratorProps {
    user: User | null;
    language: "en" | "km";
    localCompanyProfile: CompanyProfile;
    setLocalCompanyProfile: (profile: CompanyProfile) => void;
    setShowProfile: (show: boolean) => void;
}

export default function CaptionGenerator({
    user,
    language,
    localCompanyProfile,
    setLocalCompanyProfile,
    setShowProfile
}: CaptionGeneratorProps) {
    const [image, setImage] = useState<string | null>(null);
    const [selectedVibe, setSelectedVibe] = useState("professional");
    const [customPrompt, setCustomPrompt] = useState("");
    const [captions, setCaptions] = useState<string[]>([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [includeCompanyProfile, setIncludeCompanyProfile] = useState(true);
    const [captionLength, setCaptionLength] = useState("medium");
    const [workflowStage, setWorkflowStage] = useState<"initial" | "selecting" | "editing" | "improving" | "done">("initial");
    const [selectedFavorite, setSelectedFavorite] = useState("");
    const [finalCaption, setFinalCaption] = useState("");
    const [isImproving, setIsImproving] = useState(false);
    const [improvedCaptions, setImprovedCaptions] = useState<string[]>([]);

    const supabase = typeof window !== "undefined" ? createClient() : null;
    const { toast } = useToast();

    // Refs for scrolling
    const editHeaderRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);

    const selectedVibeOption = VIBE_OPTIONS.find(
        (v) => v.value === selectedVibe
    );

    const handleImageReset = () => {
        setImage(null);
        setCaptions([]);
        setSelectedCaption("");
        setWorkflowStage("initial");
        setSelectedFavorite("");
        setFinalCaption("");
        setImprovedCaptions([]);
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    };

    const analyzeImage = async () => {
        if (!image || !user) return;

        setIsAnalyzing(true);
        scrollToSection(rightColumnRef);

        try {
            const payload = {
                image: image.split(",")[1],
                vibe: selectedVibe,
                customPrompt,
                captionLength,
                companyProfile: includeCompanyProfile ? localCompanyProfile : null,
                language,
            };

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

            setTimeout(() => {
                scrollToSection(editHeaderRef);
            }, 100);

            toast({
                title: language === "km" ? "ការវិភាគបានបញ្ចប់!" : "Analysis complete!",
                description: language === "km" ? "បានបង្កើតចំណងជើង" : "Generated captions based on your image.",
            });
        } catch (error) {
            toast({
                title: language === "km" ? "ការវិភាគបរាជ័យ" : "Analysis failed",
                description: language === "km" ? "សូមព្យាយាមម្តងទៀត" : "Failed to analyze the image. Please try again.",
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
        setTimeout(() => {
            scrollToSection(editHeaderRef);
        }, 100);
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
                captions: captions,
                final_caption: finalCaption,
                vibe: selectedVibe,
                custom_prompt: customPrompt,
                caption_length: captionLength,
                company_profile: includeCompanyProfile ? localCompanyProfile : null,
                language: language,
                created_at: new Date().toISOString(),
            });

            setWorkflowStage("done");
            setTimeout(() => {
                scrollToSection(editHeaderRef);
            }, 100);

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
            description: language === "km" ? "ចំណងជើងបានចម្លង" : "Caption copied to clipboard.",
        });
    };

    return (
        <div className="space-y-6">
            {/* Progress Indicator */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                <CardContent className="p-6">
                    <Stepper
                        steps={[
                            {
                                title: language === "km" ? "ផ្ទុករូបភាព" : "Upload",
                                completed: !!image,
                                active: !image,
                            },
                            {
                                title: language === "km" ? "ជ្រើសស្ទីល" : "Choose Style",
                                completed: captions.length > 0,
                                active: !!image && captions.length === 0,
                            },
                            {
                                title: language === "km" ? "ទទួលលទ្ធផល" : "Get Results",
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 xl:items-stretch">
                    {/* Left Column - Image Upload & Controls */}
                    <div className="flex flex-col h-full">
                        <div className="relative flex-1 h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 flex flex-col space-y-6 h-full">
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
                    <div ref={rightColumnRef} className="flex flex-col h-full">
                        <div className="relative flex-1 h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl"></div>
                            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 h-full">
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
                                    editHeaderRef={editHeaderRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
