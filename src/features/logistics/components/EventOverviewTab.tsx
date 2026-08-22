import React from "react";
import {
  CalendarRegular,
  CalendarClockRegular,
  ClockRegular,
  LocationRegular,
  PeopleRegular,
  PersonStarRegular,
  QrCodeRegular,
  LockClosedRegular,
  GlobeRegular,
  BuildingRegular,
  InfoRegular,
  CheckmarkCircleRegular,
  EditRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventItem, EventType } from "../types";
import { useEventMutations } from "../hooks/useEventMutations";

export interface EventOverviewTabProps {
  event: EventItem;
  onEdit?: () => void;
  onCancel?: () => void;
  onOpenEdit?: () => void;
}

function formatFullDateTime(dateStr?: string | null): string {
  if (!dateStr) return "Not specified";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dateFormatted = d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${dateFormatted} - ${timeFormatted}`;
  } catch {
    return dateStr;
  }
}

function getTimeWindowStatus(dateStr?: string | null): {
  label: string;
  variant: "active" | "upcoming" | "passed";
} {
  if (!dateStr) return { label: "N/A", variant: "passed" };
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  if (now >= target) {
    return { label: "Active", variant: "active" };
  }
  return { label: "Upcoming", variant: "upcoming" };
}

function renderEventTypeBadge(type: EventType) {
  switch (type) {
    case "PUBLIC":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-medium py-0.5 px-2 rounded-none flex items-center gap-1"
        >
          <GlobeRegular className="size-3.5" />
          <span>Public (Open to All)</span>
        </Badge>
      );
    case "MEMBERS_ONLY":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-medium py-0.5 px-2 rounded-none flex items-center gap-1"
        >
          <LockClosedRegular className="size-3.5" />
          <span>Members Only</span>
        </Badge>
      );
    default:
      return null;
  }
}

export const EventOverviewTab: React.FC<EventOverviewTabProps> = ({
  event,
  onEdit,
  onCancel,
  onOpenEdit,
}) => {
  const { updateEvent } = useEventMutations();

  const handleEditClick = () => {
    if (onEdit) onEdit();
    else if (onOpenEdit) onOpenEdit();
  };

  const handleToggleRegistration = (checked: boolean) => {
    updateEvent.mutate({
      eventId: event.id,
      data: { registrationOpen: checked },
    });
  };

  const attendanceRate =
    event.registeredCount > 0 ? Math.round((event.attendedCount / event.registeredCount) * 100) : 0;

  const capacityRate =
    event.maxCapacity > 0 ? Math.round((event.registeredCount / event.maxCapacity) * 100) : 0;

  const priorityWindow = getTimeWindowStatus(event.priorityStartDate);
  const generalWindow = getTimeWindowStatus(event.generalStartDate);

  return (
    <ScrollArea className="h-full">
      <div className="p-size240 space-y-size240">
        {/* Capacity & Attendance Metrics Grid */}
        <div>
          <div className="flex items-center gap-size60 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-size120">
            <PeopleRegular className="size-4 text-primary" />
            <span>Capacity & Attendance Metrics</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-size160">
            {/* Max Capacity */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Max Capacity</span>
                  <PeopleRegular className="size-3.5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-size160 space-y-2">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {event.maxCapacity}
                </div>
                <p className="text-[11px] text-muted-foreground">Threshold limit configured</p>
                <Progress value={100} className="h-1.5 w-full bg-muted/60" />
              </CardContent>
            </Card>

            {/* Confirmed Registrations */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Registered</span>
                  <CheckmarkCircleRegular className="size-3.5 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-size160 space-y-2">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {event.registeredCount}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {capacityRate}% capacity occupied
                </p>
                <Progress value={capacityRate} className="h-1.5 w-full bg-muted/60" />
              </CardContent>
            </Card>

            {/* Spots Remaining */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Spots Remaining</span>
                  <ClockRegular className="size-3.5 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-size160 space-y-2">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {event.spotsRemaining}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {event.spotsRemaining > 0 ? "Seats available" : "Capacity filled"}
                </p>
                <Progress
                  value={Math.max(0, 100 - capacityRate)}
                  className="h-1.5 w-full bg-muted/60"
                />
              </CardContent>
            </Card>

            {/* Check-In Headcount */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Checked In</span>
                  <CheckmarkCircleRegular className="size-3.5 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-size160 space-y-2">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {event.attendedCount}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {attendanceRate}% attendance turnout
                </p>
                <Progress value={attendanceRate} className="h-1.5 w-full bg-muted/60" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline & Registration Windows */}
        <div>
          <div className="flex items-center gap-size60 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-size120">
            <CalendarClockRegular className="size-4 text-primary" />
            <span>Timeline & Registration Schedule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-size160">
            {/* Member Priority Window */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <PersonStarRegular className="size-3.5 text-purple-500" />
                  <span>Member Priority Start</span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    priorityWindow.variant === "active"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] py-0 h-4 px-1 rounded-none"
                      : "bg-muted text-muted-foreground text-[10px] py-0 h-4 px-1 rounded-none"
                  }
                >
                  {priorityWindow.label}
                </Badge>
              </CardHeader>
              <CardContent className="p-size160">
                <div className="text-sm font-semibold text-foreground">
                  {formatFullDateTime(event.priorityStartDate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Early registration reserved for MSC community members.
                </p>
              </CardContent>
            </Card>

            {/* General Public Window */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <GlobeRegular className="size-3.5 text-blue-500" />
                  <span>General Public Start</span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    generalWindow.variant === "active"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] py-0 h-4 px-1 rounded-none"
                      : "bg-muted text-muted-foreground text-[10px] py-0 h-4 px-1 rounded-none"
                  }
                >
                  {generalWindow.label}
                </Badge>
              </CardHeader>
              <CardContent className="p-size160">
                <div className="text-sm font-semibold text-foreground">
                  {formatFullDateTime(event.generalStartDate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Open registration period for students and general attendees.
                </p>
              </CardContent>
            </Card>

            {/* Execution Date */}
            <Card className="shadow-2 border border-border rounded-none py-0 gap-0">
              <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <CalendarRegular className="size-3.5 text-primary" />
                  <span>Event Execution</span>
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 text-[10px] py-0 h-4 px-1 rounded-none"
                >
                  Execution
                </Badge>
              </CardHeader>
              <CardContent className="p-size160">
                <div className="text-sm font-semibold text-foreground">
                  {formatFullDateTime(event.date)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled time for live event execution and attendee admission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Specification & Operational Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-size160 items-start">
          {/* Description & Venue Details (8 cols) */}
          <Card className="lg:col-span-8 shadow-2 border border-border rounded-none py-0 gap-0">
            <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <InfoRegular className="size-3.5 text-primary" />
                <span>Event Information & Logistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-size160 space-y-size160 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Description
                </span>
                <p className="text-foreground leading-normal whitespace-pre-wrap">
                  {event.description || "No description provided for this event."}
                </p>
              </div>

              <div className="pt-size120 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-size160">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <LocationRegular className="size-3.5" />
                    <span>Venue Location</span>
                  </span>
                  <p className="text-foreground font-medium">
                    {event.venue || "Online / To be announced"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <InfoRegular className="size-3.5" />
                    <span>Audience Eligibility</span>
                  </span>
                  <div>{renderEventTypeBadge(event.type)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Switches & Controls (4 cols) */}
          <Card className="lg:col-span-4 shadow-2 border border-border rounded-none py-0 gap-0">
            <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <QrCodeRegular className="size-3.5 text-primary" />
                <span>Operational Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-size160 space-y-size160 text-xs">
              {/* Registration Open Switch */}
              <div className="flex items-center justify-between gap-size80 p-size120 bg-muted/30 border border-border/60">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="toggle-reg-open"
                    className="text-xs font-semibold block cursor-pointer"
                  >
                    Registration Open
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {event.registrationOpen
                      ? "Accepting public submissions"
                      : "Submissions currently locked"}
                  </p>
                </div>
                <Switch
                  id="toggle-reg-open"
                  checked={event.registrationOpen}
                  onCheckedChange={handleToggleRegistration}
                  disabled={updateEvent.isPending || event.status === "CANCELLED"}
                />
              </div>

              {/* QR Ticket Verification Status */}
              <div className="p-size120 bg-muted/30 border border-border/60 space-y-1">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <QrCodeRegular className="size-3.5 text-primary" />
                  <span>QR Ticket Validation</span>
                </span>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  {event.requiresQrTicket
                    ? "Registrants receive a scannable QR ticket email required for door admission."
                    : "Standard registration list verification without automated QR passes."}
                </p>
              </div>

              {/* Unique Event Reference ID */}
              <div className="p-size120 bg-muted/30 border border-border/60 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Event Reference ID
                </span>
                <p
                  className="font-mono text-xs text-foreground truncate select-all"
                  title={event.id}
                >
                  {event.id}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-size80 border-t border-border/60 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  disabled={event.status === "CANCELLED"}
                  className="flex-1 h-8 text-xs rounded-none font-medium gap-1.5 cursor-pointer shadow-1"
                >
                  <EditRegular className="size-3.5" />
                  <span>Edit Event</span>
                </Button>
                {event.status !== "CANCELLED" && onCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onCancel}
                    className="h-8 text-xs px-2.5 rounded-none font-medium gap-1 cursor-pointer shadow-1"
                    title="Cancel Event"
                  >
                    <DeleteRegular className="size-3.5" />
                    <span>Cancel</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default EventOverviewTab;
