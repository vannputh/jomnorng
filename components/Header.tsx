"use client";

import React from "react";
import { Sparkles, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { COLOR_THEMES } from "@/app/data/color-themes";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const [colorTheme, setColorTheme] = useState("classic");
    const [currentView, setCurrentView] = useState<"landing" | "auth" | "app">(
        "landing"
    );
    const currentTheme =
        COLOR_THEMES.find((t) => t.value === colorTheme) || COLOR_THEMES[0];
    const [language, setLanguage] = useState<"km" | "en">("km");
    return (
        <header className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center`}
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-black dark:text-white">
                        {language === "km"
                            ? "ចំណង (Jomnorng)"
                            : "Jomnorng (ចំណង)"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={language}
                        onValueChange={(value: "km" | "en") =>
                            setLanguage(value)
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="km">🇰🇭 ខ្មែរ</SelectItem>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={colorTheme} onValueChange={setColorTheme}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {COLOR_THEMES.map((theme) => (
                                <SelectItem
                                    key={theme.value}
                                    value={theme.value}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${theme.color}`}
                                        />
                                        {theme.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                    >
                        {theme === "dark" ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
