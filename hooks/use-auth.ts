import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import type { UserType, AuthMode } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = typeof window !== "undefined" ? createClient() : null


  const clearAuthData = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token")
        sessionStorage.clear()
      }
    } catch (error) {
      console.log("Error clearing auth data:", error)
    }
  }

  const handleAuth = async (authMode: AuthMode, email: string, password: string, fullName?: string) => {
    console.log("handleAuth called with:", { authMode, email, password: "***", fullName })
    
    if (!supabase) return
    
    setIsLoading(true)
    try {
      if (authMode === "signup") {
        const urlParams = new URLSearchParams(window.location.search)
        const next = urlParams.get("next") || "/dashboard"
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        })
        if (error) throw error
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Direct redirect after successful login
        const urlParams = new URLSearchParams(window.location.search)
        const next = urlParams.get('next') || '/dashboard'
        console.log("Login successful, redirecting to:", next)
        
        // Use window.location.replace for immediate redirect
        window.location.replace(next)
        return
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await clearAuthData()
    setUser(null)
    router.push("/")
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) return

    try {
      setIsLoading(true)
      const urlParams = new URLSearchParams(window.location.search)
      const next = urlParams.get("next") || "/dashboard"
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error } = await (supabase as any).auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          flowType: "pkce",
        } as any,
      })
      if (error) {
        throw error
      }
      // On success, Supabase will handle the redirect to Google then back to our callback URL
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      // We keep loading state as true because the page will change on redirect, but ensure we reset just in case
      setIsLoading(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    if (!supabase) return
    
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name,
          })
        }
      } catch (error) {
        console.log("Error getting user:", error)
        await clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user ? "User present" : "No user")
      
      if (session?.user) {
        const newUser = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
        }
        setUser(newUser)
      } else {
        setUser(null)
      }
      
      // Ensure loading state is updated
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Client-side route protection and redirects
  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return
    
    const currentPath = window.location.pathname
    const protectedPaths = ['/dashboard', '/setup']
    const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path))
    const isOnAuthPage = currentPath === '/auth'
    
    if (isProtectedPath && !user) {
      // Redirect unauthenticated users from protected routes to auth
      console.log("Unauthenticated user on protected route, redirecting to auth...")
      const redirectUrl = `/auth?next=${encodeURIComponent(currentPath)}`
      window.location.replace(redirectUrl)
    } else if (isOnAuthPage && user) {
      // Redirect authenticated users away from auth page
      console.log("Authenticated user on auth page, redirecting...")
      const urlParams = new URLSearchParams(window.location.search)
      const next = urlParams.get('next') || '/dashboard'
      window.location.replace(next)
    }
  }, [user, isLoading])

  return {
    user,
    isLoading,
    handleAuth,
    handleGoogleSignIn,
    handleLogout,
    clearAuthData,
  }
} 