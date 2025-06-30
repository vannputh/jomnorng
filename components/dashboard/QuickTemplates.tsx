"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  ShoppingBag, 
  Users, 
  Trophy, 
  Heart, 
  Camera,
  Briefcase,
  Star,
  TrendingUp,
  Gift,
  MessageCircle,
  ArrowRight
} from "lucide-react"
import type { Language } from "@/lib/types"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  title: string
  titleKm: string
  description: string
  descriptionKm: string
  vibe: string
  category: string
  categoryKm: string
  icon: any
  prompt: string
  examples: string[]
  examplesKm: string[]
}

interface QuickTemplatesProps {
  language: Language
}

const TEMPLATES: Template[] = [
  {
    id: "product-launch",
    title: "Product Launch",
    titleKm: "ការចេញផ្សាយផលិតផល",
    description: "Announce new products with excitement",
    descriptionKm: "ប្រកាសផលិតផលថ្មីដោយភាពរំភើប",
    vibe: "exciting",
    category: "Business",
    categoryKm: "ពាណិជ្ជកម្ម",
    icon: ShoppingBag,
    prompt: "Create an exciting product launch announcement that highlights the key features and benefits.",
    examples: [
      "🚀 Introducing our latest innovation! Experience the future with [Product Name].",
      "The wait is over! Our new [Product] is here to revolutionize your [industry/life].",
      "Breaking: We've just launched something incredible! Check out our latest [Product Name]."
    ],
    examplesKm: [
      "🚀 សូមណែនាំដំណើរការថ្មីរបស់យើង! សម្រាប់អនាគតជាមួយ [ឈ្មោះផលិតផល]។",
      "ការរង់ចាំបានបញ្ចប់! [ផលិតផល] ថ្មីរបស់យើងនៅទីនេះដើម្បីបដិវត្ត [វិស័យ/ជីវិត] របស់អ្នក។",
      "ព័ត៌មាន: យើងទើបតែបានចេញផ្សាយអ្វីមួយដ៏អស្ចារ្យ! សូមពិនិត្យមើល [ឈ្មោះផលិតផល] ថ្មីរបស់យើង។"
    ]
  },
  {
    id: "behind-scenes",
    title: "Behind the Scenes",
    titleKm: "ពីក្រោយឆាក",
    description: "Share your work process and team moments",
    descriptionKm: "ចែករំលែកដំណើរការងារ និងពេលវេលាក្រុម",
    vibe: "casual",
    category: "Personal",
    categoryKm: "ផ្ទាល់ខ្លួន",
    icon: Camera,
    prompt: "Create a casual behind-the-scenes post that shows the human side of your work or business.",
    examples: [
      "Coffee in hand, creativity in mind ☕ Here's what a typical Tuesday looks like in our studio.",
      "The magic happens here! Take a peek behind the curtain of our creative process.",
      "Real talk: This is what passion looks like at 2 AM. Worth every minute! 💪"
    ],
    examplesKm: [
      "កាហ្វេនៅក្នុងដៃ ភាពច្នៃប្រឌិតនៅក្នុងគំនិត ☕ នេះជាអ្វីដែលថ្ងៃអង្គារធម្មតាមើលទៅដូចនៅក្នុងស្ទូឌីយ៉ូរបស់យើង។",
      "អាថ៌កំបាំងកើតឡើងនៅទីនេះ! សូមមើលពីក្រោយផ្ទាំងនៃដំណើរការច្នៃប្រឌិតរបស់យើង។",
      "និយាយពិត៖ នេះជាអ្វីដែលចំណង់ចំណូលចិត្តមើលទៅដូចនៅម៉ោង 2 ព្រឹក។ សមនឹងរាល់នាទី! 💪"
    ]
  },
  {
    id: "customer-spotlight",
    title: "Customer Spotlight",
    titleKm: "ការបង្ហាញអតិថិជន",
    description: "Highlight customer success stories",
    descriptionKm: "បង្ហាញរឿងរ៉ាវជោគជ័យរបស់អតិថិជន",
    vibe: "professional",
    category: "Business",
    categoryKm: "ពាណិជ្ជកម្ម",
    icon: Users,
    prompt: "Create a professional customer success story that showcases results and builds trust.",
    examples: [
      "Success Story: How [Customer Name] achieved [specific result] using our [product/service].",
      "Client Spotlight: [Customer Name] shares their incredible journey with us. Results speak louder than words!",
      "Real results from real people. Discover how [Customer Name] transformed their [business/life] with our help."
    ],
    examplesKm: [
      "រឿងរ៉ាវជោគជ័យ៖ របៀបដែល [ឈ្មោះអតិថិជន] សម្រេចបាន [លទ្ធផលជាក់លាក់] ដោយប្រើ [ផលិតផល/សេវាកម្ម] របស់យើង។",
      "ការបង្ហាញអតិថិជន៖ [ឈ្មោះអតិថិជន] ចែករំលែកដំណើរដ៏អស្ចារ្យរបស់ពួកគេជាមួយយើង។ លទ្ធផលនិយាយខ្លាំងជាងពាក្យ!",
      "លទ្ធផលពិតពីមនុស្សពិត។ សូមរកមើលថាតើ [ឈ្មោះអតិថិជន] បានផ្លាស់ប្តូរ [អាជីវកម្ម/ជីវិត] របស់ពួកគេដោយជំនួយរបស់យើងយ៉ាងដូចម្តេច។"
    ]
  },
  {
    id: "achievement",
    title: "Achievement & Milestone",
    titleKm: "សមិទ្ធផល និងគន្លឹះសំខាន់",
    description: "Celebrate wins and important milestones",
    descriptionKm: "អបអរចំណើរជ័យ និងគន្លឹះសំខាន់ៗ",
    vibe: "professional",
    category: "Business",
    categoryKm: "ពាណិជ្ជកម្ម",
    icon: Trophy,
    prompt: "Create a celebratory post about an achievement or milestone that inspires and engages your audience.",
    examples: [
      "🎉 Milestone Alert! We're thrilled to announce that we've reached [achievement]. Thank you for being part of our journey!",
      "Breaking news: We just hit [milestone]! This wouldn't be possible without our amazing community.",
      "From small beginnings to big achievements. Today we celebrate [specific milestone] with gratitude and excitement!"
    ],
    examplesKm: [
      "🎉 ការជូនដំណឹងគន្លឹះសំខាន់! យើងរំភើបជំរាបថាយើងបានឈានដល់ [សមិទ្ធផល]។ សូមអរគុណសម្រាប់ការចូលរួមនៅក្នុងដំណើររបស់យើង!",
      "ព័ត៌មានដំបូង៖ យើងទើបតែបានឈានដល់ [គន្លឹះសំខាន់]! នេះមិនអាចទៅរួចបានដោយមិនមានសហគមន៍អស្ចារ្យរបស់យើងទេ។",
      "ពីការចាប់ផ្តើមតូចតាចរហូតដល់សមិទ្ធផលធំ។ ថ្ងៃនេះយើងអបអរ [គន្លឹះសំខាន់ជាក់លាក់] ដោយការដឹងគុណ និងភាពរំភើប!"
    ]
  },
  {
    id: "motivational",
    title: "Motivational Quote",
    titleKm: "ពាក្យលើកទឹកចិត្ត",
    description: "Inspire your audience with meaningful quotes",
    descriptionKm: "លើកកម្ពស់ទស្សនិកជនរបស់អ្នកដោយពាក្យដែលមានអត្ថន័យ",
    vibe: "inspiring",
    category: "Personal",
    categoryKm: "ផ្ទាល់ខ្លួន",
    icon: Heart,
    prompt: "Create an inspiring motivational post with a meaningful quote and personal reflection.",
    examples: [
      "💫 \"Success is not final, failure is not fatal: it is the courage to continue that counts.\" - Winston Churchill",
      "Monday Motivation: Remember, every expert was once a beginner. Your journey matters more than your destination.",
      "✨ \"The only way to do great work is to love what you do.\" What are you passionate about today?"
    ],
    examplesKm: [
      "💫 \"ជោគជ័យមិនមែនជាចុងបញ្ចប់ ការបរាជ័យមិនមែនមហន្តរាយ៖ វាគឺជាភាពក្លាហានបន្តដែលសំខាន់។\" - វីនស្តុន ចឺរ្ឈីល",
      "ការលើកទឹកចិត្តថ្ងៃច័ន្ទ៖ ចងចាំថា អ្នកជំនាញគ្រប់រូបធ្លាប់ជាអ្នកចាប់ផ្តើម។ ដំណើររបស់អ្នកសំខាន់ជាងគោលដៅរបស់អ្នក។",
      "✨ \"មធ្យោបាយតែមួយគត់ដើម្បីធ្វើការងារដ៏ល្អគឺស្រលាញ់អ្វីដែលអ្នកធ្វើ។\" តើអ្នកមានចំណង់ចំណូលចិត្តលើអ្វីនៅថ្ងៃនេះ?"
    ]
  },
  {
    id: "team-appreciation",
    title: "Team Appreciation",
    titleKm: "ការកោតសរសើរក្រុម",
    description: "Thank and recognize your team members",
    descriptionKm: "អរគុណ និងទទួលស្គាល់សមាជិកក្រុមរបស់អ្នក",
    vibe: "heartfelt",
    category: "Business",
    categoryKm: "ពាណិជ្ជកម្ម",
    icon: Star,
    prompt: "Create a heartfelt team appreciation post that recognizes contributions and builds team morale.",
    examples: [
      "Shoutout to our incredible team! 👏 Your dedication and hard work make everything possible.",
      "Behind every success is an amazing team. Grateful for these rockstars who make magic happen daily!",
      "Team appreciation post: These brilliant minds are the heart of our company. Thank you for everything you do!"
    ],
    examplesKm: [
      "សរសើរដល់ក្រុមអស្ចារ្យរបស់យើង! 👏 ការលះបង់ និងការខិតខំធ្វើការរបស់អ្នករាល់រូបធ្វើឱ្យអ្វីគ្រប់យ៉ាងអាចទៅរួច។",
      "ពីក្រោយជោគជ័យគ្រប់យ៉ាងមានក្រុមដ៏អស្ចារ្យ។ ដឹងគុណចំពោះផ្កាយរុះនេះដែលធ្វើឱ្យអាថ៌កំបាំងកើតឡើងជារៀងរាល់ថ្ងៃ!",
      "ការកោតសរសើរក្រុម៖ គំនិតដ៏ពូកែទាំងនេះគឺជាបេះដូងក្រុមហ៊ុនរបស់យើង។ សូមអរគុណសម្រាប់អ្វីគ្រប់យ៉ាងដែលអ្នកធ្វើ!"
    ]
  },
  {
    id: "educational",
    title: "Educational Tip",
    titleKm: "គន្លឹះអប់រំ",
    description: "Share valuable tips and knowledge",
    descriptionKm: "ចែករំលែកគន្លឹះ និងចំណេះដឹងមានតម្លៃ",
    vibe: "professional",
    category: "Educational",
    categoryKm: "អប់រំ",
    icon: Briefcase,
    prompt: "Create an educational post that shares valuable tips, insights, or knowledge in your field.",
    examples: [
      "Pro Tip Tuesday: Here's a simple trick that can save you hours of work every week.",
      "Did you know? [Interesting fact/tip] - This small change can make a big difference!",
      "Quick tip: Master this one technique and watch your [productivity/results] soar!"
    ],
    examplesKm: [
      "គន្លឹះអ្នកជំនាញថ្ងៃអង្គារ៖ នេះជាកលល្បិចសាមញ្ញដែលអាចសន្សំពេលវេលាជាច្រើនម៉ោងក្នុងមួយសប្តាហ៍។",
      "តើអ្នកដឹងទេ? [ការពិត/គន្លឹះគួរឱ្យចាប់អារម្មណ៍] - ការផ្លាស់ប្តូរតូចនេះអាចធ្វើឱ្យមានការផ្លាស់ប្តូរធំ!",
      "គន្លឹះរហ័ស៖ ចេះបច្ចេកទេសមួយនេះ ហើយមើលការ [ផលិតភាព/លទ្ធផល] របស់អ្នកកើនឡើង!"
    ]
  },
  {
    id: "promotion",
    title: "Special Promotion",
    titleKm: "ការផ្សព្វផ្សាយពិសេស",
    description: "Announce special offers and discounts",
    descriptionKm: "ប្រកាសការផ្តល់ជូន និងបញ្ចុះតម្លៃពិសេស",
    vibe: "exciting",
    category: "Business",
    categoryKm: "ពាណិជ្ជកម្ម",
    icon: Gift,
    prompt: "Create an exciting promotional post that highlights special offers and creates urgency.",
    examples: [
      "🔥 LIMITED TIME: Get [discount]% off on [product/service]. Don't miss out - offer ends soon!",
      "Flash Sale Alert! 48 hours only - Save big on your favorite [products]. Shop now!",
      "Special offer just for YOU! Use code [CODE] and enjoy [benefit]. Valid until [date]."
    ],
    examplesKm: [
      "🔥 ពេលវេលាកំណត់៖ ទទួលបានបញ្ចុះតម្លៃ [បញ្ចុះតម្លៃ]% លើ [ផលិតផល/សេវាកម្ម]។ កុំខកខាន - ការផ្តល់ជូននឹងបញ្ចប់ឆាប់ៗ!",
      "ការជូនដំណឹងលក់រហ័ស! 48 ម៉ោងប៉ុណ្ណោះ - សន្សំធំលើ [ផលិតផល] ដែលអ្នកចូលចិត្ត។ ទិញឥឡូវនេះ!",
      "ការផ្តល់ជូនពិសេសសម្រាប់អ្នក! ប្រើកូដ [កូដ] ហើយរីករាយជាមួយ [អត្ថប្រយោជន៍]។ ស្របតាម [កាលបរិច្ឆេទ]។"
    ]
  }
]

