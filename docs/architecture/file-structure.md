# Architecture & File Structure

The QCU MSC Admin Frontend is built using a strict **Feature-Based File Structure** (also known as Domain-Driven Design or Feature-Sliced Design). This approach maximizes maintainability by strictly compartmentalizing logic into isolated domains.

## The Prime Directive
**NEVER put code in global folders if it belongs to a specific feature domain.**

### Global Folders (Cross-Domain Only)
Global folders are reserved strictly for logic, types, and services that cut across *multiple* distinct feature domains (e.g., both the HR feature and the Logistics feature require it).

- `src/services/` - Core API clients (e.g., Axios base instance with interceptors).
- `src/types/` - Global TypeScript models (e.g., `ApiResponse<T>`, base User models).
- `src/hooks/` - Global utility hooks (e.g., `useIntersectionObserver`).
- `src/components/shared/` - Generic layout components (Sidebars, Headers) that are agnostic to business logic.
- `src/components/ui/` - Pure, primitive UI components (Shadcn UI wrappers for Radix).

### Feature Folders (Domain-Specific)
All business logic, components, APIs, and types that belong to a single domain must be encapsulated within `src/features/[domain]/`.

Example Structure for the HR Domain:
```
src/features/hr/
├── shared/
│   ├── hooks/       # e.g., useApplicant.ts, usePaginatedApplicants.ts
│   ├── services/    # e.g., applicantApi.ts (Axios calls specific to HR)
│   ├── types/       # e.g., Applicant interfaces and Zod schemas
│   └── utils/       # HR-specific formatters
├── applicants/
│   ├── components/  # e.g., ApplicantDetails.tsx, StatusConfirmDialog.tsx
│   └── schemas/     # Zod validation for applicant forms
└── members/
    └── components/  # e.g., MemberDirectory.tsx, MemberProfileSheet.tsx
```

## Component Guidelines
To prevent "Component Clumping," strictly separate concerns:
1. **Forms & Validation:** Move Zod schemas to `schemas/`.
2. **Business Logic & API:** Extract data fetching and complex state into custom hooks in `hooks/`.
3. **UI Rendering:** Keep `.tsx` files strictly focused on mapping state to visual DOM elements.
