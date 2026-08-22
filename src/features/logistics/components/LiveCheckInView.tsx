import * as React from "react";
import {
  SearchRegular,
  LocationRegular,
  CalendarRegular,
  CheckmarkCircleRegular,
  ArrowClockwiseRegular,
  PeopleRegular,
  PeopleCheckmarkRegular,
  ClockRegular,
  ArrowTrendingRegular,
} from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import { useEventMutations } from "../hooks/useEventMutations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { EventRegistration, RegistrationStatus } from "../types";

const STATUS_CONFIG: Record<
  RegistrationStatus,
  { label: string; className: string }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-none text-xs font-medium",
  },
  APPROVED: {
    label: "Approved",
    className: "border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-none text-xs font-medium",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-destructive/40 text-destructive bg-destructive/10 rounded-none text-xs font-medium",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-muted-foreground/40 text-muted-foreground bg-muted/20 rounded-none text-xs font-medium",
  },
};

export function LiveCheckInView() {
  const { events, isLoading: isEventsLoading } = useEvents({ all: false });
  const [selectedEventId, setSelectedEventId] = React.useState<string>("");
  const [lastCheckedInId, setLastCheckedInId] = React.useState<string | null>(
    null,
  );
  const [flashMessage, setFlashMessage] = React.useState<{
    name: string;
    studentId: string | null;
    time: string;
  } | null>(null);

  // Select first active event by default
  React.useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const activeEvent = React.useMemo(
    () => events.find((e) => e.id === selectedEventId) || null,
    [events, selectedEventId],
  );

  const {
    registrations,
    isLoading: isRegsLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    search,
    setSearch,
    refetch,
  } = useEventRegistrations({
    eventId: selectedEventId || undefined,
    initialStatus: "APPROVED",
    pageSize: 50,
  });

  const { checkIn } = useEventMutations();

  const sentinelRef = React.useRef<HTMLTableRowElement>(null);
  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  // Calculate live statistics
  const currentAttended = activeEvent?.attendedCount ?? 0;
  const currentCapacity = activeEvent?.maxCapacity ?? 1;
  const currentRegistered = activeEvent?.registeredCount ?? 0;
  const expectedRemaining = Math.max(0, currentRegistered - currentAttended);

  const turnoutRate =
    currentRegistered > 0
      ? Math.min(100, Math.round((currentAttended / currentRegistered) * 100))
      : 0;

  const capacityRate =
    currentCapacity > 0
      ? Math.min(100, Math.round((currentAttended / currentCapacity) * 100))
      : 0;

  const handleCheckIn = (reg: EventRegistration) => {
    if (!selectedEventId) return;

    checkIn.mutate(
      {
        eventId: selectedEventId,
        registrationId: reg.id,
      },
      {
        onSuccess: () => {
          setLastCheckedInId(reg.id);
          setFlashMessage({
            name: reg.name,
            studentId: reg.studentId ?? null,
            time: new Date().toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
        },
      },
    );
  };

  // Keyboard shortcut: Press Enter to check in if exactly 1 registrant matches
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && registrations.length === 1) {
      const singleAttendee = registrations[0];
      if (!singleAttendee.hasAttended) {
        handleCheckIn(singleAttendee);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-card shadow-4 ring-1 ring-foreground/10 overflow-hidden">
      {/* Top Event Selection Bar */}
      <div className="p-size160 border-b border-border bg-muted/10 shrink-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-size160">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-size160 flex-1">
          <div className="flex items-center gap-2">
            <PeopleCheckmarkRegular className="size-5 text-primary shrink-0" />
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              Check-In Desk:
            </span>
          </div>

          <Select
            value={selectedEventId}
            onValueChange={(val) => {
              if (val) {
                setSelectedEventId(val);
                setFlashMessage(null);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-80 !h-9 text-xs sm:text-sm font-semibold rounded-none bg-background border-input">
              <SelectValue placeholder="Select active event...">
                {activeEvent?.title || "Select active event..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none shadow-8 max-h-64 w-80">
              {events.map((evt) => (
                <SelectItem
                  key={evt.id}
                  value={evt.id}
                  className="text-xs rounded-none cursor-pointer"
                >
                  {evt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeEvent && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <Badge
                variant="outline"
                className="text-xs font-medium rounded-none border-primary/40 text-primary bg-primary/10"
              >
                {activeEvent.type.replace(/_/g, " ")}
              </Badge>

              {activeEvent.venue && (
                <span className="flex items-center gap-1">
                  <LocationRegular className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{activeEvent.venue}</span>
                </span>
              )}

              <span className="flex items-center gap-1">
                <CalendarRegular className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  {new Date(activeEvent.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-3 text-xs rounded-none gap-1.5 font-medium cursor-pointer"
            title="Refresh"
          >
            <ArrowClockwiseRegular
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* 4-Column Live KPI Metric Dashboard Row */}
      {activeEvent && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-size160 p-size160 border-b border-border bg-muted/5 shrink-0">
          {/* Stat 1: Checked In */}
          <div className="p-size120 bg-card border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Checked In</span>
              <PeopleCheckmarkRegular className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {currentAttended}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                / {currentCapacity}
              </span>
            </div>
            <Progress value={capacityRate} className="h-1 w-full bg-muted rounded-none" />
            <div className="text-[10px] text-muted-foreground pt-0.5">
              {capacityRate}% venue capacity filled
            </div>
          </div>

          {/* Stat 2: Confirmed Registrations */}
          <div className="p-size120 bg-card border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed Regs</span>
              <PeopleRegular className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xl font-bold font-mono text-foreground">
              {currentRegistered}
            </div>
            <div className="text-[10px] text-muted-foreground pt-1.5">
              Approved attendee tickets
            </div>
          </div>

          {/* Stat 3: Expected Remaining */}
          <div className="p-size120 bg-card border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Arrival</span>
              <ClockRegular className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-foreground">
              {expectedRemaining}
            </div>
            <div className="text-[10px] text-muted-foreground pt-1.5">
              Expected attendees remaining
            </div>
          </div>

          {/* Stat 4: Turnout Rate */}
          <div className="p-size120 bg-card border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Turnout Rate</span>
              <ArrowTrendingRegular className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-bold font-mono text-primary">
              {turnoutRate}%
            </div>
            <div className="text-[10px] text-muted-foreground pt-1.5">
              Arrivals vs confirmed list
            </div>
          </div>
        </div>
      )}

      {/* Rapid Search & Verification Toolbar */}
      <div className="p-size160 border-b border-border bg-muted/5 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size120">
        <div className="relative flex-1 max-w-xl">
          <SearchRegular className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rapid lookup: type Student ID (e.g. 23-1178) or Name (Press Enter to Check In)..."
            className="pl-10 h-10 rounded-none bg-background text-sm font-medium"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-size120 justify-between sm:justify-end">
          {flashMessage && (
            <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckmarkCircleRegular className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified: {flashMessage.name}{" "}
                {flashMessage.studentId ? `(${flashMessage.studentId})` : ""} at{" "}
                {flashMessage.time}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Attendee Roster Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-card [&_tr]:border-0 [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-card [&_th]:border-b [&_th]:border-border [&_th]:shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px] pl-size200 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attendee Name
              </TableHead>
              <TableHead className="w-[150px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student ID
              </TableHead>
              <TableHead className="w-[220px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="w-[140px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Affiliation
              </TableHead>
              <TableHead className="w-[140px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registration Status
              </TableHead>
              <TableHead className="w-[180px] pr-size200 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Check-In Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isRegsLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="h-16">
                  <TableCell className="pl-size200">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-none" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="pr-size200 text-right">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent cursor-default border-0">
                <TableCell
                  colSpan={6}
                  className="h-64 text-center text-muted-foreground text-xs"
                >
                  Failed to load attendee roster. Please check your connection.
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow className="hover:bg-transparent cursor-default border-0">
                <TableCell
                  colSpan={6}
                  className="h-64 text-center text-muted-foreground text-xs"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PeopleRegular className="w-10 h-10 text-muted-foreground/30" />
                    <span className="text-sm font-semibold text-foreground">
                      No approved attendees found
                    </span>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {search
                        ? "No attendees match your search query."
                        : "There are no approved attendees for this event yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => {
                const statusInfo =
                  STATUS_CONFIG[reg.status as RegistrationStatus] || {
                    label: String(reg.status),
                    className: "border-border text-xs font-medium",
                  };

                const isRecentlyCheckedIn = lastCheckedInId === reg.id;

                return (
                  <TableRow
                    key={reg.id}
                    className={`h-16 transition-colors ${
                      isRecentlyCheckedIn
                        ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Attendee Name */}
                    <TableCell className="pl-size200">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-none border border-primary/20 shrink-0">
                          <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xs font-bold">
                            {reg.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {reg.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Student ID */}
                    <TableCell className="px-size160">
                      <span className="font-mono text-xs text-foreground font-medium bg-muted/40 px-2 py-1 border border-border/50">
                        {reg.studentId || "N/A"}
                      </span>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-size160 text-xs text-muted-foreground">
                      {reg.email}
                    </TableCell>

                    {/* Affiliation */}
                    <TableCell className="px-size160">
                      {reg.isMember ? (
                        <Badge
                          variant="outline"
                          className="border-primary/40 text-primary bg-primary/10 rounded-none text-xs font-medium"
                        >
                          MSC Member
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-muted-foreground/30 text-muted-foreground text-xs font-medium rounded-none"
                        >
                          Guest Student
                        </Badge>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-size160">
                      <Badge variant="outline" className={statusInfo.className}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="pr-size200 text-right">
                      <Button
                        size="sm"
                        disabled={checkIn.isPending}
                        onClick={() => handleCheckIn(reg)}
                        className={`h-8 px-3 text-xs font-medium rounded-none gap-1.5 cursor-pointer ${
                          reg.hasAttended
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-1"
                        }`}
                      >
                        {reg.hasAttended ? (
                          <>
                            <CheckmarkCircleRegular className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Checked In</span>
                          </>
                        ) : (
                          "Check In"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}

            {/* Sentinel */}
            <TableRow className="hover:bg-transparent border-0">
              <TableCell
                colSpan={6}
                className="h-6 p-0 text-center text-xs text-muted-foreground"
              >
                <div ref={sentinelRef} className="h-2 w-full" />
                {isFetchingNextPage && "Loading more attendees..."}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LiveCheckInView;
