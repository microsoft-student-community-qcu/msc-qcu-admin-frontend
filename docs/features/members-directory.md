# Members Directory

The Members Directory feature (`src/features/hr/members/`) provides a centralized roster of all successfully approved and verified community members.

## 1. Directory View (`_admin.members.tsx`)
The primary route that renders the member roster.

- **Data Fetching:** Wraps the `useMembers` hook (a TanStack infinite query wrapper) to fetch chunks of active members.
- **State Persistence:** Filter states (search queries, department dropdowns) are synchronized with the global Zustand `useFilterStore`. If an admin leaves the members page to check an applicant, the exact department filter remains perfectly intact when they return.
- **Visuals:** Renders a clean grid of `MemberCard` components, displaying names, profile avatars, and organizational departments.

## 2. Profile Sheet (`MemberProfileSheet.tsx`)
When a member card is clicked, a detailed slide-out sheet opens.

- **Data Presentation:** Groups member data into logical blocks:
  - **Academic Records:** College, Program, Section, and Campus routing.
  - **Contact & Social:** Direct `mailto:` links, GitHub profiles, and Portfolio URLs.
  - **Organizational Placement:** Department assignments and current active status.
- **Micro-Interactions:** Uses smooth CSS transitions on hover states for social links and quick-action buttons, enforcing the premium Fluent aesthetic.

## 3. Directory Components (`MemberDirectory.tsx`)
The core grid logic is separated from the route file into `MemberDirectory.tsx` to prevent component clumping.

- **Infinite Scrolling:** Uses the global `useIntersectionObserver` hook attached to a "load more" sentinel `div` at the bottom of the grid. When the sentinel enters the viewport, it triggers `fetchNextPage()`.
- **Skeletons:** While initial data loads, `MemberCardSkeleton` components are rendered in an identical grid structure to prevent layout shifting.
