# HR & Recruitment Pipeline

The HR pipeline is the core administrative feature for processing student applications captured via the public portals. All logic for this domain is encapsulated within `src/features/hr/`.

## 1. Applicant Registry (`_admin.applications.tsx`)
The central hub for reviewing incoming applicants.

- **Data Fetching:** Utilizes the `usePaginatedApplicants` hook, wrapping a TanStack Query infinite query. It fetches chunks of applicants based on the active `status` and `search` parameters.
- **State Persistence:** The current tab (e.g., "Pending"), text search queries, and selected office filters are stored in the global Zustand `useFilterStore`. This ensures HR admins don't lose their place when navigating away from the page.
- **Skeleton Flash Prevention:** `keepPreviousData: true` is enabled on the query hook, ensuring the UI remains solid while switching tabs instead of violently flashing a loading state.

## 2. Applicant Details Drawer (`ApplicantDetails.tsx`)
When an HR admin clicks an applicant row, a right-side drawer slides out.

- **Architecture:** The drawer is built using a Shadcn `Sheet` component. It renders the full applicant profile, including parsed fields from their Zonal OCR ID scan.
- **Status Mutations:** The drawer houses a `Select` component bound to the applicant's current status. Changing this value triggers the `useUpdateApplicantStatus` mutation hook, which executes an **optimistic UI update** (instantly reflecting the change) while dispatching an SMTP email hook on the backend.

## 3. Manual ID Verification (`useApproveManualId.ts`)
If a student's ID failed the automated Zonal OCR scan on the public portal, they enter a manual quarantine queue (`status: PENDING_REVIEW`).

- **The Flow:** The HR admin opens the applicant details drawer and clicks "View ID Image". A high-resolution Image Zoom dialog opens, allowing the admin to visually compare the uploaded ID photograph against the manually typed Student Number.
- **Action:** Clicking "Approve ID" triggers the `useApproveManualId` hook. This fires a backend mutation that forces the OCR verification flag to `true` and clears the manual quarantine, progressing them through the pipeline.
