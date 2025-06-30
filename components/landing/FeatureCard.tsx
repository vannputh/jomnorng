import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
      <CardContent className="p-6 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
} 