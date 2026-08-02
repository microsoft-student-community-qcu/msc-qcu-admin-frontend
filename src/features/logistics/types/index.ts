export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  priorityStartDate: string;
  generalStartDate: string;
  type: "PUBLIC" | "MEMBERS_ONLY";
  maxCapacity: number;
  registeredCount: number;
  attendedCount: number;
  spotsRemaining: number;
}
