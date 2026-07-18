import { Applicant, FetchApplicantsFilters } from "../types";
import { formatApplicantName } from "../utils/formatters";
import { getApiBaseURL } from "@/utils/env";

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Documents (CoR/CV) live in a private blob container and are served through
 * the authenticated backend endpoint. The backend stores the raw blob URL, so
 * extract the filename and build the API URL from it.
 */
const toDocumentApiUrl = (storedPath: string): string => {
  if (!storedPath) return storedPath;
  const filename = storedPath.split("/").pop() ?? storedPath;
  return `${getApiBaseURL()}/applicants/documents/${encodeURIComponent(filename)}`;
};

/**
 * OCR ID images live in a private blob container and are served through
 * the authenticated backend endpoint. The backend stores the raw blob URL,
 * so extract the filename and build the API URL from it.
 */
const toImageApiUrl = (storedPath: string): string => {
  if (!storedPath) return storedPath;
  const filename = storedPath.split("/").pop() ?? storedPath;
  return `${getApiBaseURL()}/applicants/images/${encodeURIComponent(filename)}`;
};

/**
 * Fetches a protected image with the session Authorization header and
 * returns an object URL usable as an <img src>. Caller must revoke the
 * object URL when done (URL.revokeObjectURL).
 */
export async function fetchAuthorizedImage(imageUrl: string): Promise<string> {
  const res = await fetch(imageUrl, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to load image");
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Opens a CoR/CV document in a new tab. A plain <a href> cannot attach the
 * Authorization header, so fetch the blob with credentials first and open an
 * object URL instead.
 */
export async function openDocument(documentUrl: string): Promise<void> {
  const res = await fetch(documentUrl, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to load document");
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  window.open(objectUrl, "_blank", "noopener,noreferrer");
  // Revoke after the new tab has had a chance to load the blob
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function fetchApplicants(filters?: FetchApplicantsFilters): Promise<Applicant[]> {
  const apiBase = getApiBaseURL();
  const queryParams = new URLSearchParams();
  if (filters?.status) {
    queryParams.append("status", filters.status);
  }
  if (filters?.limit !== undefined) {
    queryParams.append("limit", filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    queryParams.append("offset", filters.offset.toString());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const res = await fetch(`${apiBase}/applicants${queryString}`, {
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
    return {
      id: backendApp.id,
      studentId: backendApp.studentId || "",
      name: formatApplicantName(backendApp.firstName, backendApp.lastName, backendApp.middleInitial),
      email: backendApp.email,
      department: backendApp.membershipRole,
      corUrl: toDocumentApiUrl(backendApp.certificateOfRegistration),
      cvUrl: toDocumentApiUrl(backendApp.curriculumVitae),
      submissionDate: backendApp.createdAt,
      status: backendApp.status,
      idCardUrl: backendApp.idImagePath ? toImageApiUrl(backendApp.idImagePath) : undefined,
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
  status: Applicant["status"],
  message?: string,
  resubmitFields?: string[]
): Promise<any> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/applicants/${applicantId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status, message, resubmitFields }),
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
