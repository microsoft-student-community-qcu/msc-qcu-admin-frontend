import type { UserRole } from "@/types/roles";
export type { UpdateSettingsInput, UpdateUserRoleInput } from "../schemas/adminSchemas";

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  middleInitial?: string | null;
  name: string;
  studentId?: string | null;
  role: UserRole;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    pagination: PaginationMeta;
  };
}

export type SettingKey = "events_registration_open" | "merch_shop_open" | "maintenance_mode";

export interface SystemSetting {
  key: SettingKey;
  value: boolean;
  description: string | null;
  updatedById: string | null;
  updatedAt: string;
}

export interface SystemSettingsResponse {
  success: boolean;
  data: {
    settings: SystemSetting[];
  };
  message?: string;
}

export type AuditAction = "ROLE_CHANGE" | "SETTING_UPDATE" | "SYSTEM_MAINTENANCE";

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  prevHash: string | null;
  hash: string;
  createdAt: string;
}

export interface AuditIntegrity {
  integrityOk: boolean;
  total: number;
  breakIndex: number | null;
}

export interface AuditLogsResponse {
  success: boolean;
  data: {
    logs: AuditLog[];
    integrity: AuditIntegrity;
    pagination: PaginationMeta;
  };
}

export interface ListUsersParams {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

export interface ListAuditLogsParams {
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
