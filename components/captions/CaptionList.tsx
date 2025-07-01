"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Heart, Loader2 } from "lucide-react";
import type { Language, VibeOption } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface CaptionListProps {
    captions: string[];
    selectedCaption: string;
    setSelectedCaption: (caption: string) => void;
    selectedVibeOption: VibeOption | undefined;
    language: Language;
    onRefresh: () => void;
    onCopy: (text: string) => void;
    isGenerating: boolean;
}

export default function CaptionList({
    captions,
    selectedCaption,
    setSelectedCaption,
    selectedVibeOption,
    language,
    onRefresh,
    onCopy,
    isGenerating,
}: CaptionListProps) {
    const t = getTranslations(language);

    if (captions.length === 0) {
        return null;
    }

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between">
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
            <CardContent className="space-y-4">
                <div className="space-y-3">
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
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
