"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Loader2 } from "lucide-react";
import type { Language, VibeOption } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface DefaultCaptionViewProps {
    captions: string[];
    selectedCaption: string;
    setSelectedCaption: (caption: string) => void;
    selectedVibeOption: VibeOption | undefined;
    language: Language;
    onRefresh: () => void;
    onCopy: (text: string) => void;
    isGenerating: boolean;
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DefaultCaptionView({
    captions,
    selectedCaption,
    setSelectedCaption,
    selectedVibeOption,
    language,
    onRefresh,
    onCopy,
    isGenerating,
    headerRef
}: DefaultCaptionViewProps) {
    const t = getTranslations(language);

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between" ref={headerRef}>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                    {t.generatedCaptions}
                </CardTitle>
                <div className="flex gap-2">
                    {selectedVibeOption && (
                        <Badge variant="default">
                            <selectedVibeOption.icon className="w-3 h-3 mr-1" />
                            {language === "km"
                                ? selectedVibeOption.label
                                : selectedVibeOption.labelEn}
                        </Badge>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {captions.map((caption, index) => (
                        <Card
                            key={index}
                            className={`cursor-pointer transition-all border ${
                                selectedCaption === caption
                                    ? `ring-2 ring-gray-400 dark:ring-gray-600 bg-gray-50 dark:bg-gray-800 shadow-lg`
                                    : "hover:shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setSelectedCaption(caption)}
                        >
                            <CardContent className="p-4">
                                <div className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-white">
                                    {caption}
                                </div>
                                <div className="flex justify-end mt-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCopy(caption);
                                        }}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {selectedCaption && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Selected Caption Display */}
                        <div className="space-y-3">
                            <Label>
                                {t.selectedCaption}
                            </Label>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                                    {selectedCaption}
                                </div>
                            </div>
                        </div>
                        
                        {/* Edit Section */}
                        <div className="space-y-3">
                            <Label htmlFor="selected-caption">
                                {t.editCaption}
                            </Label>
                            <Textarea
                                id="selected-caption"
                                value={selectedCaption}
                                onChange={(e) => setSelectedCaption(e.target.value)}
                                rows={6}
                                className="resize-none bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                        
                        <Button
                            onClick={() => onCopy(selectedCaption)}
                            className="w-full"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {t.copyCaption}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 