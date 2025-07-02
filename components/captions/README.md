# Caption Components

This directory contains the modular caption components that were extracted from the original monolithic `CaptionList.tsx` component for better maintainability and code organization.

## Component Structure

### Main Component
- **`CaptionList.tsx`** - The main orchestrating component that renders different stages based on the `workflowStage` prop

### Stage Components
- **`EmptyState.tsx`** - Displays when no captions are available
- **`SelectionStage.tsx`** - Allows users to choose their favorite caption from generated options
- **`EditingStage.tsx`** - Provides editing interface and AI improvement options
- **`ImprovingStage.tsx`** - Shows improved caption results with action buttons
- **`DoneStage.tsx`** - Displays success state when caption is saved
- **`DefaultCaptionView.tsx`** - Shows generated captions with basic editing capabilities

### Utility
- **`index.ts`** - Exports all components for easy importing

## Workflow Stages

The components handle different stages of the caption generation workflow:

1. **`initial`** → `DefaultCaptionView` (shows generated captions)
2. **`selecting`** → `SelectionStage` (choose favorite from options)
3. **`editing`** → `EditingStage` (edit caption and choose AI improvements)
4. **`improving`** → `ImprovingStage` (show improved results)
5. **`done`** → `DoneStage` (success state)

## Benefits of This Structure

- **Maintainability**: Each component has a single responsibility
- **Readability**: Smaller, focused components are easier to understand
- **Reusability**: Individual stages can be used independently if needed
- **Testing**: Each component can be tested in isolation
- **Performance**: Smaller bundle sizes and better tree-shaking

## Usage

```tsx
import { CaptionList } from "@/components/captions";

// The main component handles all workflow stages
<CaptionList
  captions={captions}
  workflowStage="editing"
  language={language}
  // ... other props
/>
```

Or import individual components:

```tsx
import { EditingStage, DoneStage } from "@/components/captions";
``` 