export default function QuickTemplates({ language }: QuickTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const router = useRouter()

  const categories = ["all", "Business", "Personal", "Educational"]
  const categoriesKm = ["ទាំងអស់", "ពាណិជ្ជកម្ម", "ផ្ទាល់ខ្លួន", "អប់រំ"]

  const filteredTemplates = selectedCategory === "all" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory)

  const useTemplate = (template: Template) => {
    // Navigate to generate page with pre-filled template data
    const params = new URLSearchParams({
      vibe: template.vibe,
      prompt: template.prompt,
      template: template.id
    })
    router.push(`/dashboard/generate?${params.toString()}`)
  }

  const getCategoryLabel = (category: string, index: number) => {
    return language === "km" ? categoriesKm[index] : category
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          {language === "km" ? "គំរូចាប់ផ្តើមរហ័ស" : "Quick Start Templates"}
        </h2>
        <p className="text-muted-foreground">
          {language === "km" 
            ? "ជ្រើសរើសគំរូដើម្បីបង្កើតចំណងជើងរហ័ស" 
            : "Choose a template to quickly generate captions"}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {getCategoryLabel(category, index)}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon
          return (
            <Card key={template.id} className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-black dark:text-white">
                      {language === "km" ? template.titleKm : template.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {language === "km" ? template.categoryKm : template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.vibe}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === "km" ? template.descriptionKm : template.description}
                </p>

                {/* Example Preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === "km" ? "ឧទាហរណ៍:" : "Example:"}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                    {language === "km" ? template.examplesKm[0] : template.examples[0]}
                  </p>
                </div>

                <Button 
                  onClick={() => useTemplate(template)}
                  className="w-full"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {language === "km" ? "ប្រើគំរូនេះ" : "Use Template"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            {language === "km" ? "មិនឃើញអ្វីដែលអ្នកត្រូវការ?" : "Don't see what you need?"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === "km" 
              ? "បង្កើតចំណងជើងផ្ទាល់ខ្លួនដោយការផ្ទុករូបភាព" 
              : "Create custom captions by uploading your own image"}
          </p>
          <Button onClick={() => router.push('/dashboard/generate')}>
            <Camera className="w-4 h-4 mr-2" />
            {language === "km" ? "បង្កើតផ្ទាល់ខ្លួន" : "Create Custom"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 