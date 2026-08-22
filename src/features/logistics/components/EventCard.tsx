import React from "react";
import {
  CalendarRegular,
  LocationRegular,
  PeopleRegular,
  LockClosedRegular,
  GlobeRegular,
  BuildingRegular,
} from "@fluentui/react-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { EventItem, EventType } from "../types";

export interface EventCardProps {
  event: EventItem;
  isSelected: boolean;
  onSelect: () => void;
}

function formatEventDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dateFormatted = d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${dateFormatted} at ${timeFormatted}`;
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
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1"
        >
          <GlobeRegular className="size-3" />
          <span>Public</span>
        </Badge>
      );
    case "MEMBERS_ONLY":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1"
        >
          <LockClosedRegular className="size-3" />
          <span>Members Only</span>
        </Badge>
      );
    default:
      return null;
  }
}

export const EventCard: React.FC<EventCardProps> = ({ event, isSelected, onSelect }) => {
  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / Math.max(1, event.maxCapacity)) * 100),
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-size160 flex flex-col gap-size80 transition-colors border-l-2 cursor-pointer relative",
        isSelected
          ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-primary/40 shadow-2 border-l-primary"
          : "hover:bg-muted/40 border-l-transparent bg-transparent",
      )}
    >
      {/* Top Header: Title and Status Badge */}
      <div className="flex items-start justify-between gap-size80">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground leading-snug">
            {event.title}
          </h4>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {event.status === "ACTIVE" && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium py-0 h-5 px-1.5 rounded-none",
                event.registrationOpen
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
              )}
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
      </div>

      {/* Badges & Date Info */}
      <div className="flex flex-wrap items-center gap-size60">
        {renderEventTypeBadge(event.type)}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarRegular className="size-3.5 shrink-0" />
          <span className="truncate">{formatEventDate(event.date)}</span>
        </div>
      </div>

      {/* Venue / Location */}
      {event.venue && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          <LocationRegular className="size-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{event.venue}</span>
        </div>
      )}

      {/* Capacity Progress Meter */}
      <div className="space-y-size40 pt-size40">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            <PeopleRegular className="size-3 text-muted-foreground/70" />
            <span>
              {event.registeredCount} / {event.maxCapacity}
            </span>
          </span>
          <span className="font-mono text-[11px]">
            {event.spotsRemaining > 0 ? `${event.spotsRemaining} spots left` : "Full"}
          </span>
        </div>
        <Progress value={percentFilled} className="h-1.5 w-full bg-muted/60" />
      </div>
    </button>
  );
};

export default EventCard;
