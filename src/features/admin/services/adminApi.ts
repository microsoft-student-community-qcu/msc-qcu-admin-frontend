import { getApiV2BaseURL } from "@/utils/env";
import type {
  AdminUsersResponse,
  SystemSettingsResponse,
  AuditLogsResponse,
  ListUsersParams,
  ListAuditLogsParams,
  UpdateSettingsInput,
  AdminUser,
} from "../types/adminTypes";
import type { UserRole } from "@/types/roles";

export async function fetchAdminUsers(params?: ListUsersParams): Promise<AdminUsersResponse> {
  const base = getApiV2BaseURL();
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());

  const res = await fetch(`${base}/admin/users?${query.toString()}`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch users");
  }
  return json;
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<{ success: boolean; data: AdminUser; message: string }> {
  const base = getApiV2BaseURL();
  const res = await fetch(`${base}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update user role");
  }
  return json;
}

export async function fetchSystemSettings(): Promise<SystemSettingsResponse> {
  const base = getApiV2BaseURL();
  const res = await fetch(`${base}/admin/settings`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch system settings");
  }
  return json;
}

export async function updateSystemSettings(
  payload: UpdateSettingsInput,
): Promise<SystemSettingsResponse> {
  const base = getApiV2BaseURL();
  const res = await fetch(`${base}/admin/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update system settings");
  }
  return json;
}

export async function fetchAuditLogs(params?: ListAuditLogsParams): Promise<AuditLogsResponse> {
  const base = getApiV2BaseURL();
  const query = new URLSearchParams();
  if (params?.action) query.set("action", params.action);
  if (params?.actorId) query.set("actorId", params.actorId);
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());

  const res = await fetch(`${base}/admin/audit-logs?${query.toString()}`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch audit logs");
  }
  return json;
}
