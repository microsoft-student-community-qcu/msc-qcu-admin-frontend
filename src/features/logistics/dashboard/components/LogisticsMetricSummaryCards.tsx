import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarRegular,
  PulseRegular,
  ArrowDownRightRegular,
} from "@fluentui/react-icons";
import { useApplicantCounts } from "@/features/hr/shared/hooks/useApplicantCounts";
import { useEvents } from "../../hooks/useEvents";

export const LogisticsMetricSummaryCards: React.FC = () => {
  const { data: counts, isLoading: isApplicantsLoading } = useApplicantCounts();
  const { data: events, isLoading: isEventsLoading } = useEvents();

  const activeMembers = counts ? counts.APPROVED : 0;
  const upcomingCount = events ? events.length : 0;

  const nextEventText = React.useMemo(() => {
    if (!events || events.length === 0) return "No upcoming events scheduled";
    const now = new Date();
    
    // Find the next upcoming event (events are sorted asc by backend)
    const nextEvent = events[0];
    const eventDate = new Date(nextEvent.date);
    
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return "Next event is today";
    } else if (diffDays === 1) {
      return "Next event tomorrow";
    } else {
      return `Next event in ${diffDays} days`;
    }
  }, [events]);

  const isLoading = isApplicantsLoading || isEventsLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-size240 shrink-0">
      {/* Upcoming Events */}
      <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <CalendarRegular className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="z-10 relative">
          <div className="text-2xl font-bold">{isEventsLoading ? "..." : upcomingCount}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {nextEventText}
          </p>
        </CardContent>
      </Card>

      {/* Active Members */}
      <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <PulseRegular className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="z-10 relative">
          <div className="text-2xl font-bold">{isLoading ? "..." : activeMembers}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowDownRightRegular className="w-4 h-4 text-red-500 mr-1 shrink-0" />
            <span className="text-red-500 font-medium">-2%</span>&nbsp;from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsMetricSummaryCards;
