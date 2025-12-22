import type React from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import WavesBackground from "@/components/WavesBackground";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "ចំណង (Jomnorng) - AI Caption Generator",
    description: "កម្មវិធីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយ AI",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "ចំណង",
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: "ចំណង (Jomnorng)",
        title: "ចំណង (Jomnorng) - AI Caption Generator",
        description: "កម្មវិធីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយ AI",
    },
    twitter: {
        card: "summary",
        title: "ចំណង (Jomnorng) - AI Caption Generator",
        description: "កម្មវិធីបង្កើតចំណងជើងសម្រាប់បណ្តាញសង្គមដោយ AI",
    },
    generator: "v0.dev",
    icons: {
        icon: [
            { url: "/logo-light.png", media: "(prefers-color-scheme: light)" },
            { url: "/logo-dark.png", media: "(prefers-color-scheme: dark)" },
            "/favicon.ico",
        ],
        apple: "/logo-light.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#1EA896",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/logo-light.png" media="(prefers-color-scheme: light)" />
                <link rel="icon" href="/logo-dark.png" media="(prefers-color-scheme: dark)" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo-light.png" />
            </head>
            <body
                className={`${poppins.className} min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <LanguageProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <WavesBackground />
                        <div className="flex flex-col min-h-screen">{children}</div>
                        <Toaster />
                    </ThemeProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
