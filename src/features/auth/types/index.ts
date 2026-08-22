import { UserRole } from "@/types/roles";

export type { UserRole };

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  role: UserRole;
  avatarFallback: string;
  image?: string | null;
  emailVerified?: boolean;
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
    studentId?: string;
  };
  session?: SessionInfo;
  token?: string;
}
