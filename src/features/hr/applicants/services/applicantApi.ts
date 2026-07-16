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
    const firstName = (backendApp.firstName || "").trim();
    const lastName = (backendApp.lastName || "").trim();
    const middleInitial = (backendApp.middleInitial || "").trim();

    let name = "";
    if (lastName && firstName) {
      name = `${lastName}, ${firstName}${middleInitial ? " " + middleInitial : ""}`;
    } else if (firstName) {
      name = `${firstName}${middleInitial ? " " + middleInitial : ""}`;
    } else if (lastName) {
      name = lastName;
    }
    name = name.trim().replace(/\s+/g, ' ');

    return {
      id: backendApp.id,
      studentId: backendApp.studentId || "",
      name: name,
      email: backendApp.email,
      department: backendApp.membershipRole,
      corUrl: backendApp.certificateOfRegistration,
      cvUrl: backendApp.curriculumVitae,
      submissionDate: backendApp.createdAt,
      status: backendApp.status,
      idCardUrl: backendApp.idImagePath || undefined,
      manualApplication: backendApp.manual_application,
      college: backendApp.college,
      program: backendApp.program,
      section: backendApp.section,
      campus: backendApp.campus,
      dateOfBirth: new Date(backendApp.dateOfBirth).toISOString().split('T')[0],
      placeOfBirth: backendApp.placeOfBirth,
      gender: backendApp.gender.charAt(0) + backendApp.gender.slice(1).toLowerCase(),
      houseAddress: backendApp.houseAddress,
      cellphone: backendApp.cellphoneNumber,
      interests: backendApp.interestsSkillsHobbies,
      pastOrganizations: backendApp.organizationHistory,
      portfolioUrl: backendApp.portfolio || undefined,
      githubUrl: backendApp.githubOrProjectLinks || undefined,
      facebookUrl: backendApp.facebookLink,
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
