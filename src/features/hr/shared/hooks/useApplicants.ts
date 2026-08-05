import { useQuery } from "@tanstack/react-query";
import { fetchApplicants } from "../services/applicantApi";
import { FetchApplicantsFilters } from "../types";

export function useApplicants(filters?: FetchApplicantsFilters) {
  return useQuery({
    queryKey: ["applicants", filters],
    queryFn: async () => {
      const res = await fetchApplicants(filters);
      return res.applicants;
    },
    retry: false,
  });
}
