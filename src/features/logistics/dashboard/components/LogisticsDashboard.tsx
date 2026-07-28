import React from "react";
import { LogisticsMetricSummaryCards } from "./LogisticsMetricSummaryCards";
import { EventAttendanceChart } from "./EventAttendanceChart";
import { EventRatingsChart } from "./EventRatingsChart";

export const LogisticsDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-size240 h-[calc(100vh-7.5rem)] min-h-0">
      {/* Summary Cards */}
      <LogisticsMetricSummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-size240 flex-1 min-h-0">
        {/* Graphs */}
        <div className="lg:col-span-2">
          <EventAttendanceChart />
        </div>
        <EventRatingsChart />
      </div>
    </div>
  );
};

export default LogisticsDashboard;
