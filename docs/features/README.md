# Feature Implementation & Architectures

This document details the functional specifications, flows, and architectures of the core features implemented in the QCU MSC Admin Portal.

---

## 1. Super Admin Settings Hub & 9-Role RBAC

The administrative command center governing platform security, user privileges, and cryptographic compliance.

* **Documentation Reference:** [Super Admin Settings Hub](superadmin-hub.md)
* **Purpose:** Provides executive oversight for user roles, global system toggles, and chained HMAC audit logs.
* **Key Workflows:**
  * **Role Management:** Search, inspect, and elevate user roles across the 9-role authorization matrix.
  * **System Switches:** Toggle global feature flags (`events_registration_open`, `merch_shop_open`, `maintenance_mode`).
  * **Cryptographic Audit Trail:** Inspect immutable, HMAC-SHA256 chained system event logs with integrity indicators.

---

## 2. Event Logistics & Venue Attendance Desk

The operational command center for event planning, tiered registration scheduling, attendee ticketing, and on-site door verification.

* **Documentation Reference:** [Event Logistics & Attendee Management](events-logistics.md)
* **Purpose:** Facilitate event lifecycle management from initial scheduling to on-site check-in.
* **Key Workflows:**
  * **Event Management (`/events/list`):** Card and tabular views with cover photo banners, occupancy meters, and cancellation modal.
  * **Attendee Management (`/events/registrations`):** Pre-event registration review, manual ID verification review, and QR ticket issuance.
  * **Live Door Desk (`/events/attendance`):** 4-column live KPI dashboard, rapid keystroke search, and instant verification toasts.

---

## 3. Admin Authentication & Session Hydration

The gateway gating access to the internal community command center.

* **Documentation Reference:** [Authentication & Password Reset](auth.md)
* **Purpose:** Restrict access to administrative tools based on authoritative server sessions.
* **Key Workflows:**
  * **Server-Hydrated Auth:** Centralized Zustand auth store (`useAuthStore`) hydrated via `/api/v1/users/me` on route transitions.
  * **Self-Service Password Reset:** Guided multi-step password reset workflow with security verification.

---

## 4. HR & Recruitment Pipeline

The workspace for the Management & Development core team to process student applications captured via the public-facing portals.

* **Documentation Reference:** [HR & Recruitment Pipeline](hr-pipeline.md)
* **Key Workflows:**
  * **Applicant Registry:** Filterable master-detail table display of candidates, their academic records, and submitted portfolios.
  * **Quarantine Queue (Pending ID Verification):** Outlines candidates whose automated OCR student ID checks failed during public intake.
  * **Manual ID Verification Review:** Side-by-side comparison of student ID photo and student number to approve or reject verification.

---

## 5. Active Members Directory

The roster containing all successfully approved and verified community members.

* **Documentation Reference:** [Members Directory](members-directory.md)
* **Key Workflows:**
  * **Team Directory Grid:** Visual card index layout displaying active members, sorted by department.
  * **Slide-out Profile Sheet:** Instant access to full academic records, contact coordinates, and portfolio links.
  * **Quick Communications:** Direct email actions from directory cards and profile sheets.
