# Component Guidelines & Design System

This document outlines the architectural conventions, structure, and design constraints for creating and maintaining UI components within the QCU MSC Admin Portal.

---

## 📂 Component Directory Structure

Components are split into two directories based on their scope and reusability:

### 1. Atomic UI Primitives (`src/components/ui/`)
* **Purpose**: Low-level, reusable building blocks (e.g., [Button](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/button.tsx), [Card](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/card.tsx), [Dialog](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/dialog.tsx), [Sheet](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/sheet.tsx)).
* **Implementation**: Built on top of **Base UI** primitives and customized using Tailwind CSS v4 styling. They strictly map design system variables onto native DOM structures.
* **Modification Guidelines**: Only edit primitives when adjusting global design systems (e.g. updating modal backdrop transparency or default line-heights).

### 2. Shared Layout Elements (`src/components/shared/`)
* **Purpose**: Composition-heavy, non-primitive layouts used across pages (e.g., [AdminLayout](file:///e:/Github/msc-qcu-admin-frontend/src/components/shared/admin-layout.tsx), [Header](file:///e:/Github/msc-qcu-admin-frontend/src/components/shared/header.tsx), [Sidebar](file:///e:/Github/msc-qcu-admin-frontend/src/components/shared/sidebar.tsx)).
* **Implementation**: Wraps primitives, binds routing context, and handles structural grid layouts.

---

## 🎨 Microsoft Fluent UI Integration

All components must adhere strictly to the **Microsoft Fluent UI Design Language** configurations defined in the codebase:

### 1. Typography & Readability
* **Font Stack**: Must strictly use `Segoe UI Variable`, `Segoe UI`, `-apple-system`, `sans-serif`. (Avoid standard `Inter` or browser defaults).
* **Line-heights**: For heading titles (such as names or key metrics), use `leading-none` or `leading-tight` to ensure text aligns correctly with top-aligned elements (like profile images) without adding trailing vertical spacing.

### 2. Fluent 4px Spacing Ramp
* Do **NOT** use standard tailwind classes (e.g. `p-4`, `m-2`, `gap-3`) for structural container margins and paddings.
* Instead, use the custom Fluent spacing tokens:
  * `size20` (2px)
  * `size40` (4px)
  * `size60` (6px)
  * `size80` (8px)
  * `size100` (10px)
  * `size120` (12px)
  * `size160` (16px)
  * `size200` (20px)
  * `size240` (24px)
  * `size320` (32px)
  * `size400` (40px)
  * `size480` (48px)
* **Example**: `<div className="p-size160 gap-size80">`

### 3. Shadows & Elevation Tokens
* Do **NOT** use default Tailwind shadows (e.g. `shadow-sm`, `shadow-lg`).
* Use the following Fluent custom elevation tokens:
  * `shadow-2`: Minimal elevation (Pressed states, flat list cards).
  * `shadow-4`: Standard interactive page cards and directory blocks.
  * `shadow-8`: Command bars, dropdowns, and tooltips.
  * `shadow-16`: Popovers, hover cards, flyouts.
  * `shadow-28` / `shadow-64`: Modals, dialog dialogs, and navigation panels.

### 4. Iconography
* **Strict Rule**: Only import icons from `@fluentui/react-icons` (e.g., `MailRegular`, `SearchRegular`).
* Do **NOT** install or reference `lucide-react`, `heroicons`, or `radix-icons`.

---

## ⚙️ Specific Component Standards

### 🛡️ Popups, Modals & Side Sheets (Overlay Rules)
* Modals, sheets, and dialogs must **NOT** have background blurs.
* Overlays must use a simple backdrop configuration using a subtle `bg-black/15` tint to preserve readability.
* **Reference**: Check the overlay configurations in [dialog.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/dialog.tsx), [sheet.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/sheet.tsx), and [alert-dialog.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/alert-dialog.tsx).

### 🎴 Cards & Grid Structures
* When creating card footers, ensure you add the semantic attribute `data-slot="card-footer"`. This correctly signals the card container wrapper to remove default bottom padding, centering footer actions within the layout.
* **Example**:
  ```tsx
  <Card>
    <CardContent>...</CardContent>
    <div data-slot="card-footer" className="p-size120 bg-muted/10">
      {/* Centered Actions */}
    </div>
  </Card>
  ```

---

## 🛠️ Testing & Verification
* Run `npm run build` after editing component primitives to check if TypeScript compilation passes.
* Visually check component states on both Light Mode and Dark Mode inside the local dev server.