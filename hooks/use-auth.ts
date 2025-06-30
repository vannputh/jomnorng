import { useState, useEffect } from "react"
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
    if (!supabase) return
    
    setIsLoading(true)
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        
        // Don't redirect immediately - let the auth state change handle it
        // The onAuthStateChange listener will detect the login and redirect appropriately
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
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
        })
        
        // Handle redirect after successful login
        if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
          // Get the intended redirect URL from URL params or default to dashboard
          const urlParams = new URLSearchParams(window.location.search)
          const next = urlParams.get('next') || '/dashboard'
          
          // Only redirect if we're currently on the auth page
          if (window.location.pathname === '/auth') {
            router.push(next)
          }
        }
      } else {
        setUser(null)
      }
      
      // Ensure loading state is updated
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    isLoading,
    handleAuth,
    handleLogout,
    clearAuthData,
  }
} 