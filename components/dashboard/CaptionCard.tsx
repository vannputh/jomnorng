"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { 
  Copy, 
  Heart, 
  MoreVertical, 
  Trash2,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp,
  Expand
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Language } from "@/lib/types"
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

interface CaptionCardProps {
  caption: CaptionEntry
  language: Language
  expandedCaptions: Set<string>
  onToggleFavorite: (captionId: string) => void
  onDeleteCaption: (captionId: string) => void
  onRegenerateCaption: (caption: CaptionEntry) => void
  onCopyToClipboard: (text: string) => void
  onToggleCaptionExpansion: (captionId: string) => void
  formatDate: (dateString: string) => string
}

export default function CaptionCard({
  caption,
  language,
  expandedCaptions,
  onToggleFavorite,
  onDeleteCaption,
  onRegenerateCaption,
  onCopyToClipboard,
  onToggleCaptionExpansion,
  formatDate
}: CaptionCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Header with metadata and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {caption.vibe}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(caption.created_at)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(caption.id)}
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
                <DropdownMenuItem onClick={() => onRegenerateCaption(caption)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === "km" ? "បង្កើតឡើងវិញ" : "Regenerate"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteCaption(caption.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === "km" ? "លុប" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content area with improved alignment */}
        <div className="flex gap-4">
          {/* Image Preview with click to enlarge */}
          {caption.image_url && (
            <div className="flex-shrink-0">
              <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogTrigger asChild>
                  <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-500 transition-all">
                    <Image
                      src={caption.image_url}
                      alt="Caption image"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Expand className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                  <DialogTitle className="sr-only">
                    {language === "km" ? "រូបភាពពេញ" : "Full Size Image"}
                  </DialogTitle>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={caption.image_url}
                      alt="Caption image enlarged"
                      width={800}
                      height={600}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Text content - aligned with image */}
          <div className="flex-1 min-w-0">
            {/* Final Caption or All Captions */}
            <div className="space-y-3">
              {caption.final_caption ? (
                /* New workflow: Show final caption with dropdown for originals */
                <div className="space-y-3">
                  {/* Final Caption */}
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start justify-between gap-3">
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
                        onClick={() => onCopyToClipboard(caption.final_caption!)}
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Original Captions Dropdown */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Button
                      variant="ghost"
                      onClick={() => onToggleCaptionExpansion(caption.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-sm text-muted-foreground">
                        {language === "km" ? `មើលជម្រើសដើម (${caption.captions.length})` : `View original options (${caption.captions.length})`}
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
                            className="flex items-start justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded group"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                              {text}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onCopyToClipboard(text)}
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
                <div className="space-y-2">
                  {caption.captions.map((text, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                    >
                      <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                        {text}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyToClipboard(text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Prompt */}
            {caption.custom_prompt && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>{language === "km" ? "សំណើសម្រាប់:" : "Custom prompt:"}</strong>{" "}
                  <span className="font-normal">{caption.custom_prompt}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 