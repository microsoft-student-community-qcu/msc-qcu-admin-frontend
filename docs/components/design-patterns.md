# Design Patterns & UI Standards

The admin dashboard strictly adheres to the **Microsoft Fluent Design System** wrapped around headless accessible primitives, creating a premium, native-feeling desktop web application.

## 1. The Component Stack
- **Headless Base:** We use **Radix UI** and **Base UI** for unstyled, highly accessible primitive components (Dialogs, Dropdowns, Tabs, Selects).
- **Styling Engine:** **Tailwind CSS v4** provides utility classes.
- **Component System:** **Shadcn UI** acts as the bridge. Instead of installing components as opaque NPM packages, Shadcn generates the raw source code for Radix components directly into `src/components/ui/`, allowing us to freely manipulate their internal Tailwind classes to match Fluent standards.

## 2. Microsoft Fluent Aesthetics
Instead of generic SaaS designs, we implement custom Fluent design tokens:
- **Typography:** `Segoe UI Variable` is the core font, providing native Windows readability.
- **Spacing Ramp:** Custom spacing utility variables (`p-size160`, `gap-size80`) enforce strict grid adherence.
- **Elevation:** Distinct `shadow-4`, `shadow-8`, `shadow-16` utilities map directly to the Fluent elevation ramp for modals, cards, and floating UI elements.
- **Iconography:** Strictly `@fluentui/react-icons`. We do not mix icon sets (no Lucide, no Heroicons).

## 3. Micro-Interactions & Snappiness
The UI is built to feel instantly reactive, avoiding the "web app delay":
- **Solid Transitions:** Hover states and transitions prioritize immediate, solid color swaps over slow, fading animations. Scale/translate bouncing is minimized to avoid a "cheap" bouncy feel.
- **Skeleton Loaders:** During initial data fetches, the UI renders structural skeleton frames (`Skeleton` component from Shadcn) that exactly mirror the layout of the impending data. This prevents layout shift.
- **`keepPreviousData` Pagination:** When switching tabs or paginating through a table, TanStack Query is configured to hold the old data on screen while the new data fetches in the background, entirely eliminating the flash of a skeleton loader during navigation.
