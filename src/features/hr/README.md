# HR & Member Directory Feature (`src/features/hr/`)

This directory houses all domain logic, custom hooks, services, types, utilities, and components for managing the student recruitment pipeline (Applicants) and the roster of active members (Members). 

This module is designed exclusively for **`ADMIN_HR`** (Management, Board Members, & Developers), who act as the de-facto **Super Administrators** for the system.

---

## 1. Domain Architecture: Applicants vs. Members

In the database schema, **Applicants and Members share the same underlying data entity.** 
* There is no separate `Member` table. 
* A student starts as an `Applicant` with `status: PENDING_REVIEW`.
* When an admin approves their application, their `status` is updated to `APPROVED` and their linked auth `User` record role is updated from `APPLICANT` to `MEMBER`.
* Since they represent the same entity, **all components share the same API endpoint and TypeScript types** to keep a clean, unified schema.

---

## 2. Directory Structure

To support clean separation of concerns and avoid duplicate code, the folder structure is organized as follows:

```
src/features/hr/
├── shared/
│   ├── hooks/
│   │   ├── useApplicants.ts          # Core query hook (with server-side status/pagination filters)
│   │   ├── useUpdateApplicantStatus.ts# Mutation hook to approve/reject/quarantine/cancel applicants
│   │   └── useMembers.ts             # Member query hook (pre-filtered with status: APPROVED)
│   ├── services/
│   │   └── applicantApi.ts           # Fetch API client requests (GET /applicants, PATCH status)
│   ├── types/
│   │   └── index.ts                  # Central, production-grade interface models (e.g., Applicant)
│   └── utils/
│       └── formatters.ts             # HR domain formatting utilities (e.g., formatApplicantName)
├── applicants/
│   └── components/                   # UI components for applicant intake (ApplicantList, Details, dialogs)
├── members/
│   └── components/                   # UI components for active roster (Directory, Profiles, filter bars)
└── dashboard/
    └── components/                   # HR dashboard layouts, Growth Charts, and Department Distribution
```

---

## 3. Sub-Module Details

### 📂 [Shared Module](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/)
Provides a single source of truth for the HR domain logic. 
* **Types**: The [Applicant](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/types/index.ts) interface represents the complete parsed student profile. Do not define or import types from mock files in production.
* **Services**: The [applicantApi.ts](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/services/applicantApi.ts) client performs query parameterization (`?status=APPROVED&limit=100`) to let the backend database filter and paginate records rather than pulling them raw.
* **Utils**: The [formatters.ts](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/utils/formatters.ts) library formats firstName, lastName, and middleInitial into a standard presentation string (`"LastName, FirstName MiddleInitial"`).

### 📂 [Applicants Component Folder](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/applicants/components/)
Contains the candidate intake review screens. It consumes the `useApplicants` query and `useUpdateApplicantStatus` mutation hooks from the shared directory to let admins search, review COR/CV documents, quarantine OCR-failed items, and send email alerts on status changes.

### 📂 [Members Component Folder](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/members/components/)
Contains the member directory. It consumes the `useMembers` hook to search and display approved members, filtering them by the 6 official departments.

### 📂 [HR Dashboard Folder](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/dashboard/components/)
Contains components rendered on the HR Admin Dashboard layout:
* `ApplicationGrowthChart`: Renders signups by month.
* `DepartmentDistributionChart`: Renders active member department distribution.
* `RecentApplicationsList`: Displays a feed of the 5 most recent applicants.
* `HrDashboard`: Layout wrapper for the HR role.

---

## 4. Architectural Rules for Contributors & LLMs

1. **Strict Code Sharing**: Under no circumstances should duplicate fetch routines, axios instances, or type interfaces be added inside `applicants/` or `members/` directories. Common logic belongs in `shared/`.
2. **Server-Side Data Scope**: The backend `GET /api/v1/applicants` route has a default pagination limit of `50`. Never fetch all applicants client-side to do active member filtering, as older members will be hidden. Instead, query specifically with `{ status: "APPROVED", limit: 100 }` via the `useMembers` hook.
3. **Mock Separation**: Never use fallback mock datasets directly in production rendering components. Fallbacks should default to empty arrays (`[]`), and mock data files (`src/mocks/*`) should only be referenced for development mocks/tests.