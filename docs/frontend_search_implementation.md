# Frontend Implementation: Debounced & Paginated Search Integration

This document outlines how the frontend search was modified to integrate with the infinite scroll pagination, optimize React Query caching, and prepare for future backend-level database-wide searching.

---

## 1. The Core Architecture

Previously, search was purely a local client-side filter. When combined with infinite scroll, it had two major issues:
1. **The Cascade Request Loop**: Searching shrunk the list, exposing the scroll sentinel and forcing the observer to fetch every page in the database sequentially.
2. **Cache Bloat**: Navigating away and returning kept all loaded pages in memory, slowing down reloads.

To solve both issues and lay the groundwork for backend-native search, the frontend was refactored to treat the search string as part of the query payload and the React Query cache key.

---

## 2. Step-by-Step Changes Made

### A. Created `useDebounce` Hook
To prevent sending API requests to the server on every single keystroke, we created a debouncing hook that delays updating the query parameter until the user stops typing for `300ms`.

*   **File Created**: [`src/hooks/useDebounce.ts`](file:///e:/Github/msc-qcu-admin-frontend/src/hooks/useDebounce.ts)
*   **Implementation**:
    ```typescript
    import * as React from "react";

    export function useDebounce<T>(value: T, delay: number): T {
      const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

      React.useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          clearTimeout(handler);
        };
      }, [value, delay]);

      return debouncedValue;
    }
    ```

---

### B. Updated API Types
We extended the filtering interface to support an optional `search` string parameter.

*   **File Modified**: [`src/features/hr/shared/types/index.ts`](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/types/index.ts)
*   **Implementation**:
    ```typescript
    export interface FetchApplicantsFilters {
      status?: Applicant["status"];
      limit?: number;
      offset?: number;
      search?: string; // <-- Added
    }
    ```

---

### C. Updated API Service Client
We modified the HTTP fetch client to serialize and append the search parameter as a query string parameter (`?search=...`).

*   **File Modified**: [`src/features/hr/shared/services/applicantApi.ts`](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/services/applicantApi.ts)
*   **Implementation**:
    ```typescript
    if (filters?.search) {
      queryParams.append("search", filters.search);
    }
    ```

---

### D. Passed Search Filters to Hook Calls
We debounced the user input state and piped it into the React Query hooks on both route pages.

#### Applications Route
*   **File Modified**: [`src/routes/_admin.applications.tsx`](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.applications.tsx)
*   **Implementation**:
    ```tsx
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { data: applicantsData, ... } = usePaginatedApplicants({ 
      status: activeTab === "ALL" ? undefined : activeTab as Applicant["status"],
      search: debouncedSearchQuery, // <-- Pass the debounced term
    });
    ```

#### Members Route
We modified the hook signature in `useMembers.ts` to accept optional filters, and then updated the route.

*   **Files Modified**: 
    *   [`src/features/hr/shared/hooks/useMembers.ts`](file:///e:/Github/msc-qcu-admin-frontend/src/features/hr/shared/hooks/useMembers.ts)
    *   [`src/routes/_admin.members.tsx`](file:///e:/Github/msc-qcu-admin-frontend/src/routes/_admin.members.tsx)
*   **Implementation**:
    ```tsx
    const [searchQuery, setSearchQuery] = React.useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { data: membersData, ... } = useMembers({
      search: debouncedSearchQuery, // <-- Pass the debounced term
    });
    ```

---

## 3. Why This Architecture is Optimized

1.  **Automatic Reset to 50 Items on Clear**:
    Because `search` is part of the `filters` object, it is automatically included in the React Query key (`["paginatedApplicants", filters]`). When the search input is cleared, the key changes back to the default filters. React Query instantly resets the page list back to Page 1, discarding the loaded search results.
2.  **No Lag when Navigating**:
    By configuring `gcTime: 0` on `usePaginatedApplicants`, cached pages are immediately garbage collected when you navigate to other routes. Returning to the page always starts with an instant load of only the first 50 items.
3.  **Future-Proof Backend Compatibility**:
    Because the frontend is already passing `?search=term` in the request, the backend is free to ignore it (our current fallback client-side filter still runs) until they implement native search. Once the backend implements database-wide search, the system will immediately benefit from single-request searching without needing any frontend modifications.
