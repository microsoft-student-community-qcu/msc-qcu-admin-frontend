import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { applicationsData, appChartConfig } from "@/mocks/dashboard";

export const ApplicationGrowthChart: React.FC = () => {
  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0 md:col-span-3">
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
