import { useQuery } from "@tanstack/react-query";
import { fetchApplicants } from "../services/applicantApi";
import { FetchApplicantsFilters } from "../types";

export function useApplicants(filters?: FetchApplicantsFilters) {
  return useQuery({
    queryKey: ["applicants", filters],
    queryFn: () => fetchApplicants(filters),
    retry: false,
  });
}
