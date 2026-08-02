import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantDetails } from "../services/applicantApi";
import { Applicant } from "../types";

export function useUpdateApplicantDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicantId,
      data,
    }: {
      applicantId: string;
      data: Partial<Applicant>;
    }) => updateApplicantDetails(applicantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });
}
