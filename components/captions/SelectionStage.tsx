"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Check, Edit } from "lucide-react";
import type { Language } from "@/lib/types";

interface SelectionStageProps {
    captions: string[];
    selectedFavorite?: string;
    language: Language;
    onSelectFavorite?: (caption: string) => void;
    headerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SelectionStage({
    captions,
    selectedFavorite,
    language,
    onSelectFavorite,
    headerRef
}: SelectionStageProps) {
    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
            <CardHeader ref={headerRef}>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    {language === "km" ? "ជ្រើសរើសចំណងជើងដែលចូលចិត្តបំផុត" : "Choose Your Favorite"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                    {language === "km" 
                        ? "ជ្រើសរើសចំណងជើងដែលអ្នកចូលចិត្តបំផុត ហើយអ្នកអាចកែប្រែ ឬកែលម្អបន្ថែម"
                        : "Pick the caption you like most, then you can edit or improve it further"}
                </p>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {captions.map((caption, index) => (
                        <Card
                            key={index}
                            className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                                selectedFavorite === caption
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => onSelectFavorite?.(caption)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-white flex-1">
                                        {caption}
                                    </div>
                                    {selectedFavorite === caption && (
                                        <Check className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {selectedFavorite && (
                    <div className="flex gap-2 pt-4 border-t">
                        <Button 
                            onClick={() => onSelectFavorite?.(selectedFavorite)}
                            className="flex-1"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            {language === "km" ? "កែប្រែ" : "Edit"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 