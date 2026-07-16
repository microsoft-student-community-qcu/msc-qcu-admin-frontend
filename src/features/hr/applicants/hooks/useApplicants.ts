import { useQuery } from "@tanstack/react-query";
import { fetchApplicants } from "../services/applicantApi";

export function useApplicants() {
  return useQuery({
    queryKey: ["applicants"],
    queryFn: fetchApplicants,
    retry: false,
  });
}
