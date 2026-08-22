export type EventType = "PUBLIC" | "MEMBERS_ONLY";
export type EventStatus = "ACTIVE" | "CANCELLED" | "COMPLETED";
export type RegistrationStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  image?: string | null;
  date: string;
  priorityStartDate: string;
  generalStartDate: string;
  type: EventType;
  status: EventStatus;
  maxCapacity: number;
  registeredCount: number;
  attendedCount: number;
  spotsRemaining: number;
  venue?: string;
  registrationOpen: boolean;
  requiresQrTicket: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias
export type Event = EventItem;

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle?: string;
  userId?: string | null;
  studentId?: string | null;
  name: string;
  email: string;
  status: RegistrationStatus;
  hasAttended: boolean;
  attendedAt?: string | null;
  isMember: boolean;
  createdAt: string;
}

export interface RegistrationsResponse {
  registrations: EventRegistration[];
  total?: number;
  event?: EventItem;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface FetchRegistrationsParams {
  eventId?: string;
  status?: RegistrationStatus | "ALL";
  search?: string;
  page?: number;
  pageSize?: number;
}
