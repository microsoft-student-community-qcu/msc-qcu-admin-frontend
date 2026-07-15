# HR & Member Directory Feature

Contains domain logic and components for managing candidate intake (Recruitment Pipeline) and approved members roster. This module is used by **`ADMIN_HR`** (Management, Board Members, & Developers), who act as the de-facto **Super Administrators** for the system.

## Module Structure

The HR feature is divided into two self-contained sub-features:

### 1. [Applicants](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/applicants/)
Handles the student intake and validation workflow:
*   **Components**: Candidate search lists, personal details grids, Certificate of Registration and CV attachments, and OCR error audit boards.
*   **Mutations**: Status mutator triggers (Approve, Reject, Cancel) that notify candidates via SMTP email alerts.

### 2. [Members](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/members/)
Handles active, verified members:
*   **Components**: Roster lists, department-level filtration filters (supporting the 6 official departments from the central portal), and slide-out drawers for contact profiles.