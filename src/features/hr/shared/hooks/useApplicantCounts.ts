import { useQuery } from "@tanstack/react-query";
import { fetchApplicants, fetchApplicantCounts } from "../services/applicantApi";
import { Applicant } from "../types";

const STATUSES: Array<Applicant["status"] | "ALL"> = [
  "ALL",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
  "RESUBMIT",
  "CANCELLED",
  "FOR_INTERVIEW",
];

export function useApplicantCounts() {
  return useQuery({
    queryKey: ["applicantCounts"],
    queryFn: async () => {
      try {
        return await fetchApplicantCounts();
      } catch (err) {
        console.warn("New counts endpoint failed, using fallback:", err);
        const counts: {
          ALL: number;
          PENDING_REVIEW: number;
          APPROVED: number;
          REJECTED: number;
          RESUBMIT: number;
          CANCELLED: number;
          FOR_INTERVIEW: number;
        } = {
          ALL: 0,
          PENDING_REVIEW: 0,
          APPROVED: 0,
          REJECTED: 0,
          RESUBMIT: 0,
          CANCELLED: 0,
          FOR_INTERVIEW: 0,
        };
        const promises = STATUSES.map(async (status) => {
          const filters = status === "ALL" ? { limit: 0 } : { status: status as Applicant["status"], limit: 0 };
          const result = await fetchApplicants(filters);
          counts[status] = result.total;
        });
        
        await Promise.all(promises);
        return counts;
      }
    },
    retry: false,
  });
}
