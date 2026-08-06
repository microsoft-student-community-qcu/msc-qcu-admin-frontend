import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDashboardStats } from "@/features/hr/shared/hooks/useDashboardStats";

export const CampusDistributionChart: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const campusDistribution = stats?.campusDistribution || [];

  const campusData = React.useMemo(() => {
    const counts = {
      SAN_BARTOLOME_MAIN: 0,
      SAN_FRANCISCO: 0,
      BATASAN: 0,
    };

    campusDistribution.forEach((item: { campus: string; count: number }) => {
      if (item.campus in counts) {
        counts[item.campus as keyof typeof counts] += item.count;
      }
    });

    return [
      { campus: "San Bartolome", count: counts.SAN_BARTOLOME_MAIN, fill: "var(--color-chart-1)" },
      { campus: "San Francisco", count: counts.SAN_FRANCISCO, fill: "var(--color-chart-2)" },
      { campus: "Batasan", count: counts.BATASAN, fill: "var(--color-chart-3)" },
    ];
  }, [campusDistribution]);

  const chartConfig = {
    count: {
      label: "Members",
      color: "var(--color-primary)",
    },
  };

  return (
    <Card className="shadow-4 border-transparent bg-card flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0">
        <CardTitle>Campus Distribution</CardTitle>
        <CardDescription>Breakdown of active members by QCU Campus</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 min-h-0 flex flex-col justify-end">
        <ChartContainer config={chartConfig} className="aspect-auto flex-1 w-full min-h-0 max-h-[220px]">
          <BarChart data={campusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="campus" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={45} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CampusDistributionChart;
