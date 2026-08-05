import { useApplicants } from "./useApplicants";

export function useMembers() {
  // Fetch only APPROVED applicants to populate the members list.
  // We request up to 100 members initially (avoiding client-side pagination bugs).
  return useApplicants({ status: "APPROVED", limit: 100 });
}
