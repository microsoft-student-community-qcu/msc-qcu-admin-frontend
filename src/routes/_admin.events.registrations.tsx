import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { RegistrationsView } from "@/features/logistics/components/RegistrationsView";

export const Route = createFileRoute("/_admin/events/registrations")({
  beforeLoad: () => {
    const role = useAuthStore.getState().user?.role;
    if (
      role === "ADMIN_HR" ||
      role === "ADMIN_FINANCE" ||
      role === "ADMIN_FINANCE_HEAD"
    ) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegistrationsRoute,
});

function RegistrationsRoute() {
  return <RegistrationsView />;
}

export default RegistrationsRoute;
