import React from "react";
import { LogisticsMetricSummaryCards } from "./LogisticsMetricSummaryCards";
import { EventAttendanceChart } from "./EventAttendanceChart";
import { EventRatingsChart } from "./EventRatingsChart";
import { EventGrid } from "./EventGrid";
import { InboxPanel } from "@/components/shared/InboxPanel";

export const LogisticsDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-size240 h-[calc(100vh-7.5rem)] min-h-0">
      {/* Summary Cards */}
      <LogisticsMetricSummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-size240 flex-1 min-h-0">
        {/* Row 1: Graphs */}
        <div className="lg:col-span-2">
          <EventAttendanceChart />
        </div>
        <EventRatingsChart />

        {/* Row 2: Lists & Feeds */}
        <div className="lg:col-span-2">
          <EventGrid />
        </div>
        <InboxPanel />
      </div>
    </div>
  );
};

export default LogisticsDashboard;
