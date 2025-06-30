# Translations Structure

This directory contains all the application translations organized by feature/component area for easier editing and maintenance.

## File Organization

### `/lib/translations/`

- **`general.ts`** - App-level translations (title, features, navigation, themes)
- **`auth.ts`** - Authentication related translations (login, signup, profile)
- **`image.ts`** - Image upload and vibe selection translations
- **`captions.ts`** - Caption generation and management translations
- **`company.ts`** - Company profile and business information translations
- **`index.ts`** - Main exports file that combines all translations

## How to Use

### Import All Translations
```typescript
import { getTranslations } from "@/lib/translations"

const t = getTranslations(language)
console.log(t.login) // "Login" or "ចូលគណនី"
```

### Import Specific Translation Modules
```typescript
import { authTranslations } from "@/lib/translations"

const authText = authTranslations[language]
console.log(authText.login) // "Login" or "ចូលគណនី"
```

## Adding New Translations

### 1. Choose the Right File
- **General app features** → `general.ts`
- **Authentication/user management** → `auth.ts`
- **Image upload/processing** → `image.ts`
- **Caption features** → `captions.ts`
- **Company/business features** → `company.ts`

### 2. Add to Both Languages
Always add translations for both `km` (Khmer) and `en` (English):

```typescript
// In the appropriate file, e.g., auth.ts
export const authTranslations = {
  km: {
    // ... existing translations
    newFeature: "ថ្មី", // Add Khmer translation
  },
  en: {
    // ... existing translations
    newFeature: "New", // Add English translation
  },
} as const
```

### 3. If Creating a New Category
1. Create a new file (e.g., `notifications.ts`)
2. Follow the same structure as existing files
3. Export the translations object
4. Add the import and spread in `index.ts`:

```typescript
// In index.ts
import { notificationsTranslations } from "./notifications"

export const translations = {
  km: {
    // ... existing spreads
    ...notificationsTranslations.km,
  },
  en: {
    // ... existing spreads
    ...notificationsTranslations.en,
  },
} as const

// Export the new module
export { notificationsTranslations }
```

## Benefits

- **Easy to find**: Translations are grouped by feature
- **Maintainable**: Smaller files are easier to edit
- **Scalable**: New features can have their own translation files
- **Type-safe**: Full TypeScript support with autocompletion
- **Flexible**: Can import all translations or just specific modules

## Language Support

Currently supports:
- **km** - Khmer (ខ្មែរ)
- **en** - English

To add a new language, add it to the `Language` type in `lib/types/index.ts` and add corresponding entries in all translation files. 