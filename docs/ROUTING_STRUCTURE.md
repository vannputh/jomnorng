# Routing Structure

This document explains the new multi-page routing structure that replaced the monolithic single-page application.

## Route Overview

### Public Routes

- **`/` (Landing Page)**
  - Marketing page showcasing app features
  - Language and theme selection
  - Get Started CTA that redirects to `/auth`
  - **Component**: `LandingPage`

- **`/auth` (Authentication)**
  - Login and signup forms
  - Handles user authentication
  - Redirects to `/dashboard` after successful login
  - **Component**: `AuthPage`

### Protected Routes (Require Authentication)

- **`/dashboard` (Main Application)**
  - Core app functionality: image upload, vibe selection, caption generation
  - Company profile management via header dropdown
  - **Components**: `Header`, `ImageUpload`, `VibeSelection`, `CaptionList`, `CompanyProfileForm`

- **`/setup` (First-Time Setup)**
  - Onboarding flow for new users
  - Company profile configuration
  - Can be skipped or completed
  - Redirects to `/dashboard` after completion
  - **Component**: `FirstTimeSetup`

## Shared Functionality

### Custom Hooks

- **`useAuth()` (`hooks/use-auth.ts`)**
  - Manages authentication state across all pages
  - Provides login, logout, and user data
  - Handles automatic redirects based on auth state

- **`useCompanyProfile()` (`hooks/use-company-profile.ts`)**
  - Manages company profile data and operations
  - Handles loading, saving, and first-time setup flow
  - Shared across dashboard and setup pages

### Middleware (`middleware.ts`)

- **Route Protection**: Automatically redirects unauthenticated users from protected routes to `/auth`
- **Auth Route Guard**: Redirects authenticated users away from `/auth` to `/dashboard`
- **Server-Side**: Uses Supabase SSR for server-side auth checks

## Navigation Flow

```mermaid
graph TD
    A[/ Landing] --> B[/auth Authentication]
    B --> C{First Time User?}
    C -->|Yes| D[/setup First-Time Setup]
    C -->|No| E[/dashboard Main App]
    D --> E
    E --> F[Logout] --> A
```

## Benefits of This Structure

### 1. **Better Performance**
- **Code Splitting**: Each route only loads necessary components
- **Smaller Bundles**: Pages don't load code they don't need
- **Faster Initial Load**: Landing page loads quickly without app logic

### 2. **Improved Developer Experience**
- **Easier Navigation**: Clear separation of concerns
- **Better Debugging**: Isolated page logic
- **Simpler Testing**: Each page can be tested independently

### 3. **Enhanced Maintainability**
- **Modular Structure**: Changes to one page don't affect others
- **Clear Boundaries**: Each page has specific responsibilities
- **Scalable**: Easy to add new pages/features

### 4. **Better UX**
- **Proper URLs**: Users can bookmark specific pages
- **Browser History**: Back/forward buttons work correctly
- **SEO Friendly**: Each page can have specific meta tags

### 5. **Security**
- **Server-Side Protection**: Middleware protects routes at the server level
- **Automatic Redirects**: Users are automatically directed to appropriate pages
- **Session Management**: Consistent auth state across all pages

## File Organization

```
app/
├── page.tsx                    # Landing page (/)
├── auth/
│   └── page.tsx               # Authentication (/auth)
├── dashboard/
│   └── page.tsx               # Main application (/dashboard)
├── setup/
│   └── page.tsx               # First-time setup (/setup)
└── layout.tsx                 # Root layout

hooks/
├── use-auth.ts                # Authentication hook
├── use-company-profile.ts     # Company profile hook
└── use-toast.ts              # Toast notifications

middleware.ts                  # Route protection
```

## Migration Benefits

### Before (Monolithic `page.tsx`)
- ❌ Single 472-line file managing all views
- ❌ Complex state management with view switching
- ❌ All components loaded on initial render
- ❌ Difficult to maintain and debug
- ❌ No proper routing or URLs

### After (Multi-Route Structure)
- ✅ Separated into focused, manageable pages
- ✅ Clean Next.js routing with proper URLs
- ✅ Code splitting and performance optimization
- ✅ Reusable hooks for shared functionality
- ✅ Server-side route protection
- ✅ Easier to develop and maintain

## Adding New Routes

1. Create a new page in the appropriate directory under `app/`
2. Update `middleware.ts` if the route needs protection
3. Add navigation logic in existing components if needed
4. Update this documentation

Example:
```typescript
// app/profile/page.tsx
"use client"

import { useAuth } from "@/hooks/use-auth"
// ... rest of component
```

This structure provides a solid foundation for scaling the application while maintaining good developer experience and performance. 