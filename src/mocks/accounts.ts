export interface MockAccount {
  email: string;
  name: string;
  role: "ADMIN_HR" | "ADMIN_LOGISTICS";
  avatarFallback: string;
}

export const mockAccounts: Record<string, MockAccount> = {
  "hr@qcu.edu.ph": {
    email: "hr@qcu.edu.ph",
    name: "HR Super Admin",
    role: "ADMIN_HR",
    avatarFallback: "HA",
  },
  "logistics@qcu.edu.ph": {
    email: "logistics@qcu.edu.ph",
    name: "Logistics Coordinator",
    role: "ADMIN_LOGISTICS",
    avatarFallback: "LC",
  },
};
