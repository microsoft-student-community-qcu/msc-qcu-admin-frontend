# QCU MSC Admin Frontend - Master Documentation

Welcome to the internal documentation for the QCU MSC Admin Frontend repository. This folder contains all architectural specifications, design guidelines, and feature implementations for the administration portal.

> **Note on Project Scope:** This repository (`msc-qcu-admin-frontend`) is strictly the secure, internal admin environment. All public-facing features (Landing Page, Student Registration, Ticketing) are handled in a separate repository (`qcu-msc-central-portal-frontend`). Both frontends interact with a shared backend (`qcu-msc-central-portal-backend`).

---

## 🏗️ 1. Architecture & Core Systems
Start here to understand how files are structured and how state is managed globally across the application.

- **[File Structure & Domain-Driven Design](architecture/file-structure.md)**: Strict rules on where to place files, what belongs in `src/features/`, and when to use global `src/services/`.
- **[State Management](architecture/state-management.md)**: How we divide state between Local UI (React `useState`), Global UI (Zustand `useFilterStore`), and Server State (TanStack Query).

## 🎨 2. UI & Design System
Guidelines on how to style components and enforce the premium application feel.

- **[Design Patterns & UI Standards](components/design-patterns.md)**: Microsoft Fluent Design integration, typography standards, elevation shadows, and Shadcn component structure.
- **[Caching & Optimistic UI Strategy](api-integration/caching-and-optimistic-ui.md)**: How we configure TanStack Query to instantly mutate the UI, prevent layout shifting, and handle background polling.

## ⚙️ 3. Feature Implementations
Detailed, component-level breakdowns of the active domains currently built into the dashboard.

- **[HR & Recruitment Pipeline](features/hr-pipeline.md)**: The applicant registry, optimistic status mutations, and the Manual ID Verification review process.
- **[Members Directory](features/members-directory.md)**: The active roster grid, infinite scrolling integrations, and the profile sheet slide-outs.
- *(Note: Logistics and Event Ticketing documentation will be added as the feature reaches MVP).*

---

## 📝 4. Agent Workflows & Project Rules
If you are developing in this workspace (or if an AI Agent is assisting you), you must strictly adhere to the rules defined in the `.agents/` directory at the root of the project.

- **Issue Generation:** All backend dependencies must be documented in the `issues/` folder. See `.agents/workflows/backend-issue.md`.
- **Pull Requests:** Detailed PR changes must be generated. See `.agents/workflows/pr-generation.md`.
- **Architecture Enforcement:** The `feature-architect` skill governs all file creation.
