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
    onSuccess: (data, variables) => {
      // Invalidate the applicants list query to refresh data
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      
      const actionText = variables.action === "approve" ? "approved" : "rejected";
      toast.success(`Manual ID verification ${actionText} successfully.`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process manual ID verification.");
    },
  });
}
