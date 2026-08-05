import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PeopleRegular,
  ClipboardTaskRegular,
  PulseRegular,
  ArrowUpRightRegular,
  ArrowDownRightRegular,
} from "@fluentui/react-icons";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";

export const HrMetricSummaryCards: React.FC = () => {
  const { data: applicants, isLoading } = useApplicants();

  const totalApplicants = applicants ? applicants.length : 0;
  const pendingApprovals = applicants ? applicants.filter((app) => app.status === "PENDING_REVIEW").length : 0;
  const activeMembers = applicants ? applicants.filter((app) => app.status === "APPROVED").length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-size240 shrink-0">
      {/* Total Applicants */}
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

      {/* Pending Approvals */}
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

      {/* Active Members */}
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

export default HrMetricSummaryCards;
