import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PeopleRegular,
  CalendarRegular,
  ClipboardTaskRegular,
  PulseRegular,
  ArrowUpRightRegular,
  ArrowDownRightRegular,
} from "@fluentui/react-icons";
import { useApplicants } from "@/features/hr/applicants/hooks/useApplicants";
import { UserProfile } from "@/features/auth/types";

export const MetricSummaryCards: React.FC = () => {
  const [role, setRole] = useState<UserProfile["role"] | null>(null);
  const { data: applicants, isLoading } = useApplicants();

  useEffect(() => {
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

  const totalApplicants = applicants ? applicants.length : 0;
  const pendingApprovals = applicants ? applicants.filter((app) => app.status === "PENDING_REVIEW").length : 0;
  const activeMembers = applicants ? applicants.filter((app) => app.status === "APPROVED").length : 0;

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isLogistics ? "lg:grid-cols-2" : "lg:grid-cols-4"
      } gap-size240 shrink-0`}
    >
      {/* Total Applicants - HR Only */}
      {!isLogistics && (
        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <PeopleRegular className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold">{isLoading ? "..." : totalApplicants}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRightRegular className="w-4 h-4 text-emerald-500 mr-1 shrink-0" />
              <span className="text-emerald-500 font-medium">+12%</span>&nbsp;from last month
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events - Shared */}
      <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <CalendarRegular className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="z-10 relative">
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            Next event in 7 days
          </p>
        </CardContent>
      </Card>

      {/* Pending Approvals - HR Only */}
      {!isLogistics && (
        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ClipboardTaskRegular className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{isLoading ? "..." : pendingApprovals}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Requires your attention
            </p>
          </CardContent>
        </Card>
      )}

      {/* Active Members - Shared */}
      <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <PulseRegular className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="z-10 relative">
          <div className="text-2xl font-bold">{isLoading ? "..." : activeMembers}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowDownRightRegular className="w-4 h-4 text-red-500 mr-1 shrink-0" />
            <span className="text-red-500 font-medium">-2%</span>&nbsp;from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricSummaryCards;
