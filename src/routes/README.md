# Routing & Pages Reference

This directory contains the file-based route definitions for the QCU MSC Admin Portal, powered by **TanStack Router**.

---

## 🚀 Router Architecture

We employ TanStack Router's flat file-based routing system. Routes are automatically generated based on the file names in this directory:

- Files prefixing with an underscore (e.g., `_admin.tsx`) represent **layout routes** (non-path routes) that wrap child routes with shared layouts (e.g., sidebar, header, global auth guards).
- Parent-child hierarchies are resolved using dots (e.g., `_admin.events.list.tsx` renders at `/events/list` wrapped in the `_admin` layout).
- `__root.tsx` serves as the global root layout wrapping all routes with global providers and styles.

---

## 📂 Route Directory Map

Below is a breakdown of the active routes and their respective purposes:

### 1. Root & Shells
* [__root.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/__root.tsx)
  * The global root component containing the routing outlet, DevTools, and basic global error boundaries.
* [_admin.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.tsx)
  * The **Admin Layout Shell**. Authenticates core users, sets up the [Sidebar Provider](file:///e:/Github/msc-qcu-admin-frontend/src/components/ui/sidebar.tsx), and wraps children with the [AdminLayout](file:///e:/Github/msc-qcu-admin-frontend/src/components/shared/admin-layout.tsx) containing the sidebar and header.

### 2. Authentication
* [login.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/login.tsx) (Route: `/login`)
  * Gateway login screen for Core Team executives (Admins). Directs users to appropriate workspaces based on their assigned role upon successful authentication.

### 3. Admin Dashboards & Management
* [_admin.dashboard.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.dashboard.tsx) (Route: `/dashboard`)
  * Overview panel for administrative metrics. Displays application growth curves, department member distribution charts, recent notifications, and summary cards.
* [_admin.applications.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.applications.tsx) (Route: `/applications`)
  * **HR & Recruitment Pipeline**. Displays candidate tables, sortable grids, status mutators, and the manual Zonal OCR override queue for flagged applicant IDs.
* [_admin.events.list.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.events.list.tsx) (Route: `/events/list`)
  * **Event Operations Control**. Main dashboard list view for orchestrating community meetups, workshops, and general assemblies.

### 4. Utilities & Assets
* [notifications.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/notifications.tsx) (Route: `/notifications`)
  * Shared dashboard notification logs and inbox feed for general alerts.
* [design-system.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/design-system.tsx) (Route: `/design-system`)
  * Developer utility showing the design token colors, typography, UI components, inputs, buttons, and alert components. Used to test visual styling.

---

## 🛠️ Code Conventions & Best Practices

1. **Imports:** Ensure new route definitions import from `@tanstack/react-router` and use `createFileRoute`.
2. **Layout wrappers:** Do not redefine sidebars or layouts in child routes. Place routes within the `_admin` prefix to inherit the sidebar layout automatically.
3. **Data Loading:** Keep routing component trees clean. Outsource complex helper logic or mock datasets to `src/mocks/` or component level utilities.