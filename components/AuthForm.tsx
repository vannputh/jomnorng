"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sparkles } from "lucide-react";

interface AuthFormProps {
    language: "km" | "en";
    currentTheme: any;
    t: any;
    authMode: "login" | "signup";
    setAuthMode: (mode: "login" | "signup") => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    fullName: string;
    setFullName: (fullName: string) => void;
    onAuth: () => void;
    onBack: () => void;
}

const AuthForm = ({
    language,
    currentTheme,
    t,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    onAuth,
    onBack,
}: AuthFormProps) => {
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
                    <div
                        className={`mx-auto w-16 h-16 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center`}
                    >
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">
                            {language === "km"
                                ? "ចំណង (Jomnorng)"
                                : "Jomnorng (ចំណង)"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {t[language].subtitle}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs
                        value={authMode}
                        onValueChange={(value) =>
                            setAuthMode(value as "login" | "signup")
                        }
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">
                                {t[language].login}
                            </TabsTrigger>
                            <TabsTrigger value="signup">
                                {t[language].signup}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    {t[language].email}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {t[language].password}
                                </Label>
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
                                <Label htmlFor="fullName">
                                    {t[language].fullName}
                                </Label>
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
                                <Label htmlFor="email">
                                    {t[language].email}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {t[language].password}
                                </Label>
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
                        onClick={onAuth}
                        className={`w-full bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90`}
                    >
                        {authMode === "login"
                            ? t[language].login
                            : t[language].signup}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthForm;
