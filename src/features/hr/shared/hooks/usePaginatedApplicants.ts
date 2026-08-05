import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchApplicants } from "../services/applicantApi";
import { FetchApplicantsFilters } from "../types";

export function usePaginatedApplicants(filters?: FetchApplicantsFilters) {
  return useInfiniteQuery({
    queryKey: ["paginatedApplicants", filters],
    queryFn: ({ pageParam = 0 }) => fetchApplicants({ ...filters, limit: 50, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.reduce((acc, page) => acc + page.applicants.length, 0);
      if (currentCount < lastPage.total) {
        return currentCount;
      }
      return undefined;
    },
    gcTime: 0,
    retry: false,
  });
}
