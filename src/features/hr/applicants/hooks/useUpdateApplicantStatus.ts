import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantStatus } from "../services/applicantApi";
import { Applicant } from "@/mocks/applicants";

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
