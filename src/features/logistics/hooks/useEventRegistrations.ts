import * as React from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchEventRegistrations } from "../services/eventApi";
import type { RegistrationStatus } from "../types";
import { useDebounce } from "@/hooks/useDebounce";

export interface UseEventRegistrationsOptions {
  eventId?: string;
  initialStatus?: RegistrationStatus | "ALL";
  initialSearch?: string;
  pageSize?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export function useEventRegistrations(options?: UseEventRegistrationsOptions) {
  const [status, setStatus] = React.useState<RegistrationStatus | "ALL">(
    options?.initialStatus ?? "ALL",
  );
  const [search, setSearch] = React.useState(options?.initialSearch ?? "");
  const debouncedSearch = useDebounce(search, options?.debounceMs ?? 300);
  const pageSize = options?.pageSize ?? 20;

  const isEnabled = options?.enabled ?? true;

  const query = useInfiniteQuery({
    queryKey: ["events", "registrations", options?.eventId, status, debouncedSearch, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchEventRegistrations({
        eventId: options?.eventId,
        status: status !== "ALL" ? status : undefined,
        search: debouncedSearch.trim() || undefined,
        page: pageParam,
        pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;

      // 1. If lastPage is an array
      if (Array.isArray(lastPage)) {
        return lastPage.length >= pageSize ? allPages.length + 1 : undefined;
      }

      // 2. If structured pagination metadata exists
      if (
        lastPage.pagination &&
        typeof lastPage.pagination.page === "number" &&
        typeof lastPage.pagination.totalPages === "number"
      ) {
        return lastPage.pagination.page < lastPage.pagination.totalPages
          ? lastPage.pagination.page + 1
          : undefined;
      }

      // 3. If total and registrations exist without explicit pagination object
      const registrationsList = Array.isArray(lastPage.registrations)
        ? lastPage.registrations
        : [];
      const totalCount = lastPage.total ?? registrationsList.length;
      const currentFetchedCount = allPages.reduce((sum, p) => {
        if (Array.isArray(p)) return sum + p.length;
        if (Array.isArray(p?.registrations)) return sum + p.registrations.length;
        return sum;
      }, 0);

      if (registrationsList.length === 0 || currentFetchedCount >= totalCount) {
        return undefined;
      }

      return allPages.length + 1;
    },
    enabled: isEnabled,
    placeholderData: keepPreviousData,
  });

  const registrations = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) => {
      if (Array.isArray(page)) return page;
      if (Array.isArray(page?.registrations)) return page.registrations;
      return [];
    });
  }, [query.data]);

  const total = React.useMemo(() => {
    if (!query.data || query.data.pages.length === 0) return 0;
    const firstPage = query.data.pages[0];
    if (firstPage?.pagination?.total !== undefined) return firstPage.pagination.total;
    if (firstPage?.total !== undefined) return firstPage.total;
    return registrations.length;
  }, [query.data, registrations.length]);

  return {
    ...query,
    registrations,
    total,
    status,
    setStatus,
    search,
    setSearch,
  };
}

export default useEventRegistrations;
