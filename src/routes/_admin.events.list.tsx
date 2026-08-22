import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/_admin/events/list")({
  beforeLoad: () => {
    const role = useAuthStore.getState().user?.role;
    if (role === "ADMIN_HR" || role === "ADMIN_FINANCE" || role === "ADMIN_FINANCE_HEAD") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: EventsRoute,
});

function EventsRoute() {
  return <div>Event Logistics Management</div>;
}
