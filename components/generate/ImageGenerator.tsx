"use client";

import { useState, useRef } from "react";
import { Download, Wand2, Loader2, Save, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface ImageGeneratorProps {
    user: User | null;
    language: "en" | "km";
}

const ASPECT_RATIOS = [
    { label: "1:1 (Square)", value: "1:1" },
    { label: "16:9 (Landscape)", value: "16:9" },
    { label: "9:16 (Portrait)", value: "9:16" },
    { label: "4:3 (Photo)", value: "4:3" },
    { label: "3:4 (Poster)", value: "3:4" },
];

const STYLES = [
    { label: "Photorealistic", value: "photorealistic" },
    { label: "Anime", value: "anime" },
    { label: "Digital Art", value: "digital_art" },
    { label: "Oil Painting", value: "oil_painting" },
    { label: "Cyberpunk", value: "cyberpunk" },
    { label: "Cinematic", value: "cinematic" },
    { label: "3D Render", value: "3d_render" },
];

export default function ImageGenerator({ user, language }: ImageGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [style, setStyle] = useState("photorealistic");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();
    const supabase = typeof window !== "undefined" ? createClient() : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            if (uploadedImages.length + files.length > 3) {
                toast({
                    title: language === "km" ? "រូបភាពច្រើនពេក" : "Too many images",
                    description: language === "km" ? "អាចផ្ទុករូបភាពបានត្រឹមតែ 3 ប៉ុណ្ណោះ" : "You can only upload up to 3 images.",
                    variant: "destructive",
                });
                return;
            }

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadedImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            // Prepare payload with images if available
            const cleanImages = uploadedImages.map(img => img.split(",")[1]);

            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    aspectRatio,
                    style,
                    language,
                    images: cleanImages.length > 0 ? cleanImages : undefined
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate image");
            }

            const data = await response.json();
            setGeneratedImage(data.image);

            toast({
                title: language === "km" ? "ជោគជ័យ!" : "Success!",
                description: language === "km" ? "រូបភាពត្រូវបានបង្កើត" : "Image generated successfully!",
            });
        } catch (error: any) {
            toast({
                title: language === "km" ? "បរាជ័យ" : "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedImage || !user || !supabase) return;

        setIsSaving(true);
        try {
            // Convert base64 to blob using browser native API
            const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, "");
            const binaryStr = atob(base64Data);
            const len = binaryStr.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "image/jpeg" });

            const fileName = `generated/${user.id}/${Date.now()}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("generated_images")
                .upload(fileName, blob, {
                    contentType: "image/jpeg",
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("generated_images")
                .getPublicUrl(fileName);

            // Save record to DB
            const { error: dbError } = await supabase.from("generated_images").insert({
                user_id: user.id,
                image_url: publicUrl,
                prompt,
                style,
                aspect_ratio: aspectRatio,
            });

            if (dbError) console.error("DB Save Error:", dbError);

            toast({
                title: language === "km" ? "បានរក្សាទុក!" : "Saved!",
                description: language === "km" ? "រូបភាពបានរក្សាទុកក្នុងបណ្ណាល័យ" : "Image saved to library!",
            });
        } catch (error: any) {
            toast({
                title: language === "km" ? "រក្សាទុកបរាជ័យ" : "Save Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement("a");
        link.href = generatedImage;
        link.download = `generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>{language === "km" ? "រូបភាពយោង (រហូតដល់ 3)" : "Reference Images (Max 3)"}</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {uploadedImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                                        <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {uploadedImages.length < 3 && (
                                    <button
                                        onClick={triggerUpload}
                                        className="flex flex-col items-center justify-center aspect-square rounded-md border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-[10px] text-gray-400 mt-1">{language === "km" ? "បន្ថែម" : "Add"}</span>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                                multiple
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{language === "km" ? "ការពិពណ៌នា" : "Prompt"}</Label>
                            <Input
                                placeholder={language === "km" ? "ពិពណ៌នារូបភាពដែលអ្នកចង់បាន..." : "Describe the image you want..."}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="h-24 pb-16 resize-none" // Making it look like textarea somewhat or just use Textarea
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{language === "km" ? "ស្ទីល" : "Style"}</Label>
                            <Select value={style} onValueChange={setStyle}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STYLES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{language === "km" ? "សមាមាត្រ" : "Aspect Ratio"}</Label>
                            <Select value={aspectRatio} onValueChange={setAspectRatio}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASPECT_RATIOS.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {language === "km" ? "កំពុងបង្កើត..." : "Generating..."}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {language === "km" ? "បង្កើតរូបភាព" : "Generate Image"}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Display Area */}
            <div className="lg:col-span-2">
                <Card className="h-full min-h-[500px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    {generatedImage ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <img
                                src={generatedImage}
                                alt="Generated"
                                className="max-h-[500px] w-auto object-contain rounded-lg shadow-lg mb-4"
                            />
                            <div className="flex gap-4 mt-4">
                                <Button variant="outline" onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {language === "km" ? "ទាញយក" : "Download"}
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {language === "km" ? "រក្សាទុក" : "Save to Library"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                {language === "km" ? "ត្រៀមខ្លួនបង្កើតរូបភាព" : "Ready to Generate"}
                            </h3>
                            <p className="max-w-xs mx-auto">
                                {language === "km"
                                    ? "បញ្ចូលការពិពណ៌នាហើយជ្រើសរើសស្ទីលដើម្បីចាប់ផ្តើម"
                                    : "Enter a prompt, upload references (optional), and choose a style to start."}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
