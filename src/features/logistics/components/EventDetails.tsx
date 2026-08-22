import React, { useState } from "react";
import {
  CalendarRegular,
  LocationRegular,
  EditRegular,
  DeleteRegular,
  PeopleRegular,
  InfoRegular,
  GlobeRegular,
  LockClosedRegular,
  BuildingRegular,
  FullScreenMaximizeRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { EventItem, EventType } from "../types";
import { EventOverviewTab } from "./EventOverviewTab";
import { EventAttendeesTab } from "./EventAttendeesTab";
import { EditEventDialog } from "./EditEventDialog";
import { CancelEventDialog } from "./CancelEventDialog";
import { FullRosterView } from "./FullRosterView";

export interface EventDetailsProps {
  event: EventItem | null;
  isLoading: boolean;
  error?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onOpenFullRoster?: () => void;
}

function formatEventHeaderDate(dateStr: string): string {
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
    return `${dateFormatted} • ${timeFormatted}`;
  } catch {
    return dateStr;
  }
}

function renderEventTypeBadge(type: EventType) {
  switch (type) {
    case "PUBLIC":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[11px] font-medium py-0.5 px-2 rounded-none flex items-center gap-1"
        >
          <GlobeRegular className="size-3" />
          <span>Public</span>
        </Badge>
      );
    case "MEMBERS_ONLY":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[11px] font-medium py-0.5 px-2 rounded-none flex items-center gap-1"
        >
          <LockClosedRegular className="size-3" />
          <span>Members Only</span>
        </Badge>
      );
    default:
      return null;
  }
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  isLoading,
  error,
  onEdit,
  onCancel,
  onOpenFullRoster,
}) => {
  const [isInternalEditOpen, setIsInternalEditOpen] = useState(false);
  const [isInternalCancelOpen, setIsInternalCancelOpen] = useState(false);
  const [isInternalRosterOpen, setIsInternalRosterOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) onEdit();
    else setIsInternalEditOpen(true);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else setIsInternalCancelOpen(true);
  };

  const handleOpenRoster = () => {
    if (onOpenFullRoster) onOpenFullRoster();
    else setIsInternalRosterOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full min-h-0 bg-card shadow-4 ring-1 ring-foreground/10">
        {/* Header Skeleton */}
        <div className="p-size240 border-b border-border bg-muted/10 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="flex-1 p-size240 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-size320 text-muted-foreground text-center bg-card shadow-4 ring-1 ring-foreground/10 hover:bg-transparent cursor-default border-0 select-none">
        <WarningRegular className="w-12 h-12 mb-3 text-destructive" />
        <h3 className="text-base font-bold text-foreground">Backend Service Error</h3>
        <p className="text-sm max-w-xs mt-1">
          Could not fetch event logistics details. Please check the backend service.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-size320 text-muted-foreground text-center bg-card shadow-4 ring-1 ring-foreground/10 hover:bg-transparent cursor-default border-0 select-none">
        <CalendarRegular className="w-12 h-12 mb-3 text-muted-foreground/30" />
        <h3 className="text-base font-bold text-foreground">No Event Selected</h3>
        <p className="text-sm max-w-xs mt-1">
          Select an event from the master list to review logistics parameters, capacity metrics, and
          live attendee roster.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-card shadow-4 ring-1 ring-foreground/10">
      {/* Detail Header Section */}
      <div className="p-size240 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-size160 bg-muted/10 shrink-0">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-size80">
            <h2 className="text-xl font-bold text-foreground leading-tight truncate">
              {event.title}
            </h2>
            {renderEventTypeBadge(event.type)}
            {event.status === "ACTIVE" && (
              <Badge
                variant="outline"
                className={
                  event.registrationOpen
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                }
              >
                {event.registrationOpen ? "Active" : "Closed"}
              </Badge>
            )}
            {event.status === "CANCELLED" && (
              <Badge
                variant="outline"
                className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
              >
                Cancelled
              </Badge>
            )}
            {event.status === "COMPLETED" && (
              <Badge
                variant="outline"
                className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
              >
                Completed
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarRegular className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span>{formatEventHeaderDate(event.date)}</span>
            </div>

            {event.venue && (
              <div className="flex items-center gap-1.5">
                <LocationRegular className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span>{event.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenRoster}
            className="h-8 text-xs px-3 rounded-none font-medium gap-1.5 cursor-pointer shadow-1"
          >
            <FullScreenMaximizeRegular className="size-3.5 text-primary" />
            <span>Open Full Roster</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={event.status === "CANCELLED"}
            className="h-8 text-xs px-3 rounded-none font-medium gap-1.5 cursor-pointer shadow-1"
          >
            <EditRegular className="size-3.5" />
            <span>Edit</span>
          </Button>

          {event.status !== "CANCELLED" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              className="h-8 text-xs px-3 rounded-none font-medium gap-1.5 cursor-pointer shadow-1"
            >
              <DeleteRegular className="size-3.5" />
              <span>Cancel Event</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <div className="px-size240 pt-size120 border-b border-border bg-card shrink-0">
          <TabsList className="h-9 gap-1 bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground rounded-none after:hidden border-0 shadow-none px-3 py-1.5 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <InfoRegular className="size-3.5" />
              <span>Overview & Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="attendees"
              className="data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground rounded-none after:hidden border-0 shadow-none px-3 py-1.5 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <PeopleRegular className="size-3.5" />
              <span>Attendees & Approvals ({event.registeredCount})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 min-h-0 p-0 m-0">
          <EventOverviewTab
            event={event}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onOpenEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="attendees" className="flex-1 min-h-0 p-0 m-0 flex flex-col">
          <EventAttendeesTab
            eventId={event.id}
            event={event}
            onOpenFullRoster={handleOpenRoster}
          />
        </TabsContent>
      </Tabs>

      {/* Internal Dialog Fallbacks */}
      {!onEdit && (
        <EditEventDialog
          isOpen={isInternalEditOpen}
          onOpenChange={setIsInternalEditOpen}
          event={event}
        />
      )}

      {!onCancel && (
        <CancelEventDialog
          isOpen={isInternalCancelOpen}
          onOpenChange={setIsInternalCancelOpen}
          event={event}
        />
      )}

      {!onOpenFullRoster && (
        <FullRosterView
          isOpen={isInternalRosterOpen}
          onOpenChange={setIsInternalRosterOpen}
          event={event}
        />
      )}
    </div>
  );
};

export default EventDetails;
