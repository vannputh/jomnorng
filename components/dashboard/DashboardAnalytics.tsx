"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart3,
  TrendingUp,
  Copy,
  Calendar,
  Clock,
  Target,
  Zap,
  Trophy,
  Activity,
  Eye,
  TrendingDown,
  Star,
  HelpCircle
} from "lucide-react"
import type { Language } from "@/lib/types"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import GlassSurface from "@/components/ui/GlassSurface"
import { useTheme } from "next-themes"

interface AnalyticsData {
  totalCaptions: number
  thisWeekCaptions: number
  lastWeekCaptions: number
  timeSaved: number // in minutes
  popularVibes: { vibe: string; count: number; percentage: number }[]
  recentActivity: {
    id: string
    captions: string[]
    vibe: string
    created_at: string
    image_url?: string
  }[]
  streakDays: number
}

interface DashboardAnalyticsProps {
  userId: string
  language: Language
}

export default function DashboardAnalytics({ userId, language }: DashboardAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCaptions: 0,
    thisWeekCaptions: 0,
    lastWeekCaptions: 0,
    timeSaved: 0,
    popularVibes: [],
    recentActivity: [],
    streakDays: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { theme } = useTheme()

  const glassBrightness = 110
  const glassOpacity = 0.3
  const glassBlur = 12
  const glassDistortion = 0
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
        caption_length?: string
      }>

      // Calculate time periods
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

      const thisWeekCaptions = typedCaptions.filter(
        (caption) => new Date(caption.created_at) > oneWeekAgo
      ).length

      const lastWeekCaptions = typedCaptions.filter(
        (caption) => {
          const date = new Date(caption.created_at)
          return date > twoWeeksAgo && date <= oneWeekAgo
        }
      ).length

      // Calculate time saved based on caption length (dynamic)
      const timeSaved = typedCaptions.reduce((total, caption) => {
        const length = caption.caption_length || 'medium' // default to medium if not specified
        let timePerCaption

        switch (length) {
          case 'short':
            timePerCaption = 3 // 3 minutes for short captions
            break
          case 'medium':
            timePerCaption = 6 // 6 minutes for medium captions
            break
          case 'long':
            timePerCaption = 10 // 10 minutes for long captions
            break
          default:
            timePerCaption = 6 // default to medium
        }

        return total + timePerCaption
      }, 0)

      // Count popular vibes with percentages
      const vibeCount: Record<string, number> = {}
      typedCaptions.forEach((caption) => {
        vibeCount[caption.vibe] = (vibeCount[caption.vibe] || 0) + 1
      })

      const popularVibes = Object.entries(vibeCount)
        .map(([vibe, count]) => ({
          vibe,
          count,
          percentage: Math.round((count / typedCaptions.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Calculate streak days (simplified)
      const streakDays = thisWeekCaptions > 0 ? Math.min(7, thisWeekCaptions) : 0



      // Recent activity (last 3) - map to match our interface
      const recentActivity = typedCaptions.slice(0, 3).map(caption => ({
        id: caption.id,
        captions: caption.captions,
        vibe: caption.vibe,
        created_at: caption.created_at,
        image_url: caption.image_url,
      }))

      setAnalytics({
        totalCaptions: typedCaptions.length,
        thisWeekCaptions,
        lastWeekCaptions,
        timeSaved,
        popularVibes,
        recentActivity,
        streakDays,
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

  const getGrowthIndicator = () => {
    if (analytics.lastWeekCaptions === 0) return { trend: 'new', color: 'text-blue-600' }
    const growth = ((analytics.thisWeekCaptions - analytics.lastWeekCaptions) / analytics.lastWeekCaptions) * 100
    if (growth > 0) return { trend: `+${Math.round(growth)}%`, color: 'text-green-600' }
    if (growth < 0) return { trend: `${Math.round(growth)}%`, color: 'text-red-600' }
    return { trend: '0%', color: 'text-gray-600' }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      </div>
    )
  }

  const growthData = getGrowthIndicator()

  return (
    <div className="space-y-8">
      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          opacity={glassOpacity}
          blur={glassBlur}
          brightness={glassBrightness}
          distortionScale={glassDistortion}
          className="border border-white/20 shadow-lg"
        >
          <div className="p-6 h-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 dark:from-blue-400/15 dark:to-indigo-400/15 rounded-[20px]">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {language === "km" ? "ចំណងជើងសរុប" : "Total Captions"}
              </h3>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analytics.totalCaptions}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {language === "km" ? "ចំណងជើងបានបង្កើត" : "captions generated"}
              </p>
            </div>
          </div>
        </GlassSurface>

        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          opacity={glassOpacity}
          blur={glassBlur}
          brightness={glassBrightness}
          distortionScale={glassDistortion}
          className="border border-white/20 shadow-lg"
        >
          <div className="p-6 h-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 dark:from-green-400/15 dark:to-emerald-400/15 rounded-[20px]">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {language === "km" ? "សប្តាហ៍នេះ" : "This Week"}
              </h3>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{analytics.thisWeekCaptions}</div>
                <span className={`text-xs font-medium ${growthData.color}`}>
                  {growthData.trend}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                {language === "km" ? "ចំណងជើងថ្មី" : "new captions"}
              </p>
            </div>
          </div>
        </GlassSurface>

        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          opacity={glassOpacity}
          blur={glassBlur}
          brightness={glassBrightness}
          distortionScale={glassDistortion}
          className="border border-white/20 shadow-lg"
        >
          <div className="p-6 h-full bg-gradient-to-br from-purple-500/15 to-violet-500/15 dark:from-purple-400/15 dark:to-violet-400/15 rounded-[20px]">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {language === "km" ? "ពេលវេលាសន្សំ" : "Time Saved"}
              </h3>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {Math.floor(analytics.timeSaved / 60)}h {analytics.timeSaved % 60}m
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {language === "km" ? "ប្រៀបធៀបនឹងការសរសេរដោយដៃ" : "vs manual writing"}
              </p>
            </div>
          </div>
        </GlassSurface>

        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          opacity={glassOpacity}
          blur={glassBlur}
          brightness={glassBrightness}
          distortionScale={glassDistortion}
          className="border border-white/20 shadow-lg"
        >
          <div className="p-6 h-full bg-gradient-to-br from-orange-500/15 to-red-500/15 dark:from-orange-400/15 dark:to-red-400/15 rounded-[20px]">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">
                {language === "km" ? "កំណត់ត្រាបន្ត" : "Current Streak"}
              </h3>
              <Zap className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{analytics.streakDays}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {language === "km" ? "ថ្ងៃបន្តបន្ទាប់" : "consecutive days"}
              </p>
            </div>
          </div>
        </GlassSurface>
      </div>

      {/* Performance Metrics Removed */}

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* Popular Vibes */}
        {analytics.popularVibes.length > 0 && (
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={20}
            opacity={glassOpacity}
            blur={glassBlur}
            brightness={glassBrightness}
            distortionScale={glassDistortion}
            className="border border-white/20 shadow-lg md:col-span-2"
          >
            <div className="p-6 h-full bg-white/20 dark:bg-black/20 rounded-[20px]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {language === "km" ? "ស្ទីលពេញនិយម" : "Popular Styles"}
                </h3>
              </div>
              <div>
                <div className="space-y-3">
                  {analytics.popularVibes.map((vibe, index) => (
                    <div key={vibe.vibe} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {vibe.vibe}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {vibe.count} {language === "km" ? "ដង" : "times"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${vibe.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{vibe.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassSurface>
        )}
      </div>

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          opacity={glassOpacity}
          blur={glassBlur}
          brightness={glassBrightness}
          distortionScale={glassDistortion}
          className="border border-white/20 shadow-lg"
        >
          <div className="p-6 h-full bg-white/20 dark:bg-black/20 rounded-[20px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {language === "km" ? "សកម្មភាពថ្មីៗ" : "Recent Activity"}
              </h3>
            </div>
            <div>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between p-4 bg-white/20 dark:bg-black/20 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors border border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize text-xs">
                          {activity.vibe}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-relaxed">
                        {activity.captions[0]}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(activity.captions[0])}
                      className="ml-3 flex-shrink-0 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassSurface>
      )}
    </div>
  )
} 