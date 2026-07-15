import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

// Extracted Feature Components
import { MetricSummaryCards } from "@/features/dashboard/components/MetricSummaryCards";
import { ApplicationGrowthChart } from "@/features/dashboard/components/ApplicationGrowthChart";
import { DepartmentDistributionChart } from "@/features/dashboard/components/DepartmentDistributionChart";
import { RecentApplicationsList } from "@/features/dashboard/components/RecentApplicationsList";
import { EventGrid } from "@/features/dashboard/components/EventGrid";
import { InboxPanel } from "@/features/dashboard/components/InboxPanel";
import { EventAttendanceChart } from "@/features/dashboard/components/EventAttendanceChart";
import { CheckInVelocityChart } from "@/features/dashboard/components/CheckInVelocityChart";

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

  const isLogistics = role === "ADMIN_LOGISTICS";

  return (
    <div className="flex flex-col gap-size240 h-[calc(100vh-7.5rem)] min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <MetricSummaryCards />

      {/* Main Content Grid */}
      {isLogistics ? (
        // Logistics Dashboard Layout (Charts on top, Event lists & Inbox on bottom)
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-size240 flex-1 min-h-0">
          {/* Row 1: Graphs */}
          <div className="lg:col-span-2">
            <EventAttendanceChart />
          </div>
          <CheckInVelocityChart />

          {/* Row 2: Lists & Feeds */}
          <div className="lg:col-span-2">
            <EventGrid />
          </div>
          <InboxPanel />
        </div>
      ) : (
        // HR / Super Admin Dashboard Layout (Full view with charts and applicants)
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-size240 flex-1 min-h-0">
          {/* Row 1 Left Side: Equal-width Charts Container */}
          <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-5 gap-size240 min-h-0">
            <ApplicationGrowthChart />
            <DepartmentDistributionChart />
          </div>

          {/* Right Sidebar: Recent Applications */}
          <RecentApplicationsList />

          {/* Row 2: Upcoming & Recent Events */}
          <EventGrid />

          {/* Inbox / Notifications */}
          <InboxPanel />
        </div>
      )}
    </div>
  );
}
