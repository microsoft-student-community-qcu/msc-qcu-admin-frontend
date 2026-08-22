import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../services/eventApi";
import type { EventItem, EventType } from "../types";
import { useDebounce } from "@/hooks/useDebounce";

export interface UseEventsOptions {
  initialSearch?: string;
  initialType?: EventType | "ALL";
  all?: boolean;
  debounceMs?: number;
}

export function useEvents(options?: UseEventsOptions | boolean) {
  const normalizedOptions: UseEventsOptions =
    typeof options === "boolean" ? { all: options } : (options ?? {});

  const {
    initialSearch = "",
    initialType = "ALL",
    all = true,
    debounceMs = 300,
  } = normalizedOptions;

  const [search, setSearch] = React.useState(initialSearch);
  const [typeFilter, setTypeFilter] = React.useState<EventType | "ALL">(initialType);

  const debouncedSearch = useDebounce(search, debounceMs);

  const query = useQuery({
    queryKey: ["events", "list", normalizedOptions.all],
    queryFn: () => fetchEvents(all),
    retry: false,
  });

  const rawEvents = React.useMemo(() => query.data ?? [], [query.data]);

  const filteredEvents = React.useMemo(() => {
    return rawEvents.filter((evt) => {
      if (typeFilter !== "ALL" && evt.type !== typeFilter) {
        return false;
      }
      if (debouncedSearch.trim() !== "") {
        const q = debouncedSearch.trim().toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesVenue = evt.venue ? evt.venue.toLowerCase().includes(q) : false;
        const matchesDescription = evt.description
          ? evt.description.toLowerCase().includes(q)
          : false;

        return matchesTitle || matchesVenue || matchesDescription;
      }
      return true;
    });
  }, [rawEvents, typeFilter, debouncedSearch]);

  return {
    ...query,
    events: filteredEvents,
    rawEvents,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
  };
}

export default useEvents;
