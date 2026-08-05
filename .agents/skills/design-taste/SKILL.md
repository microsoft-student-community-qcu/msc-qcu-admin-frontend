---
name: design-taste
description: Use when building, styling, or refining user interfaces. Enforces a premium look-and-feel (anti-slop), Microsoft Fluent UI design principles, crisp layout hierarchy, dark/light compatibility, and micro-interactions.
---

# Design Taste & Anti-Slop Guidelines (Fluent UI Edition)

Principles and checklists for crafting high-fidelity, premium user interfaces that feel native to the Microsoft Fluent Design System.

## 🎯 Aesthetic Pillars

1.  **Refined Typography**:
    *   ONLY use `Segoe UI Variable` (with options like `Segoe UI Variable Display` for large headers, `Segoe UI Variable Text` for body, and `Segoe UI Variable Small` for metadata).
    *   Strictly adhere to letter-spacing and font-weights: headers should be semibold or bold with tight tracking (`tracking-tight`), body text should be regular/normal, and uppercase labels should be rare.
2.  **Harmonious Color Palettes**:
    *   Avoid raw primaries. Use the CSS variables defined in `src/styles.css` (e.g. `var(--color-primary)`, `var(--color-accent-subtle)`, `var(--color-background-hover)`).
    *   Calibrate contrasts for both Light and Dark modes. Text color must contrast strongly against card backgrounds.
3.  **Depth & Elevation (z-axis)**:
    *   Use shadow-based layers to establish visual hierarchy.
    *   *Flat Page Canvas* (`bg-background`) → *Subtle Cards* (`bg-card`, `shadow-4`, border-border) → *Dropdowns & Floating Flyouts* (`bg-popover`, `shadow-8`) → *Modals & Overlays* (`shadow-28` or `shadow-64` + backdrop blur).
4.  **Crisp Layout & Alignment**:
    *   Never mix layout spacing. Maintain a rigid grid using the Fluent Spacing Ramp (`size20` to `size480`).
    *   Align all interactive elements, icons, and text fields perfectly. Use `items-center` for flex rows and ensure consistent text baselines.

---

## 🚫 What is AI Visual Slop? (Avoid these tropes!)

| Feature | ❌ AI Visual Slop | ✅ Premium Fluent Design |
|---|---|---|
| **Typography** | Generic `Inter` everywhere with generic font-weights. | `Segoe UI Variable` with semantic weights (Semibold/Regular). |
| **Gradients** | Shiny purple-to-blue gradients on every card and button. | Solid colors or highly restricted, soft brand gradients. |
| **Shadows** | Thick, blurry black shadows (`shadow-lg`). | Light, dynamic, luminosity-adjusted shadows (`shadow-4`, `shadow-8`). |
| **Borders** | Bold, high-contrast borders or no borders at all. | Extremely thin, subtle, semi-transparent borders (`border-border`). |
| **Interaction** | Buttons scale down on click; cards lift up heavily on hover. | Snappy transitions, background color changes, thin ring outlines. |
| **Rounding** | Extreme rounding (`rounded-3xl` or `rounded-2xl` on tiny buttons). | Intentional rounding (`rounded-md` on buttons/inputs, `rounded-lg` on cards). |

---

## 📋 Premium UI Craft Checklist

Whenever building or editing a UI component, review these items before completion:

- [ ] **Dark Mode Integrity**: Switch between light and dark mode to verify contrast. Ensure text remains readable and icons don't disappear.
- [ ] **Disabled States**: Check buttons, inputs, and selects. Disabled states should look inert (`opacity-50`, `pointer-events-none`, grayed-out background).
- [ ] **Hover/Focus Indicators**: Every clickable element must have a clear hover state (e.g., `hover:bg-accent/10` or a border highlight) and an focus outline for accessibility (`focus-visible:ring-2`).
- [ ] **Backdrop Blurs**: Modals, drawer overlays, and floating headers must use a translucent background with blur (`bg-background/85 backdrop-blur-md`) to feel premium and layered.
- [ ] **Icon Integration**: Ensure icons are proportional to the text. For example, a 16px/20px icon (`className="w-5 h-5"`) aligns perfectly with standard text. Use `@fluentui/react-icons`.
- [ ] **Data Density**: Admin dashboards must support data-heavy density. Don't use overly massive paddings. Use compact paddings (e.g., `p-size80` or `p-size120`) for lists, tables, and panels to fit more critical data.
- [ ] **Loading & Empty States**: Every dynamic container must have an elegant empty/skeletal state to avoid page-popping. Use skeletal UI instead of simple "Loading..." text.

---

## 💡 Example: Premium Table Component

```typescript
import React from 'react';
import { MoreHorizontalRegular, ArrowSortUpRegular } from '@fluentui/react-icons';

export const PremiumTable = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="p-size120">
                <button className="flex items-center gap-size40 hover:text-foreground cursor-pointer font-semibold">
                  <span>Name</span>
                  <ArrowSortUpRegular className="w-4 h-4" />
                </button>
              </th>
              <th className="p-size120">Role</th>
              <th className="p-size120 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            <tr className="hover:bg-muted/40 transition-colors">
              <td className="p-size120 font-medium">Darren Vance</td>
              <td className="p-size120 text-muted-foreground">Admin (HR)</td>
              <td className="p-size120 text-right">
                <button className="p-size40 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
                  <MoreHorizontalRegular className="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
```
