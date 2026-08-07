# Caching & Optimistic UI Strategy

To ensure the admin dashboard feels instantly responsive and minimizes unnecessary network load on the QCU backend, we employ a highly tuned caching and optimistic update strategy via **TanStack Query**.

## 1. Smart Caching Defaults
We override the default React Query behavior (which aggressively refetches data on every window focus) by defining a global `staleTime` configuration in `src/lib/queryClient.ts`.

- **Global Default:** `staleTime: 2 * 60 * 1000` (2 minutes). Data remains fresh for 2 minutes, preventing redundant network requests when rapidly navigating between standard views.
- **High-Volatility Data (Applicant Counts):** `staleTime: 3 * 60 * 1000` (3 minutes). Counters update slightly slower, allowing the database to breathe.
- **Low-Volatility Data (Dashboard Stats):** `staleTime: 5 * 60 * 1000` (5 minutes). High-level aggregates only refresh every 5 minutes unless manually invalidated.

## 2. Optimistic UI Updates
When an admin performs a mutation (e.g., changing an applicant's status from "Pending" to "Approved"), we DO NOT wait for the backend to respond.

**The Workflow (`onMutate` hook):**
1. **Cancel Outbound Queries:** We instantly cancel any active background refetches for that specific applicant list to prevent race conditions.
2. **Snapshot the Past:** We save a snapshot of the current cached data to memory.
3. **Optimistically Update:** We directly mutate the internal TanStack Query cache, instantly changing the applicant's status string in the UI. The dropdown snaps to the new value with zero latency.
4. **Error Rollback (`onError`):** If the backend request fails (e.g., SMTP server down), the query cache instantly rolls back to the snapshot, restoring the previous status.
5. **Final Sync (`onSettled`):** Regardless of success or failure, we silently invalidate the query in the background to ensure the frontend cache perfectly matches the true database state.

## 3. Unlocking the UI
Historically, optimistic updates can be bottlenecked if the UI disables itself during the mutation. 
In our architecture, we explicitly **remove `disabled={isPending}` constraints** from interactive elements (like the Status Dropdown) during mutations. This allows the optimistic UI to shine through instantly without being artificially locked while the backend resolves.
