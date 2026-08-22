import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { SuperAdminHub } from "@/features/admin/components/SuperAdminHub";

export const Route = createFileRoute("/_admin/settings")({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;
    if (!user || user.role !== "SUPERADMIN") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SuperAdminHub />;
}
