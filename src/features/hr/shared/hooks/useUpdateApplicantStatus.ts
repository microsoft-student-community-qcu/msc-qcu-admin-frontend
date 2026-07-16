import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantStatus } from "../services/applicantApi";
import { Applicant } from "../types";

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicantId, status }: { applicantId: string; status: Applicant["status"] }) =>
      updateApplicantStatus(applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });
}
