"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('km');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jomnorng-language') as Language;
    if (savedLanguage && (savedLanguage === 'km' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('jomnorng-language', newLanguage);
  };

  // Don't render children until we've loaded the language from localStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 