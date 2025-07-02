"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Copy, 
  Heart, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2,
  RefreshCw,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Language } from "@/lib/types"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { VIBE_OPTIONS } from "@/lib/constants"
import Image from "next/image"

interface CaptionEntry {
  id: string
  captions: string[]
  final_caption?: string
  vibe: string
  created_at: string
  image_url?: string
  is_favorite?: boolean
  custom_prompt?: string
}

interface CaptionsLibraryProps {
  userId: string
  language: Language
}

export default function CaptionsLibrary({ userId, language }: CaptionsLibraryProps) {
  const [captions, setCaptions] = useState<CaptionEntry[]>([])
  const [filteredCaptions, setFilteredCaptions] = useState<CaptionEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVibe, setSelectedVibe] = useState<string>("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadCaptions()
  }, [userId])

  useEffect(() => {
    filterCaptions()
  }, [captions, searchQuery, selectedVibe, showFavoritesOnly])

  const loadCaptions = async () => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("generated_captions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error loading captions:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      const typedCaptions = (data || []) as unknown as CaptionEntry[]
      setCaptions(typedCaptions)
    } catch (error: any) {
      console.error("Error loading captions:", {
        message: error?.message || "Unknown error",
        error: error,
        userId: userId
      })
      toast({
        title: "Error",
        description: `Failed to load captions: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterCaptions = () => {
    let filtered = captions

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(caption =>
        caption.captions.some(c => 
          c.toLowerCase().includes(searchQuery.toLowerCase())
        ) || 
        (caption.final_caption && caption.final_caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        caption.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (caption.custom_prompt && caption.custom_prompt.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Vibe filter
    if (selectedVibe !== "all") {
      filtered = filtered.filter(caption => caption.vibe === selectedVibe)
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(caption => caption.is_favorite)
    }

    setFilteredCaptions(filtered)
  }

  const toggleFavorite = async (captionId: string) => {
    try {
      const caption = captions.find(c => c.id === captionId)
      if (!caption) return

      const newFavoriteStatus = !caption.is_favorite

      const { error } = await supabase
        .from("generated_captions")
        .update({ is_favorite: newFavoriteStatus })
        .eq("id", captionId)

      if (error) throw error

      setCaptions(prev => 
        prev.map(c => 
          c.id === captionId 
            ? { ...c, is_favorite: newFavoriteStatus }
            : c
        )
      )

      toast({
        title: newFavoriteStatus 
          ? (language === "km" ? "បានបន្ថែមចូលចំណូលចិត្ត!" : "Added to favorites!")
          : (language === "km" ? "បានយកចេញពីចំណូលចិត្ត!" : "Removed from favorites!"),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      })
    }
  }

  const deleteCaption = async (captionId: string) => {
    try {
      const { error } = await supabase
        .from("generated_captions")
        .delete()
        .eq("id", captionId)

      if (error) throw error

      setCaptions(prev => prev.filter(c => c.id !== captionId))
      
      toast({
        title: language === "km" ? "បានលុប!" : "Deleted!",
        description: language === "km" ? "ចំណងជើងបានលុប" : "Caption deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete caption.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: language === "km" ? "បានចម្លង!" : "Copied!",
      description: language === "km" ? "ចំណងជើងបានចម្លង" : "Caption copied to clipboard.",
    })
  }

  const regenerateCaption = async (captionEntry: CaptionEntry) => {
    // Redirect to generate page with pre-filled data
    const params = new URLSearchParams({
      vibe: captionEntry.vibe,
      ...(captionEntry.custom_prompt && { prompt: captionEntry.custom_prompt }),
    })
    window.location.href = `/dashboard/generate?${params.toString()}`
  }

  const toggleCaptionExpansion = (captionId: string) => {
    setExpandedCaptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(captionId)) {
        newSet.delete(captionId)
      } else {
        newSet.add(captionId)
      }
      return newSet
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "km" ? "km-KH" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {language === "km" ? "បណ្ណាល័យចំណងជើង" : "Captions Library"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "km" 
              ? `${filteredCaptions.length} ចំណងជើងទាំងអស់` 
              : `${filteredCaptions.length} total captions`}
          </p>
        </div>
        <Button onClick={loadCaptions} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {language === "km" ? "ផ្ទុកឡើងវិញ" : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === "km" ? "ស្វែងរក..." : "Search captions..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Vibe Filter */}
            <div className="w-full sm:w-48">
              <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "km" ? "ស្ទីល" : "Style"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === "km" ? "ទាំងអស់" : "All Styles"}
                  </SelectItem>
                  {VIBE_OPTIONS.map((vibe) => (
                    <SelectItem key={vibe.value} value={vibe.value}>
                      {vibe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Favorites Toggle */}
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              size="sm"
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
              {language === "km" ? "ចំណូលចិត្ត" : "Favorites"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Captions Grid */}
      {filteredCaptions.length === 0 ? (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              {language === "km" ? "រកមិនឃើញចំណងជើង" : "No captions found"}
            </h3>
            <p className="text-muted-foreground">
              {language === "km" 
                ? "សាកល្បងបង្កើតចំណងជើងខ្លះ ឬកែប្រែការស្វែងរក" 
                : "Try generating some captions or adjusting your search"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCaptions.map((caption) => (
            <Card key={caption.id} className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Left sidebar - Tags and Date */}
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    <Badge variant="outline" className="capitalize w-fit">
                      {caption.vibe}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(caption.created_at)}
                    </span>
                  </div>

                  {/* Main content area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      {/* Image Preview - now inline with content */}
                      {caption.image_url && (
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <Image
                            src={caption.image_url}
                            alt="Caption image"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        {/* Header - now just contains action buttons */}
                        <div className="flex items-center justify-end mb-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(caption.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Heart className={`w-4 h-4 ${caption.is_favorite ? "fill-current text-red-500" : ""}`} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => regenerateCaption(caption)}>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  {language === "km" ? "បង្កើតឡើងវិញ" : "Regenerate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteCaption(caption.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {language === "km" ? "លុប" : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Final Caption or All Captions */}
                        <div className="space-y-2">
                          {caption.final_caption ? (
                            /* New workflow: Show final caption with dropdown for originals */
                            <div className="space-y-2">
                              {/* Final Caption */}
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">
                                      {language === "km" ? "ចំណងជើងចុងក្រោយ" : "Final Caption"}
                                    </div>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                      {caption.final_caption}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(caption.final_caption!)}
                                    className="ml-2 flex-shrink-0"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Original Captions Dropdown */}
                              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                                <Button
                                  variant="ghost"
                                  onClick={() => toggleCaptionExpansion(caption.id)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <span className="text-sm text-muted-foreground">
                                    {language === "km" ? "មើលជម្រើសដើម (៣)" : "View original options (3)"}
                                  </span>
                                  {expandedCaptions.has(caption.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                                
                                {expandedCaptions.has(caption.id) && (
                                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
                                    {caption.captions.map((text, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded group"
                                      >
                                        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 pr-2">
                                          {text}
                                        </p>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(text)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Legacy workflow: Show all captions as before */
                            caption.captions.map((text, index) => (
                              <div
                                key={index}
                                className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                              >
                                <p className="text-sm text-gray-900 dark:text-gray-100 flex-1 pr-2">
                                  {text}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(text)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Custom Prompt */}
                        {caption.custom_prompt && (
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              <strong>{language === "km" ? "សំណើសម្រាប់:" : "Custom prompt:"}</strong> {caption.custom_prompt}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 