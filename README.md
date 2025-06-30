# Jomnorng PWA - AI-Powered Social Media Caption Generator

A modern progressive web app for generating AI-powered social media captions in Khmer and English, built with Next.js 15, TypeScript, and Supabase.

## 🏗️ Architecture

### Multi-Route Structure

The application has been refactored from a monolithic single-page design into a modern multi-route architecture:

- **`/`** - Landing page with marketing content
- **`/auth`** - Authentication (login/signup)
- **`/dashboard`** - Main application interface
- **`/setup`** - First-time user onboarding

### Key Features

- ✅ **AI-Powered Captions**: Generate engaging social media captions using AI
- ✅ **Bilingual Support**: Full support for Khmer (ខ្មែរ) and English
- ✅ **Company Profiles**: Customizable business profiles for better caption generation
- ✅ **Image Analysis**: Upload images for context-aware caption generation
- ✅ **Vibe Selection**: Choose from different tones and styles
- ✅ **Progressive Web App**: Installable and works offline
- ✅ **Modern UI**: Beautiful, responsive design with dark/light themes

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Google AI (Gemini)
- **State Management**: React Hooks + Custom Hooks
- **Icons**: Lucide React

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page (/)
│   ├── auth/
│   │   └── page.tsx            # Authentication (/auth)
│   ├── dashboard/
│   │   └── page.tsx            # Main app (/dashboard)
│   ├── setup/
│   │   └── page.tsx            # First-time setup (/setup)
│   ├── api/
│   │   └── analyze-image/      # AI caption generation API
│   └── layout.tsx              # Root layout
├── components/
│   ├── auth/                   # Authentication components
│   ├── captions/               # Caption-related components
│   ├── company/                # Company profile components
│   ├── image/                  # Image upload & processing
│   ├── landing/                # Landing page components
│   ├── layout/                 # Layout components
│   └── ui/                     # Reusable UI components
├── hooks/
│   ├── use-auth.ts            # Authentication hook
│   ├── use-company-profile.ts  # Company profile management
│   └── use-toast.ts           # Toast notifications
├── lib/
│   ├── types/                  # TypeScript type definitions
│   ├── translations/           # Organized translations by feature
│   ├── constants/              # App constants and configurations
│   ├── supabase.ts            # Supabase client configuration
│   └── utils.ts               # Utility functions
├── middleware.ts               # Route protection and auth middleware
└── docs/
    └── ROUTING_STRUCTURE.md   # Detailed routing documentation
```

## 🔧 Setup & Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎯 Recent Improvements

### Routing Refactoring (Latest)

- **Before**: Single 472-line monolithic page managing all views
- **After**: Clean separation into focused route pages
- **Benefits**:
  - Better performance with code splitting
  - Easier development and maintenance
  - Proper URLs and browser history
  - Server-side route protection
  - Improved scalability

### Translation Organization

- **Before**: Single large translations file
- **After**: Organized by feature area (`general.ts`, `auth.ts`, `image.ts`, etc.)
- **Benefits**:
  - Easier to find and edit translations
  - Better maintainability
  - Scalable for new features

### Component Architecture

- **Modular Design**: Well-organized component hierarchy
- **Type Safety**: Comprehensive TypeScript interfaces
- **Reusable Hooks**: Shared logic across components
- **Performance**: Optimized with proper React patterns

## 📚 Documentation

- [Routing Structure](docs/ROUTING_STRUCTURE.md) - Detailed routing documentation
- [Component Structure](COMPONENT_STRUCTURE.md) - Component organization guide
- [Translation Structure](lib/translations/README.md) - Translation management guide

## 🔐 Security Features

- **Server-side Route Protection**: Middleware-based authentication
- **Type-safe API**: Full TypeScript coverage
- **Secure Authentication**: Supabase Auth with email verification
- **Environment Protection**: Secure environment variable handling

## 🌍 Internationalization

Full bilingual support with organized translation files:
- **Khmer (ខ្មែរ)**: Native language support
- **English**: International accessibility
- **Extensible**: Easy to add new languages

## 🚢 Deployment

The app is optimized for deployment on Vercel, Netlify, or any platform supporting Next.js:

```bash
# Build for production
pnpm build

# The app will be generated in the `.next` folder
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Khmer-speaking community and beyond**