import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HrDashboard } from "@/features/hr/dashboard/components/HrDashboard";
import { LogisticsDashboard } from "@/features/logistics/dashboard/components/LogisticsDashboard";

export const Route = createFileRoute("/_admin/dashboard")({
  component: DashboardRoute,
});

interface UserProfile {
  role: "ADMIN_HR" | "ADMIN_LOGISTICS";
}

function DashboardRoute() {
  const [role, setRole] = React.useState<UserProfile["role"] | null>(null);

  React.useEffect(() => {
    const rawUser = sessionStorage.getItem("currentUser");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser) as UserProfile;
        setRole(user.role);
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    }
  }, []);

  if (role === "ADMIN_LOGISTICS") {
    return <LogisticsDashboard />;
  }

  return <HrDashboard />;
}
