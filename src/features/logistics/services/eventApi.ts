import { getApiBaseURL } from "@/utils/env";
import { Event } from "../types";

export async function fetchEvents(all?: boolean): Promise<Event[]> {
  const apiBase = getApiBaseURL();
  const queryString = all ? "?all=true" : "";
  const res = await fetch(`${apiBase}/events${queryString}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch events");
  }
  return json.data;
}
