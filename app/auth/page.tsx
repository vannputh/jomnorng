"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";

import AuthPage from "@/components/auth/AuthPage";

export default function AuthPageRoute() {
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const { handleAuth, isLoading } = useAuth();

    console.log(
        "AuthPageRoute: handleAuth function exists:",
        typeof handleAuth === "function"
    );

    const handleBack = () => {
        router.push("/");
    };

    return (
        <AuthPage
            language={language}
            setLanguage={setLanguage}
            onBack={handleBack}
            onAuth={handleAuth}
            isLoading={isLoading}
        />
    );
}
