export const SUPERADMIN = "SUPERADMIN" as const;

export const ADMIN_ROLES = [
  "ADMIN_HR",
  "ADMIN_LOGISTICS",
  "SUPERADMIN",
  "ADMIN_FINANCE",
  "ADMIN_FINANCE_HEAD",
  "ADMIN_LOGISTICS_HEAD",
] as const;

export const ALL_ROLES = [
  "APPLICANT",
  "MEMBER",
  "ADMIN_HR",
  "ADMIN_LOGISTICS",
  "SUPERADMIN",
  "ADMIN_FINANCE",
  "ADMIN_FINANCE_HEAD",
  "ADMIN_LOGISTICS_HEAD",
  "STARTUP_DEV",
] as const;

export type UserRole = (typeof ALL_ROLES)[number];
export type AdminRole = (typeof ADMIN_ROLES)[number];
