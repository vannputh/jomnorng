"use client";

import { useState, useEffect } from "react";
import type { Language } from "@/lib/types";

const LANGUAGE_STORAGE_KEY = "jomnorng-language";

export function useLanguage() {
    const [language, setLanguageState] = useState<Language>("en");

    // Load language from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedLanguage = localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            ) as Language;
            if (
                savedLanguage &&
                (savedLanguage === "km" || savedLanguage === "en")
            ) {
                setLanguageState(savedLanguage);
            }
        }
    }, []);

    // Save language to localStorage whenever it changes
    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        if (typeof window !== "undefined") {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
        }
    };

    return {
        language,
        setLanguage,
    };
}
