import type React from "react";
import type { Metadata, Viewport } from "next";
import { Dangrek } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const dangrek = Dangrek({
    subsets: ["latin"],
    weight: "400",
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
                <link rel="icon" href="/favicon.ico" sizes="32x32" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
            </head>
            <body
                className={`${dangrek.className} min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen">{children}</div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
