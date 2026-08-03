import React from "react";
import { LogisticsMetricSummaryCards } from "./LogisticsMetricSummaryCards";
import { EventAttendanceChart } from "./EventAttendanceChart";

export const LogisticsDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-size240 h-[calc(100vh-7.5rem)] min-h-0">
      {/* Summary Cards */}
      <LogisticsMetricSummaryCards />

      {/* Main Content Grid */}
      <div className="flex-1 min-h-0">
        <EventAttendanceChart />
      </div>
    </div>
  );
};

export default LogisticsDashboard;
