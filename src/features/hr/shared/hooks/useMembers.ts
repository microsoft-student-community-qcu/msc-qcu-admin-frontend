import { usePaginatedApplicants } from "./usePaginatedApplicants";
import { FetchApplicantsFilters } from "../types";

export function useMembers(filters?: Omit<FetchApplicantsFilters, "status">) {
  // Fetch only APPROVED applicants to populate the members list using infinite query pagination.
  return usePaginatedApplicants({ status: "APPROVED", ...filters });
}
