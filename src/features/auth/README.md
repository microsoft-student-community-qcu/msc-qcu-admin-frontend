# Auth Feature

Contains authentication forms, validators, and route guards.

## Mock Credentials (Development/Testing)

For testing local UI transitions and role-based views, you can log in using the following credentials:

| Email                  | Password      | Assigned Role     | Description                                                                                                                |
| :--------------------- | :------------ | :---------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `hr@qcu.edu.ph`        | `password123` | `ADMIN_HR`        | **HR Super Admin** (has access to all dashboard panels, applicant records, and member directories)                         |
| `logistics@qcu.edu.ph` | `password123` | `ADMIN_LOGISTICS` | **Logistics Coordinator** (restricted view; hides HR applicant and member pages, displays customized event check-in tools) |

## Module Structure

- **`components/`**:
  - [LoginForm.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/features/auth/components/LoginForm.tsx): Static multi-step login form matching Microsoft's native design (case-insensitive email matching, zero layout shifts, and fade-only transitions).
