# State Management

The frontend utilizes a hybrid state management architecture, dividing state responsibilities strictly based on their scope and volatility.

## 1. Server State (TanStack Query)
All asynchronous server state, API fetching, caching, and background synchronization is handled exclusively by **TanStack Query (React Query v5)**.

- **Responsibility:** Fetching lists of applicants/members, executing mutations (status approvals), and tracking `isLoading` / `isError` states.
- **Why?** It automatically handles deduplication of requests, intelligent background polling, and cache invalidation, completely removing the need to store API responses in Redux or Context.
- **Reference:** See `docs/api-integration/caching-and-optimistic-ui.md` for specific configuration details.

## 2. Global UI State (Zustand)
Cross-page UI state (like filter parameters that need to persist across routes) is managed by **Zustand**.

- **Responsibility:** Persisting complex user preferences, like search queries and dropdown selections.
- **Implementation:** 
  - The `useFilterStore` (`src/store/useFilterStore.ts`) uses Zustand's `persist` middleware.
  - When an admin configures a filter (e.g., searching for "Pending" applicants in the "HR" department), the state is instantly written to `localStorage`.
  - If the admin navigates to the Members directory and back, the filters instantly rehydrate, maintaining the exact view state without any data loss.
- **Why?** Zustand avoids the massive boilerplate of Redux while providing instant, hook-based access to global state without unnecessary React context re-renders.

## 3. Local Component State (React `useState`)
Volatile, short-lived UI state is kept completely local to the component using standard React hooks.

- **Responsibility:** Tracking whether a specific Dialog/Modal is open, or holding a temporary string for a localized form input.
- **Why?** It prevents global store bloat. If a piece of state doesn't need to survive the unmounting of its parent component, it stays in `useState`.
