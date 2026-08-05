# Objective of the Repository

This repository is the **Admin Frontend** for the QCU MSC Central Portal. It is strictly the internal command center for the organization. (The public-facing portal is handled in a separate repository).

**Primary Goals:**
1. Secure Authentication & Role Management (Admin roles).
2. **HR & Recruitment Pipeline:** Manage applicant data, resolve ID verification errors, update application statuses, and trigger emails.
3. **Event Logistics & Check-In:** Create public events, manage attendee rosters, and scan QR tickets (mobile-friendly route).

## Strict Folder Structure Rules

**Key Directive:** Always maintain a scalable, readable, and modular folder structure. Adherence to this architecture is mandatory to ensure backend integration is seamless and straightforward.

### Source Code (`src/`)
We use a Feature-Driven Architecture (Vertical Slicing) combined with standard shared layers. Never place feature-specific logic in global shared folders.

- `src/assets/`: Static assets (images, fonts, global CSS).
- `src/components/ui/`: Pure, primitive UI components (e.g., Shadcn/Radix components).
- `src/components/shared/`: Reusable non-primitive components (e.g., Layouts, ErrorBoundaries).
- `src/features/`: Feature-driven modules containing their own components, hooks, and logic.
  - `auth/`: Admin authentication, token management, and role-based access control.
  - `hr/`: HR & Recruitment Pipeline used by Admin (Management & Dev). Includes Applicant Data Table, Quarantine Queue, and Status Mutators.
  - `logistics/`: Event Logistics & Check-In used by Admin (Logistics). Includes Event Creation, Attendee Rosters, and QR Scanner validation.
- `src/hooks/`: Global custom React hooks only.
- `src/lib/`: Third-party configurations and initializations (Axios, Zod).
- `src/routes/`: TanStack Router file-based route definitions.
- `src/services/`: API client calls and TanStack Query (queries/mutations). This is the bridge between frontend and backend.
- `src/store/`: Global state management (Zustand). Keep local state within components/features.
- `src/types/`: Global TypeScript interfaces.
- `src/utils/`: Generic helper functions (formatting, parsers).

### Documentation (`docs/`)
Use the `docs/` folder to document API contracts and frontend flows for the backend team.
- `docs/architecture/`: Overall frontend system design and routing strategy.
- `docs/api-integration/`: Expected API contracts, payloads, methods, and response codes.
- `docs/components/`: Component usage guidelines.
- `docs/features/`: Complex frontend feature logic (e.g., QR Scanning logic for event logistics).
