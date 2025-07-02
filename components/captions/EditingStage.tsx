"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2, Sparkles, Check, Edit, Wand2, Heart } from "lucide-react";
import type { Language } from "@/lib/types";

interface EditingStageProps {
    finalCaption?: string;
    setFinalCaption?: (caption: string) => void;
    onAIImprove?: (customMessage?: string) => void;
    isImproving?: boolean;
    onDone?: () => void;
    onCopy?: (text: string) => void;
    language: Language;
    editHeaderRef?: React.RefObject<HTMLDivElement | null>;
}

export default function EditingStage({
    finalCaption,
    setFinalCaption,
    onAIImprove,
    isImproving,
    onDone,
    onCopy,
    language,
    editHeaderRef
}: EditingStageProps) {
    const [customImprovementMessage, setCustomImprovementMessage] = useState("");

    // Calculate dynamic rows for final caption textarea based on content
    const calculateRows = (text: string) => {
        const lines = text.split('\n').length;
        const estimatedLinesFromLength = Math.ceil(text.length / 50); // Approximate 50 chars per line
        return Math.max(3, Math.min(15, Math.max(lines, estimatedLinesFromLength))); // Min 3, max 15 rows
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
            <CardHeader ref={editHeaderRef}>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                    <Edit className="w-5 h-5" />
                    {language === "km" ? "កែប្រែចំណងជើង" : "Edit Your Caption"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="space-y-3">
                    <Label htmlFor="final-caption">
                        {language === "km" ? "ចំណងជើងចុងក្រោយ" : "Final Caption"}
                    </Label>
                    <Textarea
                        id="final-caption"
                        value={finalCaption}
                        onChange={(e) => setFinalCaption?.(e.target.value)}
                        rows={calculateRows(finalCaption || "")}
                        className="resize-none bg-gray-50 dark:bg-gray-800 min-h-[80px]"
                    />
                </div>

                {/* AI Improvement Options */}
                <div className="space-y-3">
                    <Label>
                        {language === "km" ? "ជ្រើសរើសការកែលម្អ AI" : "Choose AI Improvement"}
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onAIImprove?.("Make this caption more engaging and compelling while maintaining the core message. Focus on creating stronger emotional connection and more captivating language.")}
                            disabled={isImproving || !finalCaption}
                            className="flex items-center justify-start gap-2 h-auto p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        {language === "km" ? "កែលម្អភាពទាក់ទាញ" : "More Engaging"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {language === "km" ? "បង្កើនអារម្មណ៍ និងភាពទាក់ទាញ" : "Increase emotion and appeal"}
                                    </div>
                                </div>
                            </div>
                            {isImproving && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                        </Button>
                        
                        <Button
                            variant="outline"
                            onClick={() => onAIImprove?.("Enhance the professionalism and credibility of this caption. Make it more polished, business-appropriate, and trustworthy while keeping it engaging.")}
                            disabled={isImproving || !finalCaption}
                            className="flex items-center justify-start gap-2 h-auto p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-blue-500" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        {language === "km" ? "កែលម្អវិជ្ជាជីវៈ" : "More Professional"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {language === "km" ? "បង្កើនភាពជាក់លាក់ និងទំនុកចិត្ត" : "Enhance clarity and credibility"}
                                    </div>
                                </div>
                            </div>
                            {isImproving && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                        </Button>
                        
                        <Button
                            variant="outline"
                            onClick={() => onAIImprove?.("Add creativity and unique flair to this caption while maintaining authenticity. Make it more original, memorable, and distinctive.")}
                            disabled={isImproving || !finalCaption}
                            className="flex items-center justify-start gap-2 h-auto p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-pink-500" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        {language === "km" ? "កែលម្អភាពច្នៃប្រឌិត" : "More Creative"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {language === "km" ? "បន្ថែមភាពពិសេស និងច្នៃប្រឌិត" : "Add uniqueness and originality"}
                                    </div>
                                </div>
                            </div>
                            {isImproving && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <Label htmlFor="improvement-message">
                        {language === "km" ? "សេចក្តីណែនាំបន្ថែម (ស្រេចចិត្ត)" : "Additional Instructions (Optional)"}
                    </Label>
                    <Textarea
                        id="improvement-message"
                        placeholder={
                            language === "km"
                                ? "ប្រាប់ AI ពីរបៀបដែលអ្នកចង់កែលម្អ..."
                                : "Tell AI how you want to improve..."
                        }
                        value={customImprovementMessage}
                        onChange={(e) => setCustomImprovementMessage(e.target.value)}
                        rows={2}
                        className="resize-none bg-gray-50 dark:bg-gray-800"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={onDone}
                        disabled={!finalCaption}
                        className="flex-1"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        {language === "km" ? "រួចរាល់" : "Done"}
                    </Button>
                </div>
                
                <Button
                    variant="ghost"
                    onClick={() => onCopy?.(finalCaption || "")}
                    disabled={!finalCaption}
                    className="w-full"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    {language === "km" ? "ចម្លងចំណងជើង" : "Copy Caption"}
                </Button>
            </CardContent>
        </Card>
    );
} 