import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { LiveCheckInView } from "@/features/logistics/components/LiveCheckInView";

export const Route = createFileRoute("/_admin/events/attendance")({
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
  component: LiveCheckInRoute,
});

function LiveCheckInRoute() {
  return <LiveCheckInView />;
}

export default LiveCheckInRoute;
