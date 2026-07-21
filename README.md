# QCU MSC Admin Dashboard

The internal command center for the **QCU Microsoft Student Community (MSC)** executive board. This dashboard serves as the administrative backbone for managing the community's operations, specifically focusing on HR applicant tracking and event logistics.

> **Note:** This repository (`msc-qcu-admin-frontend`) is strictly the secure, internal admin environment. All public-facing features (Landing Page, Applicant Intake, Member Dashboard) are handled in the `qcu-msc-central-portal-frontend` repository.

## Project Scope

The dashboard is divided into specific role-based modules:

1. **Admin Authentication**: Secure JWT-based login portal for Core Team members.
2. **HR & Recruitment Pipeline**: Workspace for processing member applications. Features include Quarantine Queue (for failed OCR scans), Manual ID Override, and an automated Status Mutator (for dispatching branded acceptance/rejection emails).
3. **Event Logistics & Check-In**: Control center for creating events and managing venue check-ins. Features include Event Creation, Attendee Rosters, and a mobile-friendly QR Scanner for door check-ins.

## Design System

This project strictly adheres to a **Microsoft Fluent UI** design language, built on top of Tailwind CSS v4, Base UI, and shadcn/ui.

- **Typography:** `Segoe UI Variable`, `Segoe UI`.
- **Spacing:** Custom 4px Fluent Spacing Ramp (`size20` through `size480`).
- **Elevations:** Custom Fluent Shadows (`shadow-2` through `shadow-64`) adapting to light/dark modes.
- **Icons:** Strictly `@fluentui/react-icons`.

_See [`design.md`](./design.md) for the complete rules and tokens._

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd msc-qcu-admin-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` or `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to your backend instance:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_AZURE_STORAGE_ACCOUNT_NAME=your_azure_storage_account_name
   ```

4. Connect to Backend & Database Setup:
   - Clone and set up the backend repository: `qcu-msc-central-portal-backend`.
   - Ensure MySQL database (e.g. via XAMPP) is running and created (e.g. `qcu_msc_central_portal`).
   - In the backend repo, run Prisma migrations to apply the SQL database schema:
     ```bash
     npx prisma migrate dev
     ```
   - Seed the initial admin credentials into the database:
     ```bash
     npx prisma db seed
     ```
     *(This seeds system HR Admin and Logistics Admin credentials to log into this panel).*

5. Start the development server:
   ```bash
   npm run dev
   ```

### Mock Accounts for Testing

During local development, you can sign in using these mock accounts to test role-based UI restriction features:

- **HR Super Admin** (full access to HR recruitment, member rosters, and logistics grids):
  - Email: `hr@qcu.edu.ph`
  - Password: `password123`
- **Logistics Coordinator** (restricted access; hides HR applicants/members pages and displays tailored events widgets):
  - Email: `logistics@qcu.edu.ph`
  - Password: `password123`

## Branching Conventions & Approval Requirements

Please follow @microsoft-student-community-qcu/frontend-team

```text
                    main
                   ▲   ▲
                  │     │
          release      hotfix/*
             ▲
             │
          develop
             ▲
             │
         feature/*
```

### main

- **Purpose:** Production environment (live for everyone)
- **Receives From:** `release`, `hotfix/*`
- **Approval Requirement:**
  - @microsoft-student-community-qcu/cloud-team
  - @microsoft-student-community-qcu/qa-team
  - @microsoft-student-community-qcu/cybersecurity-team

---

### hotfix/*

- **Purpose:** Emergency fixes for production issues
- **Base Branch:** `main`
- **Merge Target:** `main`
- **Approval Requirement:**
  - @microsoft-student-community-qcu/cloud-team

---

### release

- **Purpose:** Online testing and beta previews for organization officers
- **Base Branch:** `develop`
- **Merge Target:** `main`
- **Approval Requirement:**
  - Software Development Head (@CarlOwlTech)
  - _(Temporarily open to all contributors)_

---

### develop

- **Purpose:** Developer integration and live preview
- **Base Branch:** `feature/*`
- **Merge Target:** `release`
- **Approval Requirement:**
  - Frontend Lead (@BootlegYouki)
  - Backend Lead (@mark-ianz)

---

### feature/*

- **Purpose:** Development of new features
- **Base Branch:** `develop`
- **Merge Target:** `develop`
- **Approval Requirement:**
  - @microsoft-student-community-qcu/sad-team

---

> Refer to the cloud services documentation for the services used in each branch.

### Git Workflow Example

Here are the standard commands to create a new feature and push it for review:

1. Switch to the `develop` branch and ensure it's up to date:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Create and switch to a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Stage, commit, and push your changes:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   git push -u origin feature/your-feature-name
   ```
4. Open a Pull Request targeting the `develop` branch and request approval from the required teams.
