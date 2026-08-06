import { useQuery } from "@tanstack/react-query";
import { fetchApplicantById } from "../services/applicantApi";

export function useApplicant(applicantId?: string) {
  return useQuery({
    queryKey: ["applicant", applicantId],
    queryFn: () => {
      if (!applicantId) return null;
      return fetchApplicantById(applicantId);
    },
    enabled: !!applicantId,
    retry: false,
  });
}
