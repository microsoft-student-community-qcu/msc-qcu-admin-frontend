import React from "react";
import { HrMetricSummaryCards } from "./HrMetricSummaryCards";
import { ApplicationGrowthChart } from "./ApplicationGrowthChart";
import { DepartmentDistributionChart } from "./DepartmentDistributionChart";
import { RecentApplicationsList } from "./RecentApplicationsList";
import { PendingReviewQueue } from "./PendingReviewQueue";
import { CampusDistributionChart } from "./CampusDistributionChart";

export const HrDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-size240 h-[calc(100vh-7.5rem)] min-h-0">
      {/* Summary Cards */}
      <HrMetricSummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-size240 flex-1 min-h-0">
        {/* Row 1 Left Side: Equal-width Charts Container */}
        <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-5 gap-size240 min-h-0">
          <ApplicationGrowthChart />
          <DepartmentDistributionChart />
        </div>

        {/* Right Sidebar: Recent Applications */}
        <RecentApplicationsList />

        {/* Row 2: Pending queue & campus distribution */}
        <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-2 gap-size240 min-h-0">
          <PendingReviewQueue />
          <CampusDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
