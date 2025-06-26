"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-black dark:text-white">Authentication Error</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sorry, we couldn't log you in. The authentication link may have expired or been used already.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please try logging in again or contact support if the problem persists.
            </p>
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
