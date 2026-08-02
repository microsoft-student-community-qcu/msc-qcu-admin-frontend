import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEvents } from "../../hooks/useEvents";

const eventChartConfig = {
  registered: {
    label: "Registered",
    color: "var(--color-primary)",
  },
  attended: {
    label: "Attended (Checked In)",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export const EventAttendanceChart: React.FC = () => {
  const { data: events = [], isLoading, error } = useEvents(true);

  const chartData = React.useMemo(() => {
    return events.map((evt) => ({
      event: evt.title,
      registered: evt.registeredCount,
      attended: evt.attendedCount,
    }));
  }, [events]);

  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0 pb-size120">
        <CardTitle>Event Attendance & Check-Ins</CardTitle>
        <CardDescription>
          Comparison of registrations vs actual check-ins for recent events
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-size160 min-h-0 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-xs text-muted-foreground animate-pulse">Loading chart...</span>
          </div>
        ) : error ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-xs text-destructive">Failed to load chart data</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-xs text-muted-foreground">No events found</span>
          </div>
        ) : (
          <ChartContainer
            config={eventChartConfig}
            className="aspect-auto flex-1 w-full h-full min-h-0"
          >
            <BarChart
              data={chartData}
              margin={{
                left: 0,
                right: 0,
                top: 10,
                bottom: 24,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="event" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="registered"
                fill="var(--color-registered)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="attended"
                fill="var(--color-attended)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EventAttendanceChart;
