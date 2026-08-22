import * as React from "react";
import {
  SearchRegular,
  PeopleRegular,
  MailRegular,
  CalendarLtrRegular,
  CheckmarkRegular,
  DismissRegular,
  ArrowClockwiseRegular,
  CheckmarkCircleRegular,
  BuildingRegular,
  LockClosedRegular,
  WarningRegular,
  FilterRegular,
} from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

type TabFilter = "ALL" | "PENDING_REVIEW" | "APPROVED" | "ATTENDED" | "REJECTED";

const STATUS_CONFIG: Record<
  RegistrationStatus,
  { label: string; className: string }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "border-blue-500/40 text-blue-700 dark:text-blue-300 bg-blue-500/10 rounded-none text-xs font-medium",
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

function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function RegistrationsView() {
  const [selectedEventId, setSelectedEventId] = React.useState<string>("ALL");
  const [activeTab, setActiveTab] = React.useState<TabFilter>("ALL");

  const { events } = useEvents({ all: true });

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
    status,
    setStatus,
    refetch,
  } = useEventRegistrations({
    eventId: selectedEventId === "ALL" ? undefined : selectedEventId,
  });

  const { approveRegistration, rejectRegistration, checkIn, resendTicket } =
    useEventMutations();

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

  const handleTabChange = (newTab: TabFilter) => {
    setActiveTab(newTab);
    if (newTab === "ATTENDED") {
      setStatus("ALL");
    } else {
      setStatus(newTab);
    }
  };

  const filteredRegistrations = React.useMemo(() => {
    if (activeTab === "ATTENDED") {
      return registrations.filter((r) => r.hasAttended);
    }
    return registrations;
  }, [registrations, activeTab]);

  const handleApprove = (reg: EventRegistration) => {
    approveRegistration.mutate({
      eventId: reg.eventId,
      registrationId: reg.id,
    });
  };

  const handleReject = (reg: EventRegistration) => {
    rejectRegistration.mutate({
      eventId: reg.eventId,
      registrationId: reg.id,
    });
  };

  const handleCheckIn = (reg: EventRegistration) => {
    checkIn.mutate({
      eventId: reg.eventId,
      registrationId: reg.id,
    });
  };

  const handleResendTicket = (reg: EventRegistration) => {
    resendTicket.mutate({
      eventId: reg.eventId,
      registrationId: reg.id,
    });
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col bg-card shadow-4 ring-1 ring-foreground/10 overflow-hidden w-full">
      {/* Header Toolbar: Search, Event Selector, Status Tabs, and Refresh */}
      <div className="p-size160 border-b border-border bg-card shrink-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-size160">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-size120 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registrant by name, student ID, email..."
              className="pl-9 h-9 text-xs sm:text-sm rounded-none bg-background placeholder:text-muted-foreground"
            />
          </div>

          {/* Event Selector Dropdown */}
          <Select
            value={selectedEventId}
            onValueChange={(val) => setSelectedEventId(val || "ALL")}
          >
            <SelectTrigger className="w-full sm:w-60 !h-9 text-xs font-medium rounded-none bg-background shrink-0 border-input">
              <SelectValue placeholder="Filter by event...">
                {selectedEventId === "ALL"
                  ? "All Events"
                  : events.find((e) => e.id === selectedEventId)?.title || "Filter by event..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none shadow-8 max-h-60">
              <SelectItem value="ALL" className="text-xs rounded-none">
                All Events
              </SelectItem>
              {events.map((evt) => (
                <SelectItem
                  key={evt.id}
                  value={evt.id}
                  className="text-xs rounded-none truncate"
                >
                  {evt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Tabs & Refresh */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none justify-between lg:justify-end">
          <FilterRegular className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block mr-1" />
          <div className="flex items-center gap-1">
            {(
              [
                { key: "ALL", label: "All" },
                { key: "PENDING_REVIEW", label: "Pending Review" },
                { key: "APPROVED", label: "Approved" },
                { key: "ATTENDED", label: "Attended" },
                { key: "REJECTED", label: "Rejected" },
              ] as const
            ).map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabChange(tab.key)}
                className="h-8 text-xs px-3 rounded-none font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="h-5 w-px bg-border/60 mx-1 hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 rounded-none shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <ArrowClockwiseRegular
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Main Registrations Table */}
      <Table containerClassName="flex-1 min-h-0 overflow-auto">
        <TableHeader className="sticky top-0 z-20 bg-card [&_tr]:border-0 [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-card [&_th]:border-b [&_th]:border-border [&_th]:shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[240px] pl-size200 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registrant
              </TableHead>
              <TableHead className="w-[130px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student ID
              </TableHead>
              <TableHead className="w-[200px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event
              </TableHead>
              <TableHead className="w-[130px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Affiliation
              </TableHead>
              <TableHead className="w-[160px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registration Time
              </TableHead>
              <TableHead className="w-[130px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-[130px] px-size160 text-xs font-semibold uppercase tracking-wider text-center text-muted-foreground">
                Attendance
              </TableHead>
              <TableHead className="w-[160px] pr-size200 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isRegsLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="h-14">
                  <TableCell className="pl-size200">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-none" />
                      <div>
                        <Skeleton className="h-3.5 w-32 mb-1" />
                        <Skeleton className="h-2.5 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-5 w-18" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="px-size160 text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="pr-size200 text-right">
                    <Skeleton className="h-7 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent cursor-default border-0 select-none">
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <WarningRegular className="w-10 h-10 text-destructive mb-1" />
                    <span className="text-sm font-semibold text-foreground">
                      Failed to Load Registrations
                    </span>
                    <p className="text-xs max-w-sm text-muted-foreground">
                      Unable to retrieve registrations from the server.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="mt-2 rounded-none text-xs cursor-pointer"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRegistrations.length === 0 ? (
              <TableRow className="hover:bg-transparent cursor-default border-0 select-none">
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <PeopleRegular className="w-10 h-10 text-muted-foreground/40 mb-1" />
                    <span className="text-sm font-semibold text-foreground">
                      No Registrations Found
                    </span>
                    <p className="text-xs max-w-sm text-muted-foreground">
                      {search || selectedEventId !== "ALL" || activeTab !== "ALL"
                        ? "Try clearing your search filters to view more registrants."
                        : "There are currently no registrations in the system."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((reg) => {
                const statusInfo =
                  STATUS_CONFIG[reg.status as RegistrationStatus] || {
                    label: String(reg.status),
                    className: "border-border text-xs font-medium",
                  };

                const isApprovePending =
                  approveRegistration.isPending &&
                  approveRegistration.variables?.registrationId === reg.id;
                const isRejectPending =
                  rejectRegistration.isPending &&
                  rejectRegistration.variables?.registrationId === reg.id;
                const isCheckInPending =
                  checkIn.isPending &&
                  checkIn.variables?.registrationId === reg.id;
                const isResendPending =
                  resendTicket.isPending &&
                  resendTicket.variables?.registrationId === reg.id;

                return (
                  <TableRow
                    key={reg.id}
                    className="h-14 hover:bg-muted/30 transition-colors"
                  >
                    {/* Registrant */}
                    <TableCell className="pl-size200">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 rounded-none border border-border/50 shrink-0">
                          <AvatarFallback className="rounded-none bg-primary/5 text-primary text-[10px] font-semibold">
                            {reg.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-foreground truncate max-w-[170px]">
                            {reg.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[170px]">
                            {reg.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Student ID */}
                    <TableCell className="px-size160">
                      <span className="text-xs font-mono text-foreground font-medium">
                        {reg.studentId || "N/A"}
                      </span>
                    </TableCell>

                    {/* Event */}
                    <TableCell className="px-size160">
                      <span className="text-xs text-foreground font-medium flex items-center gap-1.5">
                        <CalendarLtrRegular className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {reg.eventTitle || "Event"}
                        </span>
                      </span>
                    </TableCell>

                    {/* Affiliation (Member / Non-Member) */}
                    <TableCell className="px-size160">
                      {reg.isMember ? (
                        <Badge
                          variant="outline"
                          className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                        >
                          <LockClosedRegular className="w-3 h-3" />
                          <span>Member</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                        >
                          <BuildingRegular className="w-3 h-3" />
                          <span>Non-Member</span>
                        </Badge>
                      )}
                    </TableCell>

                    {/* Registration Time */}
                    <TableCell className="px-size160">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatDateTime(reg.createdAt)}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-size160">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium py-0.5 px-2 ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Attendance */}
                    <TableCell className="text-center">
                      {reg.hasAttended ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-bold rounded-none inline-flex items-center gap-1"
                        >
                          <CheckmarkCircleRegular className="w-3 h-3 text-emerald-600" />
                          <span>Checked In</span>
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Not Checked In
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-size200 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Pending Review: Approve & Reject */}
                        {reg.status === "PENDING_REVIEW" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              disabled={isApprovePending}
                              onClick={() => handleApprove(reg)}
                              className="h-7 px-2 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-none gap-1 cursor-pointer"
                              title="Approve Registration"
                            >
                              <CheckmarkRegular className="w-3 h-3" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isRejectPending}
                              onClick={() => handleReject(reg)}
                              className="h-7 px-2 text-[11px] font-semibold rounded-none gap-1 cursor-pointer"
                              title="Reject Registration"
                            >
                              <DismissRegular className="w-3 h-3" />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}

                        {/* Approved: Check In Toggle & Resend Ticket */}
                        {reg.status === "APPROVED" && (
                          <>
                            <Button
                              variant={reg.hasAttended ? "outline" : "default"}
                              size="sm"
                              disabled={isCheckInPending || reg.hasAttended}
                              onClick={() => handleCheckIn(reg)}
                              className={`h-7 px-2 text-[11px] font-semibold rounded-none gap-1 cursor-pointer ${
                                reg.hasAttended
                                  ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10"
                                  : "bg-primary text-primary-foreground shadow-1"
                              }`}
                              title={
                                reg.hasAttended
                                  ? "Already checked in"
                                  : "Mark as checked in"
                              }
                            >
                              <CheckmarkRegular className="w-3 h-3" />
                              <span>
                                {reg.hasAttended ? "Attended" : "Check In"}
                              </span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Resend QR Ticket"
                              disabled={isResendPending}
                              onClick={() => handleResendTicket(reg)}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-none cursor-pointer"
                            >
                              <MailRegular className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}

            {/* Infinite Scroll Sentinel */}
            <TableRow
              ref={sentinelRef}
              className="hover:bg-transparent border-0"
            >
              <TableCell
                colSpan={8}
                className="h-6 p-0 text-center text-xs text-muted-foreground"
              >
                {isFetchingNextPage && "Loading more registrations..."}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </div>
  );
}

export default RegistrationsView;

