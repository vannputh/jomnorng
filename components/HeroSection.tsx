"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, Sparkles, Globe, Palette } from "lucide-react";
import { t } from "@/app/data/translate";

import { COLOR_THEMES } from "@/app/data/color-themes";

interface HeroSectionProps {
    language: "km" | "en";
    colorTheme: string;
    onGetStarted: () => void;
}

const HeroSection = ({
    language,
    colorTheme,
    onGetStarted,
}: HeroSectionProps) => {
    const currentTheme =
        COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0];
    return (
        <main className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white">
                        {t[language].heroTitle}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t[language].heroSubtitle}
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={onGetStarted}
                        className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-3 text-lg`}
                    >
                        {t[language].getStarted}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                        <CardContent className="p-6 text-center space-y-4">
                            <div
                                className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                            >
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white">
                                {t[language].aiPowered}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t[language].aiDesc}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                        <CardContent className="p-6 text-center space-y-4">
                            <div
                                className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                            >
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">
                                {t[language].multilingual}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t[language].multilingualDesc}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                        <CardContent className="p-6 text-center space-y-4">
                            <div
                                className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                            >
                                <Palette className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white">
                                {t[language].customizable}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t[language].customizableDesc}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default HeroSection;
