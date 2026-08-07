import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveManualId } from "../services/applicantApi";
import { toast } from "sonner";

export function useApproveManualId() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicantId,
      action,
      studentId,
    }: {
      applicantId: string;
      action: "approve" | "reject";
      studentId?: string;
    }) => approveManualId(applicantId, action, studentId),
    onMutate: async ({ applicantId, action, studentId }) => {
      await queryClient.cancelQueries({ queryKey: ["paginatedApplicants"] });
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      await queryClient.cancelQueries({ queryKey: ["applicant", applicantId] });

      const prevPaginated = queryClient.getQueriesData({ queryKey: ["paginatedApplicants"] });
      const prevApplicants = queryClient.getQueriesData({ queryKey: ["applicants"] });
      const prevSingle = queryClient.getQueryData(["applicant", applicantId]);

      const updateApplicant = (app: any) => {
        if (app.id !== applicantId) return app;
        return {
          ...app,
          ...(action === "approve" && studentId ? { studentId } : {}),
        };
      };

      queryClient.setQueriesData({ queryKey: ["paginatedApplicants"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            applicants: page.applicants.map(updateApplicant),
          })),
        };
      });

      queryClient.setQueriesData({ queryKey: ["applicants"] }, (old: any) => {
        if (!old) return old;
        return old.map(updateApplicant);
      });

      queryClient.setQueryData(["applicant", applicantId], (old: any) => {
        if (!old) return old;
        return updateApplicant(old);
      });

      return { prevPaginated, prevApplicants, prevSingle };
    },
    onError: (error: any, _vars, context: any) => {
      if (context?.prevPaginated) {
        context.prevPaginated.forEach(([key, data]: any) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.prevApplicants) {
        context.prevApplicants.forEach(([key, data]: any) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.prevSingle) {
        queryClient.setQueryData(["applicant", _vars.applicantId], context.prevSingle);
      }
      toast.error(error.message || "Failed to process manual ID verification.");
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
