import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../services/eventApi";

export function useEvents(all?: boolean) {
  return useQuery({
    queryKey: ["events", all],
    queryFn: () => fetchEvents(all),
    retry: false,
  });
}
