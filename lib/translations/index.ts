import type { Language } from "../types"
import { generalTranslations } from "./general"
import { authTranslations } from "./auth"
import { imageTranslations } from "./image"
import { captionsTranslations } from "./captions"
import { companyTranslations } from "./company"

// Combine all translations into a single object
export const translations = {
  km: {
    ...generalTranslations.km,
    ...authTranslations.km,
    ...imageTranslations.km,
    ...captionsTranslations.km,
    ...companyTranslations.km,
  },
  en: {
    ...generalTranslations.en,
    ...authTranslations.en,
    ...imageTranslations.en,
    ...captionsTranslations.en,
    ...companyTranslations.en,
  },
} as const

export const getTranslations = (language: Language) => translations[language]

// Export individual translation modules for specific use cases
export {
  generalTranslations,
  authTranslations,
  imageTranslations,
  captionsTranslations,
  companyTranslations,
} 