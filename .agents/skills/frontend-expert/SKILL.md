---
name: frontend-expert
description: Use when creating React/TypeScript components, pages, or features. For modern patterns including Suspense, useSuspenseQuery, lazy loading, Tailwind CSS v4, Microsoft Fluent design tokens, TanStack Router, and performance optimization.
---

# Frontend Expert (Tailwind CSS v4 & Fluent UI Edition)

Modern React/TypeScript development patterns for high-performance, premium applications in this workspace.

## 🎯 Overview

This skill provides comprehensive guidelines for building production-grade React applications with:
- **Suspense-first architecture** - No loading spinners, no early returns
- **Type-safe patterns** - Strict TypeScript, no `any` types, Zod validation
- **Performance by default** - Lazy loading, memoization, cache strategies
- **Fluent UI & Tailwind v4** - Adherence to Fluent elevation, typography, and spacing ramps
- **Organized structure** - Feature-based directory organization

## 📋 Quick Start: Component Checklist

```markdown
- [ ] Use `React.FC<Props>` pattern with TypeScript
- [ ] Lazy load if heavy component: `React.lazy(() => import())`
- [ ] Wrap in `<Suspense>` for loading states
- [ ] Use `useSuspenseQuery` for data fetching (via TanStack Query)
- [ ] Import aliases: `@/`, `~types`, `~components`, `~features`
- [ ] Spacing: ONLY use Fluent spacing ramp (e.g. `p-size160`, `gap-size80`)
- [ ] Elevation: ONLY use Fluent shadow classes (e.g. `shadow-4`, `shadow-8`)
- [ ] Icons: ONLY use `@fluentui/react-icons` (no lucide, radix, or heroicons)
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Use `sonner` (toast) for user notifications (no custom toast alerts)
- [ ] Default export at bottom
- [ ] No early returns with loading spinners
```

## 📋 Quick Start: Feature Checklist

```markdown
- [ ] Create `src/features/{feature-name}/` directory
- [ ] Create subdirectories: `components/`, `hooks/`, `helpers/`, `types/`
- [ ] Set up TypeScript types in `types/`
- [ ] Create route in `src/routes/` using TanStack Router
- [ ] Lazy load feature components
- [ ] Use Suspense boundaries
- [ ] Export public API from feature `index.ts`
```

---

## 🧩 Import Aliases

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | `src/` | `import { cn } from '@/lib/utils'` |
| `~types` | `src/types` | `import type { User } from '~types/user'` |
| `~components` | `src/components` | `import { Sidebar } from '~components/shared/sidebar'` |
| `~features` | `src/features` | `import { authApi } from '~features/auth'` |

---

## 🚫 Critical Rules

### No Early Returns for Loading

```typescript
// ❌ NEVER - Causes layout shift and looks unpolished
if (isLoading) {
    return <div className="spinner">Loading...</div>;
}

// ✅ ALWAYS - Wrap in Suspense at the parent level or use skeletal fallbacks
<Suspense fallback={<SkeletonLoader />}>
    <Content />
</Suspense>
```

### Fluent UI & Tailwind v4 Custom Tokens

Always reference the design guidelines in [design.md](file:///e:/Github/msc-qcu-admin-frontend/design.md):

```typescript
// ❌ NEVER use standard tailwind classes
className="p-4 gap-2 shadow-md rounded-md"

// ✅ ALWAYS use Fluent tokens
className="p-size160 gap-size80 shadow-4 rounded-md"
```

### Base UI Context Safety

```typescript
// ❌ NEVER mix bare menu items in Radix/Base UI dropdowns
<DropdownMenuContent>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Logout</DropdownMenuItem>
</DropdownMenuContent>

// ✅ ALWAYS wrap in DropdownMenuGroup to prevent context crashes
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

---

## 📂 Topic Guides

### Component Patterns
- `React.FC<Props>` for type safety
- `React.lazy()` for code splitting
- Named const + default export pattern
- **[📖 Full Guide: design.md](file:///e:/Github/msc-qcu-admin-frontend/design.md)**

### Data Fetching
- `useSuspenseQuery` as primary pattern
- Query keys structured logically
- Bridge to API client in `src/services/`
- **[📖 Full Guide: objective.md](file:///e:/Github/msc-qcu-admin-frontend/.agents/rules/objective.md)**

### Styling
- Tailwind CSS v4 config-driven values
- Strict adherence to spacing, typography, shadow, and transition tokens
- **[📖 Full Guide: design.md](file:///e:/Github/msc-qcu-admin-frontend/design.md)**

---

## 🔧 Modern Component Template

```typescript
import React, { useState, useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRightRegular } from '@fluentui/react-icons';
import { toast } from 'sonner';

interface MyComponentProps {
    id: string;
    onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ id, onAction }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    // Primary data fetching
    const { data } = useSuspenseQuery({
        queryKey: ['item', id],
        queryFn: async () => {
            const res = await fetch(`/api/v1/items/${id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
    });

    const handleAction = useCallback(() => {
        setIsActive(true);
        toast.success("Action processed successfully!");
        onAction?.();
    }, [onAction]);

    return (
        <div className="p-size160 bg-card shadow-4 rounded-lg flex flex-col gap-size80 border border-border">
            <h3 className="text-xl font-semibold font-sans tracking-tight text-foreground">
                {data.name}
            </h3>
            <p className="text-sm text-muted-foreground">
                {data.description}
            </p>
            <button
                onClick={handleAction}
                className="flex items-center justify-center gap-size40 bg-primary text-primary-foreground p-size80 rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
                <span>Proceed</span>
                <ArrowRightRegular className="w-5 h-5" />
            </button>
        </div>
    );
};

export default MyComponent;
```
