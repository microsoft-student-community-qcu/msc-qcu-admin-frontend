# Microsoft Fluent Design System Guidelines

This project strictly adheres to a **Microsoft Fluent UI** design language, built on top of Tailwind CSS v4, Base UI, and shadcn/ui. 

When acting as an AI assistant or writing new code/components for this project, you **MUST** follow these specific aesthetic rules to ensure consistency.

## 1. Typography
- **Primary Font Stack**: `Segoe UI Variable`, `Segoe UI`, `-apple-system`, `sans-serif`.
- Do not use `Inter` or standard default sans-serif web fonts. The font is defined globally in `styles.css`.

## 2. Spacing System (4px Ramp)
- **Do not use standard Tailwind spacing variables** (like `p-4` or `m-2`) for component layouts if possible.
- **Use the Fluent 4px Spacing Ramp** which is injected into the `@theme inline` in `styles.css`:
  - `size20` (2px)
  - `size40` (4px)
  - `size80` (8px)
  - `size120` (12px)
  - `size160` (16px)
  - `size200` (20px)
  - `size240` (24px)
  - `size320` (32px)
  - `size400` (40px)
  - `size480` (48px)
- Example usage: `className="p-size160 gap-size80"`

## 3. Elevation & Shadows
- **Do not use default Tailwind shadows** (like `shadow-sm`, `shadow-md`, `shadow-lg`).
- Use the custom Fluent Elevation tokens built into `styles.css`. These shadows dynamically adjust opacity based on the surface luminosity (Light vs. Dark mode).
- Available shadows:
  - `shadow-2`: Minimal elevation (e.g., Pressed states, very flat cards).
  - `shadow-4`: Standard cards, grid items, and list items.
  - `shadow-8`: Command bars, dropdown menus, tooltips.
  - `shadow-16`: Callouts, hover cards, popovers.
  - `shadow-28` / `shadow-64`: Modals, dialogs, large panels.

## 4. Icons
- **Strict Rule**: ONLY use `@fluentui/react-icons`.
- **NEVER** install or use `lucide-react`, `@remixicon/react`, `heroicons`, or `radix-icons`.
- Icons should generally be imported explicitly: `import { DismissRegular } from "@fluentui/react-icons"`.

## 5. Animations & Interactions
- Microsoft Fluent favors "solid" and snappy interactions.
- Avoid bouncy or squishy animations (e.g., buttons should *not* scale down or translate-y on click).
- Interactive elements focus on background-color shifts (`hover:bg-muted`) and border highlights rather than dramatic scale changes.

## 6. Components Layer
- Built using the **shadcn/ui v1** registry which utilizes **Base UI** under the hood.
- When creating new components, ensure they map to Base UI primitives appropriately.
- Ensure any `DropdownMenuLabel` or similar grouped items are strictly wrapped in a `DropdownMenuGroup` to prevent Base UI context crashes.
