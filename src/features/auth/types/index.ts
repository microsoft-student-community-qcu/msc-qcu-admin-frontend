export type UserRole = "ADMIN_HR" | "ADMIN_LOGISTICS" | "APPLICANT" | "MEMBER";

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  avatarFallback?: string;
}

export interface SessionInfo {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
  session?: SessionInfo;
  token?: string; // fallback if session token is root level
}
