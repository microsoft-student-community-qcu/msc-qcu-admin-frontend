import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "../services/eventApi";
import type { EventItem } from "../types";

export function useEventDetails(eventId: string | null | undefined) {
  return useQuery<EventItem | null>({
    queryKey: ["events", "detail", eventId],
    queryFn: () => (eventId ? fetchEventById(eventId) : null),
    enabled: !!eventId,
    retry: false,
  });
}

export default useEventDetails;
