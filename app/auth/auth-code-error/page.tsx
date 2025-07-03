"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthCodeError() {
  const router = useRouter()
  const { toast } = useToast()
  const [attempting, setAttempting] = useState(true)

  useEffect(() => {
    // Attempt to recover session from URL fragment (#access_token=...)
    const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : ""
    const params = new URLSearchParams(hash)
    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")
    const expires_in = params.get("expires_in")
    const token_type = params.get("token_type") ?? "bearer"

    if (access_token && refresh_token && expires_in) {
      const supabase = createClient()
      ;(supabase as any).auth
        .setSession({
          access_token,
          refresh_token,
          expires_in: Number(expires_in),
          token_type,
        } as any)
        .then(({ error }: any) => {
          if (!error) {
            router.replace("/dashboard")
          } else {
            setAttempting(false)
          }
        })
        .catch(() => {
          setAttempting(false)
        })
    } else {
      setAttempting(false)
    }
  }, [router])

  if (attempting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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
