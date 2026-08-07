---
name: feature-architect
description: Use when creating new files, moving files, or deciding where to place new components, hooks, or logic
---
# Feature Architect & Architecture Guardian

This skill turns the agent into a rigid architectural guardian. Its purpose is to enforce the Feature-Based File Structure (also known as Feature-Sliced Design or Domain-Driven Design) and prevent files from being dumped indiscriminately into global folders.

## The Prime Directive
**NEVER put code in global folders if it belongs to a specific feature domain.**

Global folders include:
- `src/services/`
- `src/types/`
- `src/hooks/`
- `src/components/shared/`

Feature folders include:
- `src/features/[domain]/` (e.g., `hr/`, `logistics/`)

## 1. File Routing Decision Tree
When deciding where to place a new file, you MUST follow this exact evaluation:

1. **Is the logic used by MULTIPLE distinct feature domains? (e.g., both HR and Logistics use it)?**
   - **YES:** Route to the appropriate global folder (`src/services`, `src/types`, `src/hooks`).
2. **Is it a purely visual, primitive UI component with NO business logic?**
   - **YES:** Route to `src/components/ui/` (if it's a Shadcn/BaseUI primitive) or `src/components/shared/` (if it's a layout/generic wrapper).
3. **Is it specific to ONE feature domain (e.g., only HR uses this)?**
   - **YES:** It MUST be placed inside `src/features/[domain]/...`.
   - APIs go in `src/features/[domain]/shared/services/`
   - Types go in `src/features/[domain]/shared/types/`
   - Hooks go in `src/features/[domain]/shared/hooks/`
   - Components go in `src/features/[domain]/[sub-feature]/components/`

## 2. Maintainability & Clump-Prevention Checklist
Before saving a component or module, verify:
- [ ] **No UI Clumping:** Business logic, API fetches, and UI rendering are NOT all stuffed into a single massive `*.tsx` file.
- [ ] **Extracted State:** Complex state and data fetching must be extracted into a custom hook (e.g., `use[Feature].ts`).
- [ ] **Separated Types:** Complex TypeScript interfaces are in a dedicated `.ts` types file, not inline above the React component.

*If you violate these rules, the workspace architecture degrades. Always build modularly.*

## Common Rationalizations & Reality

| Excuse | Reality |
|--------|---------|
| "It's just a small helper function, I'll put it in `src/utils`" | If it's only used by HR, it goes in `src/features/hr/shared/utils/`. No exceptions. |
| "I don't know what feature this belongs to yet" | Figure it out before writing the file. Ask for clarification if needed. |
| "The component is too big, but splitting it is tedious" | UI Clumping makes code unmaintainable. Extract logic to hooks and sub-components. |

## Red Flags - STOP and Relocate

- Creating a file in `src/hooks/` that has the word "Applicant" or "Event" in it (these are domain-specific).
- A `.tsx` file that exceeds 150 lines and contains both `useQuery` and multiple inline `<div className="...">` structures.
- Exporting a type from `src/types/` that is only imported by one feature.

**All of these mean: Stop. Move the file or refactor the component to follow the Domain-Driven Design.**
