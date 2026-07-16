import { Applicant } from "@/mocks/applicants";
import { getApiBaseURL } from "@/utils/env";

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export async function fetchApplicants(): Promise<Applicant[]> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/applicants`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch applicants");
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch applicants");
  }

  return json.data.applicants.map((backendApp: any) => {
    const firstName = backendApp.firstName || "";
    const lastName = backendApp.lastName || "";
    const middleInitial = backendApp.middleInitial || "";
    const name = `${firstName} ${middleInitial ? middleInitial + " " : ""}${lastName}`.trim().replace(/\s+/g, ' ');

    return {
      id: backendApp.id,
      studentId: backendApp.studentId || "N/A",
      name: name || "Anonymous",
      email: backendApp.email,
      department: backendApp.membershipRole || "General",
      corUrl: backendApp.certificateOfRegistration || "/dummy.pdf",
      cvUrl: backendApp.curriculumVitae || "/dummy.pdf",
      submissionDate: backendApp.createdAt || new Date().toISOString(),
      status: backendApp.status,
      idCardUrl: backendApp.idImagePath || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      manualApplication: backendApp.manual_application || false,
      college: backendApp.college || "N/A",
      program: backendApp.program || "N/A",
      section: backendApp.section || "N/A",
      campus: backendApp.campus || "N/A",
      dateOfBirth: backendApp.dateOfBirth ? new Date(backendApp.dateOfBirth).toISOString().split('T')[0] : "N/A",
      placeOfBirth: backendApp.placeOfBirth || "N/A",
      gender: backendApp.gender ? backendApp.gender.charAt(0) + backendApp.gender.slice(1).toLowerCase() : "N/A",
      houseAddress: backendApp.houseAddress || "N/A",
      cellphone: backendApp.cellphoneNumber || "N/A",
      interests: backendApp.interestsSkillsHobbies || "",
      pastOrganizations: backendApp.organizationHistory || "",
      portfolioUrl: backendApp.portfolio || undefined,
      githubUrl: backendApp.githubOrProjectLinks || undefined,
      facebookUrl: backendApp.facebookLink || undefined,
      previousWorks: backendApp.previousWorksAchievements || undefined,
    };
  });
}

export async function updateApplicantStatus(
  applicantId: string,
  status: Applicant["status"]
): Promise<any> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/applicants/${applicantId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to update status");
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to update status");
  }
  return json.data;
}
