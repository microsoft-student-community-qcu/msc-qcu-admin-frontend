import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboardStats } from "@/features/hr/shared/hooks/useDashboardStats";

const appChartConfig = {
  apps: {
    label: "Applications",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export const ApplicationGrowthChart: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const applicationGrowth = stats?.applicationGrowth || [];

  const applicationsData = React.useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return applicationGrowth.map((item) => {
      const [_, monthStr] = item.month.split("-");
      const monthIdx = parseInt(monthStr, 10) - 1;
      const monthLabel = months[monthIdx] || item.month;

      return {
        month: monthLabel,
        apps: item.count,
      };
    });
  }, [applicationGrowth]);
  return (
    <Card className="shadow-4 border-transparent bg-card flex flex-col h-full min-h-0 md:col-span-3">
      <CardHeader className="shrink-0">
        <CardTitle>Application Growth</CardTitle>
        <CardDescription>Showing total applications for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 min-h-0 flex flex-col">
        <ChartContainer config={appChartConfig} className="aspect-auto flex-1 w-full min-h-0">
          <AreaChart
            data={applicationsData}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="apps"
              fill="var(--color-apps)"
              fillOpacity={0.2}
              stroke="var(--color-apps)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ApplicationGrowthChart;
