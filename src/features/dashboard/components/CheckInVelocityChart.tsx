import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { checkInVelocityData, checkInChartConfig } from "@/mocks/dashboard";

export const CheckInVelocityChart: React.FC = () => {
  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0 pb-size120">
        <CardTitle>Check-In Velocity</CardTitle>
        <CardDescription>Attendee arrivals timeline (peak hour check-ins)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-size160 min-h-0 flex flex-col justify-center">
        <ChartContainer
          config={checkInChartConfig}
          className="aspect-auto flex-1 w-full h-full min-h-0"
        >
          <LineChart
            data={checkInVelocityData}
            margin={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 24,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="var(--color-arrivals)"
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CheckInVelocityChart;
