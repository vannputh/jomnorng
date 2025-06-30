"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Copy, Calendar } from "lucide-react"
import type { Language } from "@/lib/types"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalCaptions: number
  thisWeekCaptions: number
  popularVibes: { vibe: string; count: number }[]
  recentActivity: {
    id: string
    captions: string[]
    vibe: string
    created_at: string
    image_url?: string
  }[]
}

interface DashboardAnalyticsProps {
  userId: string
  language: Language
}

export default function DashboardAnalytics({ userId, language }: DashboardAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCaptions: 0,
    thisWeekCaptions: 0,
    popularVibes: [],
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [userId])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Get all captions for this user
      const { data: allCaptions, error } = await supabase
        .from("generated_captions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Type assertion for the data
      const typedCaptions = (allCaptions || []) as Array<{
        id: string
        captions: string[]
        vibe: string
        created_at: string
        image_url?: string
        user_id: string
        custom_prompt?: string
        company_profile?: any
        language?: string
      }>

      // Calculate statistics
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const thisWeekCaptions = typedCaptions.filter(
        (caption) => new Date(caption.created_at) > oneWeekAgo
      ).length

      // Count popular vibes
      const vibeCount: Record<string, number> = {}
      typedCaptions.forEach((caption) => {
        vibeCount[caption.vibe] = (vibeCount[caption.vibe] || 0) + 1
      })

      const popularVibes = Object.entries(vibeCount)
        .map(([vibe, count]) => ({ vibe, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Recent activity (last 5) - map to match our interface
      const recentActivity = typedCaptions.slice(0, 5).map(caption => ({
        id: caption.id,
        captions: caption.captions,
        vibe: caption.vibe,
        created_at: caption.created_at,
        image_url: caption.image_url,
      }))

      setAnalytics({
        totalCaptions: typedCaptions.length,
        thisWeekCaptions,
        popularVibes,
        recentActivity,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: language === "km" ? "បានចម្លង!" : "Copied!",
      description: language === "km" ? "ចំណងជើងបានចម្លង" : "Caption copied to clipboard.",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return language === "km" ? "ម្សិលមិញ" : "Yesterday"
    if (diffDays <= 7) return language === "km" ? `${diffDays} ថ្ងៃមុន` : `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "km" ? "ចំណងជើងសរុប" : "Total Captions"}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCaptions}</div>
            <p className="text-xs text-muted-foreground">
              {language === "km" ? "ចំណងជើងបានបង្កើត" : "captions generated"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "km" ? "សប្តាហ៍នេះ" : "This Week"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisWeekCaptions}</div>
            <p className="text-xs text-muted-foreground">
              {language === "km" ? "ចំណងជើងថ្មី" : "new captions"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "km" ? "ស្ទីលពេញនិយម" : "Popular Style"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {analytics.popularVibes[0]?.vibe || (language === "km" ? "គ្មាន" : "None")}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.popularVibes[0]?.count || 0} {language === "km" ? "ដង" : "times"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Vibes */}
      {analytics.popularVibes.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === "km" ? "ស្ទីលពេញនិយម" : "Popular Styles"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.popularVibes.map((vibe, index) => (
                <Badge
                  key={vibe.vibe}
                  variant={index === 0 ? "default" : "secondary"}
                  className="capitalize"
                >
                  {vibe.vibe} ({vibe.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === "km" ? "សកម្មភាពថ្មីៗ" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="capitalize text-xs">
                        {activity.vibe}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                      {activity.captions[0]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(activity.captions[0])}
                    className="ml-2 flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 