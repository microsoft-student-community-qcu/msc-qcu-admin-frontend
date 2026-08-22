import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarRegular,
  LocationRegular,
  PeopleRegular,
  EditRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  ImageRegular,
} from "@fluentui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import type { EventItem, EventType } from "../types";
import { useEventMutations } from "../hooks/useEventMutations";
import { useAuthStore } from "@/store/useAuthStore";

interface EventGridCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onCancel: (event: EventItem) => void;
}

const TYPE_CONFIG: Record<
  EventType,
  { label: string; className: string }
> = {
  PUBLIC: {
    label: "Public",
    className: "border-sky-500/40 text-sky-700 dark:text-sky-300 bg-sky-500/10 rounded-none text-xs font-medium",
  },
  MEMBERS_ONLY: {
    label: "Members Only",
    className: "border-primary/40 text-primary bg-primary/10 rounded-none text-xs font-medium",
  },
};

export const EventGridCard: React.FC<EventGridCardProps> = ({
  event,
  onEdit,
  onCancel,
}) => {
  const userRole = useAuthStore((s) => s.user?.role);
  const isSuperAdminOrHead =
    userRole === "SUPERADMIN" || userRole === "ADMIN_LOGISTICS_HEAD";

  const { updateEvent } = useEventMutations();

  const typeInfo = TYPE_CONFIG[event.type] || {
    label: event.type,
    className: "border-border text-xs font-medium",
  };

  const percent = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.maxCapacity || 1)) * 100),
  );

  const isCancelled = event.status === "CANCELLED";
  const isRegOpen = !isCancelled && (event.registrationOpen ?? true);

  return (
    <Card className="rounded-none border-transparent bg-card shadow-4 hover:shadow-8 transition-all duration-200 flex flex-col justify-between group py-0 gap-0 overflow-hidden">
      {/* Top Cover Image / Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-muted/40 border-b border-border/40 shrink-0">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-muted/40">
            <CalendarRegular className="size-12 text-primary/30" />
          </div>
        )}

        {/* Overlay Badges on Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="outline"
            className={`${typeInfo.className} shadow-1 bg-background/95 backdrop-blur-sm`}
          >
            {typeInfo.label}
          </Badge>

          {isCancelled ? (
            <Badge
              variant="destructive"
              className="text-xs font-medium rounded-none shadow-1 bg-destructive/95 backdrop-blur-sm"
            >
              Cancelled
            </Badge>
          ) : isRegOpen ? (
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-background/95 backdrop-blur-sm text-xs font-medium rounded-none shadow-1"
            >
              Registration Open
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground bg-background/95 backdrop-blur-sm text-xs font-medium rounded-none shadow-1"
            >
              Registration Closed
            </Badge>
          )}
        </div>

        {/* Options Menu on Top-Right */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-foreground bg-background/80 hover:bg-background backdrop-blur-sm rounded-none shadow-1 cursor-pointer"
                  title="Event Options"
                >
                  <MoreHorizontalRegular className="w-4 h-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="rounded-none shadow-8 w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onEdit(event)}
                  disabled={isCancelled}
                  className="text-xs rounded-none cursor-pointer gap-2"
                >
                  <EditRegular className="w-4 h-4" />
                  <span>Edit Event</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      to="/events/registrations"
                      className="text-xs rounded-none cursor-pointer flex items-center gap-2 w-full"
                    >
                      <PeopleRegular className="w-4 h-4" />
                      <span>View Registrations</span>
                    </Link>
                  }
                />

                {isSuperAdminOrHead && !isCancelled && (
                  <DropdownMenuItem
                    onClick={() => onCancel(event)}
                    className="text-xs rounded-none cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <DeleteRegular className="w-4 h-4" />
                    <span>Cancel Event</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Details Body */}
      <CardContent className="px-size160 pt-size100 pb-size160 space-y-size100">
        {/* Title & Description */}
        <div>
          <h3
            className="font-bold text-base text-foreground truncate leading-snug group-hover:text-primary transition-colors cursor-pointer"
            title={event.title}
            onClick={() => onEdit(event)}
          >
            {event.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {event.description || "No description provided for this event."}
          </p>
        </div>

        {/* Date & Venue Info */}
        <div className="space-y-1.5 pt-size80 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarRegular className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-muted-foreground/80">
              • {new Date(event.date).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2">
              <LocationRegular className="w-4 h-4 text-muted-foreground/70 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
        </div>

        {/* Capacity Meter */}
        <div className="space-y-1 bg-muted/20 p-size120 border border-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Occupancy</span>
            <span className="font-mono font-semibold text-foreground">
              {event.registeredCount || 0} / {event.maxCapacity} ({percent}%)
            </span>
          </div>
          <Progress value={percent} className="h-1.5 rounded-none bg-muted" />
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
            <span>
              {event.spotsRemaining > 0
                ? `${event.spotsRemaining} spots left`
                : "Capacity full"}
            </span>
            {event.attendedCount > 0 && (
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                {event.attendedCount} attended
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <div
        data-slot="card-footer"
        className="border-t border-border/60 p-size120 bg-muted/10 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <Switch
            checked={isRegOpen}
            disabled={isCancelled || updateEvent.isPending}
            onCheckedChange={() => {
              updateEvent.mutate({
                eventId: event.id,
                data: {
                  registrationOpen: !isRegOpen,
                },
              });
            }}
            className="scale-90"
          />
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Registration
          </span>
        </div>

        <Link
          to="/events/registrations"
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-1 transition-colors gap-1.5 cursor-pointer select-none"
        >
          <PeopleRegular className="size-3.5" />
          <span>Registrations ({event.registeredCount || 0})</span>
        </Link>
      </div>
    </Card>
  );
};

export default EventGridCard;
