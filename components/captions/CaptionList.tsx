"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Heart, Loader2, Sparkles, Check, Edit, Wand2, ArrowLeft } from "lucide-react";
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
    workflowStage?: "initial" | "selecting" | "editing" | "improving" | "done";
    onSelectFavorite?: (caption: string) => void;
    selectedFavorite?: string;
    finalCaption?: string;
    setFinalCaption?: (caption: string) => void;
    onAIImprove?: (customMessage?: string) => void;
    isImproving?: boolean;
    onDone?: () => void;
    improvedCaptions?: string[];
    onSelectImprovedCaption?: (caption: string) => void;
    onBackFromImproving?: () => void;
    editHeaderRef?: React.RefObject<HTMLDivElement | null>;
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
    workflowStage = "initial",
    onSelectFavorite,
    selectedFavorite,
    finalCaption,
    setFinalCaption,
    onAIImprove,
    isImproving,
    onDone,
    improvedCaptions = [],
    onSelectImprovedCaption,
    onBackFromImproving,
    editHeaderRef,
}: CaptionListProps) {
    const t = getTranslations(language);
    const [customImprovementMessage, setCustomImprovementMessage] = useState("");

    if (captions.length === 0) {
        return (
            <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
                <CardHeader>
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

    // Selection Stage - Choose favorite from 3 options
    if (workflowStage === "selecting") {
        return (
            <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
                <CardHeader>
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

    // Editing Stage - Edit or improve the selected caption
    if (workflowStage === "editing") {
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

    // Improving Stage - Show improved caption with simple actions
    if (workflowStage === "improving") {
        // Get the first improved caption (the best one)
        const improvedCaption = improvedCaptions.length > 0 
            ? improvedCaptions[0].replace(/\[VERSION \d+ - [^\]]+\]\n/, '').replace(/\[English Below\]\n/, '')
            : finalCaption;

        // Calculate dynamic rows for improved caption display
        const calculateRows = (text: string) => {
            const lines = text.split('\n').length;
            const estimatedLinesFromLength = Math.ceil(text.length / 50);
            return Math.max(3, Math.min(15, Math.max(lines, estimatedLinesFromLength)));
        };

        return (
            <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
                <CardHeader>
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

    // Done Stage - Show success
    if (workflowStage === "done") {
        return (
            <Card className="border border-green-200 dark:border-green-800 shadow-lg bg-green-50 dark:bg-green-950 h-full flex flex-col">
                <CardHeader>
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
                    <div className="flex gap-3 w-full max-w-sm">
                        <Button
                            variant="outline"
                            onClick={() => onCopy?.(finalCaption || "")}
                            className="flex-1 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {language === "km" ? "ចម្លង" : "Copy"}
                        </Button>
                        <Button
                            onClick={() => window.location.href = "/dashboard/library"}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            {language === "km" ? "មើលក្នុងបណ្ណាល័យ" : "View in Library"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 h-full flex flex-col">
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
