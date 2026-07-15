import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { eventRatingsData, eventRatingsConfig } from "@/mocks/dashboard";

export const EventRatingsChart: React.FC = () => {
  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0 pb-size80">
        <CardTitle>Event Feedback Ratings</CardTitle>
        <CardDescription>Attendee satisfaction scores (all events combined)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-size160 min-h-0 flex flex-col justify-center">
        <ChartContainer
          config={eventRatingsConfig}
          className="aspect-auto flex-1 w-full h-full min-h-0"
        >
          <BarChart
            data={eventRatingsData}
            layout="vertical"
            margin={{
              left: 10,
              right: 30, // Extra right margin for labels
              top: 10,
              bottom: 10,
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="rating"
              type="category"
              tickLine={false}
              axisLine={false}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-primary)" radius={4}>
              <LabelList
                dataKey="count"
                position="right"
                className="fill-foreground text-[10px] font-semibold"
                offset={8}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EventRatingsChart;
