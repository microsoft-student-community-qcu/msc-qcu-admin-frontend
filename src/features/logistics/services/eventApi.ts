import { getApiBaseURL } from "@/utils/env";
import type {
  EventItem,
  EventRegistration,
  RegistrationsResponse,
  FetchRegistrationsParams,
} from "../types";
import type { CreateEventFormValues, CancelEventFormValues } from "../schemas/eventSchemas";

export async function fetchEvents(all?: boolean): Promise<EventItem[]> {
  const apiBase = getApiBaseURL();
  const queryString = all ? "?all=true" : "";
  const res = await fetch(`${apiBase}/events${queryString}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch events");
  return json.data;
}

export async function fetchEventById(eventId: string): Promise<EventItem> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch event details");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch event details");
  return json.data;
}

export async function createEvent(data: CreateEventFormValues): Promise<EventItem> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create event");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create event");
  return json.data;
}

export async function updateEvent(
  eventId: string,
  data: Partial<CreateEventFormValues>,
): Promise<EventItem> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update event");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update event");
  return json.data;
}

export async function cancelEvent(eventId: string, data: CancelEventFormValues): Promise<void> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to cancel event");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to cancel event");
}

export async function fetchEventRegistrations(
  params: FetchRegistrationsParams,
): Promise<RegistrationsResponse> {
  const apiBase = getApiBaseURL();
  const query = new URLSearchParams();
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.pageSize) query.append("pageSize", params.pageSize.toString());

  // If a specific valid eventId is provided (not "ALL" or empty)
  if (params.eventId && params.eventId !== "ALL") {
    const res = await fetch(
      `${apiBase}/events/${params.eventId}/registrations?${query.toString()}`,
      { credentials: "include" },
    );
    if (!res.ok) {
      if (res.status === 404) {
        return { registrations: [], total: 0 };
      }
      throw new Error("Failed to fetch event registrations");
    }
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch event registrations");
    return json.data;
  }

  // If eventId is "ALL" or undefined, aggregate across all active events
  const events = await fetchEvents(true);
  if (!events || events.length === 0) {
    return { registrations: [], total: 0 };
  }

  const results = await Promise.all(
    events.map(async (evt) => {
      try {
        const res = await fetch(
          `${apiBase}/events/${evt.id}/registrations?${query.toString()}`,
          { credentials: "include" },
        );
        if (!res.ok) return [];
        const json = await res.json();
        if (json.success && json.data) {
          const list = Array.isArray(json.data.registrations)
            ? json.data.registrations
            : Array.isArray(json.data)
              ? json.data
              : [];
          return list.map((reg: EventRegistration) => ({
            ...reg,
            eventId: evt.id,
            eventTitle: evt.title,
          }));
        }
        return [];
      } catch {
        return [];
      }
    }),
  );

  const aggregated = results.flat();
  return {
    registrations: aggregated,
    total: aggregated.length,
  };
}

export async function approveRegistration(
  eventId: string,
  registrationId: string,
): Promise<EventRegistration> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}/registrations/${registrationId}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "approve" }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to approve registration");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to approve registration");
  return json.data;
}

export async function rejectRegistration(
  eventId: string,
  registrationId: string,
): Promise<EventRegistration> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}/registrations/${registrationId}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reject" }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to reject registration");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to reject registration");
  return json.data;
}

export async function checkInAttendee(
  eventId: string,
  registrationId: string,
): Promise<EventRegistration> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/events/${eventId}/registrations/${registrationId}/checkin`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to check in attendee");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to check in attendee");
  return json.data;
}

export async function resendTicket(eventId: string, registrationId: string): Promise<void> {
  const apiBase = getApiBaseURL();
  const res = await fetch(
    `${apiBase}/events/${eventId}/registrations/${registrationId}/resend-ticket`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to resend ticket");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to resend ticket");
}

export const checkInRegistration = checkInAttendee;
export const resendTicketEmail = resendTicket;
