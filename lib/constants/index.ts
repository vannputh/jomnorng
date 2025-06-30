import {
  Coffee,
  Zap,
  Smile,
  Sparkles,
  Heart,
} from "lucide-react"
import type { VibeOption, BusinessType, TargetAudience, BrandVoice, CompanySize, MarketingGoal } from "../types"

export const VIBE_OPTIONS: VibeOption[] = [
  { value: "casual", label: "ធម្មតា", labelEn: "Casual", icon: Coffee },
  { value: "professional", label: "វិជ្ជាជីវៈ", labelEn: "Professional", icon: Zap },
  { value: "fun", label: "កំសាន្ត", labelEn: "Fun & Playful", icon: Smile },
  { value: "inspirational", label: "បំផុសគំនិត", labelEn: "Inspirational", icon: Sparkles },
  { value: "trendy", label: "ទាន់សម័យ", labelEn: "Trendy", icon: Heart },
]

export const BUSINESS_TYPES: BusinessType[] = [
  { value: "restaurant", label: "ភោជនីយដ្ឋាន/អាហារ", labelEn: "Restaurant/Food" },
  { value: "fashion", label: "ម៉ូដ/សម្លៀកបំពាក់", labelEn: "Fashion/Clothing" },
  { value: "technology", label: "បច្ចេកវិទ្យា", labelEn: "Technology" },
  { value: "healthcare", label: "សុខាភិបាល", labelEn: "Healthcare" },
  { value: "education", label: "អប់រំ", labelEn: "Education" },
  { value: "realestate", label: "អចលនទ្រព្យ", labelEn: "Real Estate" },
  { value: "tourism", label: "ទេសចរណ៍", labelEn: "Tourism" },
  { value: "beauty", label: "សម្រស់/គ្រឿងសម្អាង", labelEn: "Beauty/Cosmetics" },
  { value: "automotive", label: "យានយន្ត", labelEn: "Automotive" },
  { value: "finance", label: "ហិរញ្ញវត្ថុ", labelEn: "Finance" },
  { value: "other", label: "ផ្សេងៗ", labelEn: "Other" },
]

export const TARGET_AUDIENCES: TargetAudience[] = [
  { value: "young-adults", label: "យុវជន (១៨-២៥)", labelEn: "Young Adults (18-25)" },
  { value: "adults", label: "មនុស្សពេញវ័យ (២៦-៤០)", labelEn: "Adults (26-40)" },
  { value: "middle-aged", label: "វ័យកណ្តាល (៤១-៥៥)", labelEn: "Middle-aged (41-55)" },
  { value: "seniors", label: "មនុស្សចាស់ (៥៥+)", labelEn: "Seniors (55+)" },
  { value: "students", label: "និស្សិត", labelEn: "Students" },
  { value: "professionals", label: "អ្នកជំនាញ", labelEn: "Professionals" },
  { value: "parents", label: "ឪពុកម្តាយ", labelEn: "Parents" },
  { value: "entrepreneurs", label: "សហគ្រិន", labelEn: "Entrepreneurs" },
  { value: "general", label: "សាធារណជន", labelEn: "General Public" },
]

export const BRAND_VOICES: BrandVoice[] = [
  { value: "friendly", label: "មិត្តភាព និងងាយស្រួល", labelEn: "Friendly & Approachable" },
  { value: "professional", label: "វិជ្ជាជីវៈ និងអាជ្ញាធរ", labelEn: "Professional & Authoritative" },
  { value: "fun", label: "កំសាន្ត និងលេង", labelEn: "Fun & Playful" },
  { value: "sophisticated", label: "ទំនើប និងឆើតឆាយ", labelEn: "Sophisticated & Elegant" },
  { value: "bold", label: "ក្លាហាន និងច្នៃប្រឌិត", labelEn: "Bold & Edgy" },
  { value: "warm", label: "កក់ក្តៅ និងយកចិត្តទុកដាក់", labelEn: "Warm & Caring" },
  { value: "innovative", label: "ច្នៃប្រឌិត និងទំនើប", labelEn: "Innovative & Forward-thinking" },
]

export const COMPANY_SIZES: CompanySize[] = [
  { value: "1-10", label: "១-១០ នាក់", labelEn: "1-10 employees" },
  { value: "11-50", label: "១១-៥០ នាក់", labelEn: "11-50 employees" },
  { value: "51-200", label: "៥១-២០០ នាក់", labelEn: "51-200 employees" },
  { value: "201-1000", label: "២០១-១០០០ នាក់", labelEn: "201-1000 employees" },
  { value: "1000+", label: "១០០០+ នាក់", labelEn: "1000+ employees" },
]

export const MARKETING_GOALS: MarketingGoal[] = [
  { value: "brand-awareness", label: "ការស្គាល់ម៉ាក", labelEn: "Brand Awareness" },
  { value: "lead-generation", label: "បង្កើតអតិថិជនសក្តានុពល", labelEn: "Lead Generation" },
  { value: "sales", label: "ការលក់", labelEn: "Sales" },
  { value: "engagement", label: "ការចូលរួម", labelEn: "Engagement" },
  { value: "community", label: "បង្កើតសហគមន៍", labelEn: "Community Building" },
  { value: "retention", label: "រក្សាអតិថិជន", labelEn: "Customer Retention" },
  { value: "product-launch", label: "បើកដំណើរការផលិតផល", labelEn: "Product Launch" },
] 