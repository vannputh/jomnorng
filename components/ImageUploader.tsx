"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    image: string | null;
    language: "km" | "en";
    currentTheme: {
        gradient: string;
        [key: string]: any;
    };
    t: {
        [key: string]: {
            uploadImage: string;
            uploadDesc: string;
            chooseFile: string;
            camera: string;
            uploadDifferent: string;
        };
    };
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
}

export default function ImageUploader({
    image,
    language,
    currentTheme,
    t,
    onFileChange,
    onClearImage,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Camera className="w-5 h-5" />
                    {t[language].uploadImage}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!image ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center space-y-4 bg-gray-50 dark:bg-gray-800">
                        <div
                            className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                        >
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-black dark:text-white">
                                {language === "km"
                                    ? "ផ្ទុករូបភាពដើម្បីចាប់ផ្តើម"
                                    : "Upload an image to get started"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t[language].uploadDesc}
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {t[language].chooseFile}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                {t[language].camera}
                            </Button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={onFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={image || "/placeholder.svg"}
                                alt="Uploaded image"
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-96 object-cover"
                            />
                        </div>
                        <Button variant="outline" onClick={onClearImage}>
                            {t[language].uploadDifferent}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
