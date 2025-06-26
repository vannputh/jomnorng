import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

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
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
