# Project Rules (for Agents & Developers)

Engineering standards for all contributors — both human and automated.

---

## Global Workspace Guidelines

These guidelines apply to the entire workspace.

### Repository Objective

See [objective.md](file:///e:/Github/msc-qcu-admin-frontend/.agents/rules/objective.md) for the primary objective of this repository.

---

## Code Style

- Always add comments for non-trivial logic.
- Keep components and functions small, focused, and reusable.
- Prefer readability over clever or overly compact code.
- Follow existing project structure and naming conventions.
- Avoid duplicating logic; extract reusable utilities or hooks instead.
- Always check global shared directories (`src/services/`, `src/store/`, `src/types/`, `src/utils/`, and `src/hooks/`) for existing logic, state, hooks, or types before creating feature-specific implementations.
- TypeScript throughout; Zod schemas for all client-side validation and forms.
- All Zod schemas must use custom human-readable error messages via `{ message: "..." }`. Generic Zod internals must never reach the user interface.

## Architecture & File Organization

### Project Structure

```
msc-qcu-admin-frontend/
├── .agents/
│   ├── rules/
│   │   └── objective.md        # Repository objectives & folder details
│   └── AGENTS.md               # Active rules file
├── docs/                       # Documentation (architecture, api-integration, components, features)
├── public/                     # Public assets
├── src/
│   ├── assets/                 # Static assets (images, fonts, global CSS)
│   ├── components/
│   │   ├── ui/                 # Pure, primitive UI components (Shadcn/Radix/Base UI)
│   │   └── shared/             # Reusable non-primitive components (Layouts, Sidebar, etc.)
│   ├── features/               # Feature-driven vertical slices
│   │   ├── auth/               # Admin auth & role-based checks
│   │   ├── hr/                 # HR & Recruitment pipeline features
│   │   └── logistics/          # Event logistics features
│   ├── hooks/                  # Global custom React hooks
│   ├── lib/                    # Third-party configs/initializations (axios, queryClient)
│   ├── routes/                 # TanStack Router file-based route definitions
│   ├── services/               # API client calls (bridges frontend to backend via TanStack Query)
│   ├── store/                  # Global state management (Zustand)
│   ├── types/                  # Global TypeScript definitions
│   ├── utils/                  # Shared helper functions
│   ├── main.tsx                # Entry point
│   ├── routeTree.gen.ts        # Auto-generated TanStack Router tree
│   ├── router.tsx              # Router initialization
│   └── styles.css              # Global styles (Tailwind CSS v4 & Fluent Design tokens)
├── design.md                   # Microsoft Fluent Design System Guidelines
├── tsconfig.json
└── package.json
```

### Code Structure Rules

- Never allow a single file/component to become too large or hard to navigate.
- Split large components into smaller sub-components (placed in the same folder or in `src/components/shared/`).
- Feature-specific logic, components, or hooks must be kept inside their respective subfolder in `src/features/` and NOT in global shared folders.
- Route files go in `src/routes/` and follow TanStack Router conventions.

## Microsoft Fluent Design System

Strictly adhere to the design guidelines in [design.md](file:///e:/Github/msc-qcu-admin-frontend/design.md):
- **Typography**: Use only Fluent-approved fonts (e.g., `Segoe UI Variable`).
- **Spacing**: Use the custom Fluent Spacing Ramp (`p-size160`, `gap-size80`, etc.) instead of standard Tailwind spacing values.
- **Elevation**: Use custom shadow classes (`shadow-4`, `shadow-8`, etc.) rather than default Tailwind shadows.
- **Icons**: ONLY use `@fluentui/react-icons`. Never use Lucide or Radix icons.
- **Animations**: Prefer snappy and solid interactions over bouncy scale/translate effects.
- **Base UI / Shadcn**: Wrap grouped dropdown menu items in `DropdownMenuGroup` to prevent Base UI context crashes.

## Git Rules

- Use meaningful and descriptive commit messages (conventional commits).
- Do not commit undocumented breaking changes.
- Keep commits focused on a single logical change.
