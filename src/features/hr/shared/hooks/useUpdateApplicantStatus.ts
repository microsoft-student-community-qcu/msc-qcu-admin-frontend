import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantStatus } from "../services/applicantApi";
import { Applicant } from "../types";

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicantId,
      status,
      message,
      resubmitFields,
    }: {
      applicantId: string;
      status: Applicant["status"];
      message?: string;
      resubmitFields?: string[];
    }) => updateApplicantStatus(applicantId, status, message, resubmitFields),
    onMutate: async ({ applicantId, status }) => {
      // Cancel in-flight queries to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["paginatedApplicants"] });
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      await queryClient.cancelQueries({ queryKey: ["applicant", applicantId] });
      await queryClient.cancelQueries({ queryKey: ["applicantCounts"] });

      // Snapshot previous values for rollback
      const prevPaginated = queryClient.getQueriesData({ queryKey: ["paginatedApplicants"] });
      const prevApplicants = queryClient.getQueriesData({ queryKey: ["applicants"] });
      const prevSingle = queryClient.getQueryData(["applicant", applicantId]);
      const prevCounts = queryClient.getQueryData(["applicantCounts"]);

      // Optimistically update paginated applicants
      queryClient.setQueriesData({ queryKey: ["paginatedApplicants"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            applicants: page.applicants.map((app: Applicant) =>
              app.id === applicantId ? { ...app, status } : app
            ),
          })),
        };
      });

      // Optimistically update standard applicants list
      queryClient.setQueriesData({ queryKey: ["applicants"] }, (old: any) => {
        if (!old) return old;
        return old.map((app: Applicant) =>
          app.id === applicantId ? { ...app, status } : app
        );
      });

      // Optimistically update single applicant
      queryClient.setQueryData(["applicant", applicantId], (old: any) => {
        if (!old) return old;
        return { ...old, status };
      });

      // We don't try to optimistically guess counts since they're complex, just invalidate them on settled.

      return { prevPaginated, prevApplicants, prevSingle, prevCounts };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevPaginated) {
        context.prevPaginated.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.prevApplicants) {
        context.prevApplicants.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.prevSingle) {
        queryClient.setQueryData(["applicant", _vars.applicantId], context.prevSingle);
      }
      if (context?.prevCounts) {
        queryClient.setQueryData(["applicantCounts"], context.prevCounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicantCounts"] });
      queryClient.invalidateQueries({ queryKey: ["applicant"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
