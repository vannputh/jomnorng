"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import type { Language, AuthMode } from "@/lib/types";
import { getTranslations } from "@/lib/translations";

interface AuthPageProps {
    language: Language;
    onBack: () => void;
    onAuth: (
        authMode: AuthMode,
        email: string,
        fullName?: string
    ) => Promise<boolean>;
    onGoogleAuth: () => void;
    isLoading: boolean;
}

export default function AuthPage({
    language,
    onBack,
    onAuth,
    onGoogleAuth,
    isLoading,
}: AuthPageProps) {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const t = getTranslations(language);

    // Effect to handle countdown
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSubmit = async () => {
        console.log("AuthPage handleSubmit called with:", {
            authMode,
            email,
        });
        const success = await onAuth(authMode, email, fullName);
        if (success) {
            setIsSent(true);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendTimer(30); // Start 30s cooldown
        await onAuth(authMode, email, fullName);
    };

    const getMailProviderLink = (email: string) => {
        if (email.endsWith("@gmail.com")) return "https://mail.google.com";
        if (email.endsWith("@outlook.com") || email.endsWith("@hotmail.com")) return "https://outlook.live.com";
        if (email.endsWith("@yahoo.com")) return "https://mail.yahoo.com";
        return null;
    };

    const mailLink = getMailProviderLink(email);

    if (isSent) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardHeader className="text-center space-y-4">
                        {/* ... (keep icon and title) */}
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold">{t.checkEmail}</h2>
                        <p className="text-gray-500 text-sm">
                            {t.sentLinkTo} {email}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mailLink && (
                            <Button
                                className="w-full"
                                onClick={() => window.open(mailLink, '_blank')}
                            >
                                {t.openEmailApp}
                            </Button>
                        )}

                        <div className="text-center text-sm">
                            <button
                                onClick={handleResend}
                                disabled={resendTimer > 0 || isLoading}
                                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                                {resendTimer > 0
                                    ? (language === 'km' ? `ផ្ញើម្ដងទៀតក្នុងរយៈពេល ${resendTimer}វិនាទី` : `Resend in ${resendTimer}s`)
                                    : (language === 'km' ? "មិនបានទទួលមែនទេ? ផ្ញើម្ដងទៀត" : "Didn't receive it? Resend")}
                            </button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setIsSent(false)}
                            className="w-full"
                        >
                            {t.backToLogin}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader className="text-center space-y-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="absolute top-4 left-4 p-2"
                    >
                        ← Back
                    </Button>
                    <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Jomnorng Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <h1 className="text-3xl font-bold text-black dark:text-white">
                            {language === "km" ? "ចំណង" : "Jomnorng"}
                        </h1>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t.subtitle}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs
                        value={authMode}
                        onValueChange={(value) =>
                            setAuthMode(value as AuthMode)
                        }
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">{t.login}</TabsTrigger>
                            <TabsTrigger value="signup">{t.signup}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="name@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="signup" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t.fullName}</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="name@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !email}
                        className="w-full"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">{t.sending}</span>
                        ) : (
                            authMode === "login" ? t.sendLoginLink : t.signUpWithEmail
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onGoogleAuth}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {language === "km" ? "បន្តដោយ Google" : "Continue with Google"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
