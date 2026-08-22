import * as React from "react";
import {
  SearchRegular,
  AddRegular,
  CalendarRegular,
  LocationRegular,
  PeopleRegular,
  EditRegular,
  DeleteRegular,
  FilterRegular,
} from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvents } from "../hooks/useEvents";
import { useEventMutations } from "../hooks/useEventMutations";
import type { EventItem, EventType } from "../types";
import { CreateEventDialog } from "./CreateEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { CancelEventDialog } from "./CancelEventDialog";
import { EventDrawer } from "./EventDrawer";
import { useAuthStore } from "@/store/useAuthStore";

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

export function EventsDataTable() {
  const userRole = useAuthStore((s) => s.user?.role);
  const isSuperAdminOrHead =
    userRole === "SUPERADMIN" || userRole === "ADMIN_LOGISTICS_HEAD";

  const {
    events,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
  } = useEvents({ all: true });

  const { updateEvent } = useEventMutations();

  // Selected event for slide-over drawer
  const [drawerEvent, setDrawerEvent] = React.useState<EventItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<EventItem | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [cancelingEvent, setCancelingEvent] = React.useState<EventItem | null>(null);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);

  const handleOpenDrawer = (event: EventItem) => {
    setDrawerEvent(event);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, event: EventItem) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsEditOpen(true);
  };

  const handleCancelClick = (e: React.MouseEvent, event: EventItem) => {
    e.stopPropagation();
    setCancelingEvent(event);
    setIsCancelOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-card shadow-4 ring-1 ring-foreground/10 overflow-hidden">
      {/* Header Toolbar */}
      <div className="p-size160 border-b border-border/60 bg-muted/10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size120">
        <div className="flex flex-1 items-center gap-size120 max-w-xl">
          <div className="relative flex-1">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, venue, or description..."
              className="pl-9 h-9 text-xs rounded-none bg-background placeholder:text-muted-foreground"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs gap-1.5 rounded-none shrink-0 font-medium cursor-pointer"
                >
                  <FilterRegular className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {typeFilter === "ALL"
                      ? "All Types"
                      : TYPE_CONFIG[typeFilter]?.label || typeFilter}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="rounded-none shadow-8 w-44">
              <DropdownMenuRadioGroup
                value={typeFilter}
                onValueChange={(val) => setTypeFilter(val as EventType | "ALL")}
              >
                <DropdownMenuRadioItem value="ALL" className="text-xs rounded-none">
                  All Types
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="PUBLIC" className="text-xs rounded-none">
                  Public
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="MEMBERS_ONLY" className="text-xs rounded-none">
                  Members Only
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="QCU_STUDENTS_ONLY" className="text-xs rounded-none">
                  QCU Students
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-4 text-xs font-medium rounded-none gap-1.5 shrink-0 bg-primary text-primary-foreground shadow-2 cursor-pointer"
        >
          <AddRegular className="w-4 h-4" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-auto min-h-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/40 border-b border-border/60 shadow-1">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event & Venue
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </TableHead>
              <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date & Schedule
              </TableHead>
              <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Occupancy / Capacity
              </TableHead>
              <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Registration
              </TableHead>
              <TableHead className="w-[160px] text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-size240">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="h-16">
                  <TableCell>
                    <Skeleton className="h-4 w-44 mb-1.5" />
                    <Skeleton className="h-3 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-2.5 w-full mb-1.5" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-10 mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent cursor-default border-0">
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <PeopleRegular className="w-10 h-10 text-muted-foreground/30" />
                    <span className="text-sm font-semibold text-foreground">
                      Failed to load events
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Unable to retrieve event logistics data.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="rounded-none text-xs h-8 cursor-pointer mt-1"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow className="hover:bg-transparent cursor-default border-0">
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <CalendarRegular className="w-10 h-10 text-muted-foreground/30" />
                    <span className="text-sm font-semibold text-foreground">No events found</span>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {search || typeFilter !== "ALL"
                        ? "Try clearing your search query or filter options."
                        : "Create your first community event to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const typeInfo = TYPE_CONFIG[event.type] || {
                  label: event.type,
                  className: "border-border text-xs font-medium",
                };
                const percent = Math.min(
                  100,
                  Math.round(((event.registeredCount || 0) / (event.maxCapacity || 1)) * 100),
                );
                const isCancelled = event.status === "CANCELLED";

                return (
                  <TableRow
                    key={event.id}
                    onClick={() => handleOpenDrawer(event)}
                    className="cursor-pointer hover:bg-muted/40 transition-colors h-16 group"
                  >
                    {/* Event & Venue */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {event.title}
                        </span>
                        {event.venue && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <LocationRegular className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
                            <span className="truncate max-w-[240px]">{event.venue}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Event Type */}
                    <TableCell>
                      <Badge variant="outline" className={typeInfo.className}>
                        {typeInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <CalendarRegular className="w-3.5 h-3.5 text-primary shrink-0" />
                          {new Date(event.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground pt-0.5">
                          {new Date(event.date).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* Occupancy / Capacity */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {event.registeredCount || 0} / {event.maxCapacity}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground font-medium">
                            {percent}%
                          </span>
                        </div>
                        <Progress value={percent} className="h-1.5 rounded-none" />
                        <span className="text-xs text-muted-foreground block pt-0.5">
                          {event.spotsRemaining > 0
                            ? `${event.spotsRemaining} spots available`
                            : "Capacity full"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Registration Toggle */}
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <Switch
                          checked={event.registrationOpen && !isCancelled}
                          disabled={isCancelled || updateEvent.isPending}
                          onCheckedChange={() => {
                            updateEvent.mutate({
                              eventId: event.id,
                              data: {
                                registrationOpen: !event.registrationOpen,
                              },
                            });
                          }}
                          className="scale-90"
                        />
                        <span className="text-xs text-muted-foreground font-medium hidden md:inline">
                          {event.registrationOpen && !isCancelled ? "Open" : "Closed"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-size240" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDrawer(event)}
                          className="h-8 px-2.5 text-xs font-medium gap-1 text-primary hover:text-primary hover:bg-primary/10 rounded-none cursor-pointer"
                        >
                          <PeopleRegular className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">Attendees</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEditClick(e, event)}
                          disabled={isCancelled}
                          title="Edit Event"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none cursor-pointer"
                        >
                          <EditRegular className="w-3.5 h-3.5" />
                        </Button>

                        {isSuperAdminOrHead && !isCancelled && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleCancelClick(e, event)}
                            title="Cancel Event"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-none cursor-pointer"
                          >
                            <DeleteRegular className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Slide-Over Attendee Drawer */}
      <EventDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        event={drawerEvent}
      />

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Edit Event Dialog */}
      <EditEventDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        event={editingEvent}
      />

      {/* Cancel Event Dialog */}
      <CancelEventDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        event={cancelingEvent}
      />
    </div>
  );
}

export default EventsDataTable;
