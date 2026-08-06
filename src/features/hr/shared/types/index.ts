export interface Applicant {
  id: string;
  studentId: string;
  name: string;
  rawFirstName: string;
  rawLastName: string;
  rawMiddleInitial: string | null;
  email: string;
  department: string;
  corUrl: string;
  cvUrl: string;
  submissionDate: string;
  status: "APPROVED" | "PENDING_REVIEW" | "REJECTED" | "CANCELLED" | "RESUBMIT" | "FOR_INTERVIEW";
  idCardUrl: string;
  manualApplication?: boolean;
  college: string;
  program: string;
  section: string;
  campus: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  houseAddress: string;
  cellphone: string;
  interests: string;
  pastOrganizations: string;
  portfolioUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  previousWorks?: string;
}

export interface FetchApplicantsFilters {
  status?: Applicant["status"];
  limit?: number;
  offset?: number;
  search?: string;
  office?: string;
}
