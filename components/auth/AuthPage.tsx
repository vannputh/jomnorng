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
        password: string,
        fullName?: string
    ) => void;
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
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const t = getTranslations(language);

    const handleSubmit = () => {
        console.log("AuthPage handleSubmit called with:", {
            authMode,
            email,
            password: "***",
        });
        onAuth(authMode, email, password, fullName);
    };

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
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {authMode === "login" ? t.login : t.signup}
                    </Button>

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
