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

*See [`design.md`](./design.md) for the complete rules and tokens.*

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
3. Start the development server:
   ```bash
   npm run dev
   ```

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
  - *(Temporarily open to all contributors)*

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
