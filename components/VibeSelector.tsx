"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Palette, Sparkles, Loader2 } from "lucide-react";

interface VibeSelectorProps {
    language: "km" | "en";
    currentTheme: any;
    t: any;
    vibeOptions: any[];
    selectedVibe: string;
    setSelectedVibe: (vibe: string) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    onAnalyzeImage: () => void;
    isAnalyzing: boolean;
}

const VibeSelector = ({
    language,
    currentTheme,
    t,
    vibeOptions,
    selectedVibe,
    setSelectedVibe,
    customPrompt,
    setCustomPrompt,
    onAnalyzeImage,
    isAnalyzing,
}: VibeSelectorProps) => {
    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Palette className="w-5 h-5" />
                    {t[language].chooseVibe}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {vibeOptions.map((vibe) => {
                        const Icon = vibe.icon;
                        return (
                            <Button
                                key={vibe.value}
                                variant={
                                    selectedVibe === vibe.value
                                        ? "default"
                                        : "outline"
                                }
                                className={`h-auto p-4 flex flex-col gap-2 transition-all ${
                                    selectedVibe === vibe.value
                                        ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg`
                                        : "hover:shadow-md"
                                }`}
                                onClick={() => setSelectedVibe(vibe.value)}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">
                                    {language === "km"
                                        ? vibe.label
                                        : vibe.labelEn}
                                </span>
                            </Button>
                        );
                    })}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="custom-prompt">
                        {t[language].customInstructions}
                    </Label>
                    <Textarea
                        id="custom-prompt"
                        placeholder={
                            language === "km"
                                ? "បន្ថែមសេចក្តីណែនាំជាក់លាក់... (ព័ត៌មានក្រុមហ៊ុនរបស់អ្នកនឹងត្រូវបានរួមបញ្ចូលដោយស្វ័យប្រវត្តិ)"
                                : "Add specific instructions... (Your company profile will be automatically included)"
                        }
                        value={customPrompt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setCustomPrompt(e.target.value)
                        }
                        rows={3}
                        className="bg-gray-50 dark:bg-gray-800"
                    />
                </div>

                <Button
                    onClick={onAnalyzeImage}
                    disabled={isAnalyzing}
                    className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 shadow-lg`}
                    size="lg"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {t[language].analyzingImage}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            {t[language].generateCaptions}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default VibeSelector;
