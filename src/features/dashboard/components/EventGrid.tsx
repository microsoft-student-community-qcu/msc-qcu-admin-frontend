import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarRegular } from "@fluentui/react-icons";
import { recentEvents } from "@/mocks/dashboard";

export const EventGrid: React.FC = () => {
  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full lg:col-span-2 min-h-0">
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming & Recent Events</CardTitle>
            <CardDescription>Events schedule and history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-size160 flex-1 min-h-0">
          {recentEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="group flex flex-col overflow-hidden border border-border bg-card hover:bg-muted/50 shadow-2 h-full"
            >
              <div className="flex-1 min-h-[60px] max-h-[140px] w-full overflow-hidden bg-muted border-b border-border">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between p-4 shrink-0">
                <div className="mb-3">
                  <p className="font-semibold leading-none text-foreground">{event.name}</p>
                  <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <CalendarRegular className="w-4 h-4 shrink-0 text-muted-foreground" />
                    {event.date}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {event.attendees} attendees
                  </span>
                  <Badge
                    variant={event.status === "Upcoming" ? "default" : "outline"}
                    className={
                      event.status === "Upcoming" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventGrid;
