"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Language } from "@/lib/types";

interface DoneStageProps {
    finalCaption?: string;
    language: Language;
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DoneStage({
    finalCaption,
    language,
    headerRef
}: DoneStageProps) {
    return (
        <Card className="border border-green-200 dark:border-green-800 shadow-lg bg-green-50 dark:bg-green-950 h-full flex flex-col">
            <CardHeader ref={headerRef}>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200 text-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    {language === "km" ? "រក្សាទុកបានជោគជ័យ!" : "Caption Saved!"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 max-w-sm mb-6">
                    {language === "km" 
                        ? "ចំណងជើងរបស់អ្នកត្រូវបានរក្សាទុកក្នុងបណ្ណាល័យ"
                        : "Your caption has been saved to your library"}
                </p>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <Button
                        onClick={() => window.location.href = "/dashboard/generate"}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {language === "km" ? "រូបភាពផ្សេងទៀត" : "Do Another Picture"}
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = "/dashboard"}
                            className="flex-1 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                            {language === "km" ? "ទំព័រដើម" : "Home"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = "/dashboard/library"}
                            className="flex-1 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            {language === "km" ? "មើលក្នុងបណ្ណាល័យ" : "View in Library"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 