# QCU MSC Admin Frontend - Master Documentation

Welcome to the internal documentation for the QCU MSC Admin Frontend repository. This folder contains all architectural specifications, design guidelines, and feature implementations for the administration portal.

> **Note on Project Scope:** This repository (`msc-qcu-admin-frontend`) is strictly the secure, internal admin environment. All public-facing features (Landing Page, Student Registration, Ticketing) are handled in a separate repository (`qcu-msc-central-portal-frontend`). Both frontends interact with a shared backend (`qcu-msc-central-portal-backend`).

---

## 1. Architecture & Core Systems

Start here to understand how files are structured and how state is managed globally across the application.

* **[File Structure & Domain-Driven Design](architecture/file-structure.md)**: Rules on file placement, domain slices inside `src/features/`, and shared services.
* **[State Management](architecture/state-management.md)**: How state is divided between Local UI (`useState`), Global UI (`useFilterStore`), Authoritative Auth (`useAuthStore`), and Server State (TanStack Query).

## 2. UI & Design System

Guidelines on styling components and maintaining Microsoft Fluent Design standards.

* **[Design Patterns & UI Standards](components/design-patterns.md)**: Microsoft Fluent Design integration, typography standards, elevation shadows, and Base UI component wrappers.
* **[Caching & Optimistic UI Strategy](api-integration/caching-and-optimistic-ui.md)**: TanStack Query cache invalidation, background polling, and optimistic UI mutations.

## 3. Feature Implementations

Detailed, component-level breakdowns of all active domains built into the dashboard.

* **[Super Admin Settings Hub](features/superadmin-hub.md)**: 9-role RBAC authorization matrix, authoritative session hydration, global system switches, and HMAC-SHA256 chained audit logs.
* **[Event Logistics & Attendance Desk](features/events-logistics.md)**: Event scheduling, cover photo cards, pre-event attendee administration, and on-site door check-in desk.
* **[Authentication & Password Reset](features/auth.md)**: Sign-in state machine, Zod schemas, self-service password reset, and Framer Motion transitions.
* **[HR & Recruitment Pipeline](features/hr-pipeline.md)**: Applicant registry, optimistic status mutations, and Manual ID Verification review process.
* **[Members Directory](features/members-directory.md)**: Active roster grid, infinite scrolling, and slide-out profile sheets.

---

## 4. Agent Workflows & Project Rules

Adhere to the rules defined in `.agents/AGENTS.md`:

* **Strict Emoji Policy:** NO EMOJIS in code, comments, documentation, commit messages, or chat responses.
* **Backend Issue Reporting:** All backend dependencies and schema additions must be documented in `issues/`.
* **Architecture Enforcement:** New files must follow domain separation of concerns.
