import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarRegular,
  PulseRegular,
  ArrowDownRightRegular,
} from "@fluentui/react-icons";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";

export const LogisticsMetricSummaryCards: React.FC = () => {
  const { data: applicants, isLoading } = useApplicants();
  const activeMembers = applicants ? applicants.filter((app) => app.status === "APPROVED").length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-size240 shrink-0">
      {/* Upcoming Events */}
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

export default LogisticsMetricSummaryCards;
