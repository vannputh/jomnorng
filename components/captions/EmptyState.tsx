"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Language } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface EmptyStateProps {
    language: Language;
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function EmptyState({ language, headerRef }: EmptyStateProps) {
    const t = getTranslations(language);

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
            <CardHeader ref={headerRef}>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                    {t.generatedCaptions}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {language === "km" ? "រង់ចាំការបង្កើត..." : "Waiting for magic..."}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    {language === "km" 
                        ? "ចំណងជើងដែលបានបង្កើតនឹងបង្ហាញនៅទីនេះ។ សូមជ្រើសរើសរូបភាព និងរចនាប័ទ្មរបស់អ្នក។"
                        : "Your generated captions will appear here. Please select your image and style options."}
                </p>
            </CardContent>
        </Card>
    );
} 