"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Check, Edit, Wand2 } from "lucide-react";
import type { Language } from "@/lib/types";

interface ImprovingStageProps {
    improvedCaptions?: string[];
    finalCaption?: string;
    setFinalCaption?: (caption: string) => void;
    onBackFromImproving?: () => void;
    onDone?: () => void;
    onCopy?: (text: string) => void;
    language: Language;
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ImprovingStage({
    improvedCaptions = [],
    finalCaption,
    setFinalCaption,
    onBackFromImproving,
    onDone,
    onCopy,
    language,
    headerRef
}: ImprovingStageProps) {
    // Get the first improved caption (the best one)
    const improvedCaption = improvedCaptions.length > 0 
        ? improvedCaptions[0].replace(/\[VERSION \d+ - [^\]]+\]\n/, '').replace(/\[English Below\]\n/, '')
        : finalCaption;

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
            <CardHeader ref={headerRef}>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                    <Wand2 className="w-5 h-5" />
                    {language === "km" ? "ការកែលម្អបានបញ្ចប់" : "Improvement Complete"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                    {language === "km" 
                        ? "AI បានកែលម្អចំណងជើងរបស់អ្នក។ អ្នកអាចបន្តកែប្រែ ឬបញ្ចប់ការងារ"
                        : "AI has improved your caption. You can continue editing or finish"}
                </p>

                {/* Improved Caption Display */}
                <div className="space-y-3">
                    <Label>
                        {language === "km" ? "ចំណងជើងដែលបានកែលម្អ" : "Improved Caption"}
                    </Label>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                            {improvedCaption}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (improvedCaption) {
                                setFinalCaption?.(improvedCaption);
                            }
                            onBackFromImproving?.();
                        }}
                        className="flex-1"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        {language === "km" ? "បន្តកែប្រែ" : "Continue Editing"}
                    </Button>
                    <Button
                        onClick={onDone}
                        className="flex-1"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        {language === "km" ? "រួចរាល់" : "Done"}
                    </Button>
                </div>
                
                <Button
                    variant="ghost"
                    onClick={() => onCopy?.((improvedCaption || finalCaption || "") as string)}
                    disabled={!improvedCaption}
                    className="w-full"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    {language === "km" ? "ចម្លងចំណងជើង" : "Copy Caption"}
                </Button>

                {/* Loading state */}
                {improvedCaptions.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin" />
                        </div>
                        <p className="text-muted-foreground">
                            {language === "km" ? "រង់ចាំការកែលម្អ..." : "Improving caption..."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 