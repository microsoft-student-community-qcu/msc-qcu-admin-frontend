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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });
}
