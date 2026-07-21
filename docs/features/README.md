# Feature Implementation & Architectures

This document details the functional specifications, flows, and architectures of the core features implemented in the QCU MSC Admin Portal.

---

## 🔑 1. Admin Authentication & Role-Based Access Control (RBAC)

The gateway gating access to the internal community command center.

* **Purpose**: Restrict access to administrative tools based on defined QCU MSC executive board roles.
* **Roles & Workspace Routing**:
  * **Admin (Management & Dev / HR)**: Redirected to `/applications` and `/members` to oversee recruitment and user records.
  * **Admin (Logistics)**: Redirected to `/events/list` and the QR scanner tools to manage on-site meetups.
* **Technical Flow**:
  1. Core members enter credentials at `/login`.
  2. Upon successful verification, a JWT token is saved, and role metadata is loaded.
  3. Global layout route [\_admin.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.tsx) evaluates active session status and verifies access rights before rendering nested route views.

---

## 👥 2. HR & Recruitment Pipeline

The workspace for the Management & Development core team to process student applications captured via the public-facing portals.

* **Key Workflows**:
  * **Applicant Registry**: A filterable master-detail table display of candidates, their details, and submitted portfolios.
  * **Quarantine Queue (Status: `Pending ID Verification`)**: Outlines candidates whose automated Zonal OCR student ID checks failed during public intake.
  * **Manual ID Verification Review**: Allows administrators to compare the student's uploaded ID photograph side-by-side with their manually typed student number. Admins select "Approve ID" to verify and unlock the profile.
  * **Branded Communications**: Mutating a user's membership status (e.g. *Approved* or *Rejected*) triggers backend hooks to compile and dispatch customized status emails.
* **Client-Side Reference**: View [\_admin.applications.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.applications.tsx) for details.

---

## 👥 3. Active Members Directory

The roster containing all successfully approved and verified community members.

* **Key Workflows**:
  * **Team Directory Grid**: A visual card index layout displaying active members, sorted by their assigned departments.
  * **Slide-out Profile Sheet**: Provides instant access to full academic records (College, Program, Section, Campus), contact coordinates, personal interests, and external links (GitHub/Facebook/Portfolio).
  * **Quick Actions**: Enables HR to send emails directly to active members through native mailto actions from both the directory cards and profile sheets.
* **Client-Side Reference**: View [\_admin.members.tsx](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.members.tsx) for details.

---

## 📅 4. Event Logistics & Venue Check-In

The command center for core logistics officers to coordinate community events and manage ticketholder check-ins at venue entry doors.

* **Key Workflows**:
  * **Event Orchestrator**: Simple form interface to establish Event Titles, Schedules, Types (Public/Members-only), and Max Occupancy limits.
  * **Attendee Rosters**: Tracks check-in metrics and flags (`hasAttended`) for registered students.
  * **Mobile QR Scanner (`/admin/events/scan`)**: A mobile-viewport-targeted route (optimized for 320px minimum screen width) that accesses the device camera on site to scan and validate student tickets.
  * **Ticketing Validations**:
    * Reads QR payload UUID.
    * Queries the backend database to verify the registration status and checks off the attendee.
    * Renders warning overlays (`Invalid Ticket or Already Scanned`) if fake, duplicate, or incorrect tickets are scanned.
  * **Manual Check-In Override**: Searchable database directory to check in students manually if their phone screen is cracked or the camera scanner fails to read their QR code.