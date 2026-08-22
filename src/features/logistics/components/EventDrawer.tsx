import * as React from "react";
import {
  CalendarRegular,
  LocationRegular,
  PeopleRegular,
  SearchRegular,
  CheckmarkCircleRegular,
  MailRegular,
  FullScreenMaximizeRegular,
  ClockRegular,
} from "@fluentui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import { useEventMutations } from "../hooks/useEventMutations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { EventItem, RegistrationStatus } from "../types";
import { FullRosterView } from "./FullRosterView";

export interface EventDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem | null;
}

const REG_STATUS_CONFIG: Record<
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

export function EventDrawer({ isOpen, onOpenChange, event }: EventDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"attendees" | "details">("attendees");
  const [isFullRosterOpen, setIsFullRosterOpen] = React.useState(false);

  const {
    registrations,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    search,
    setSearch,
    status,
    setStatus,
  } = useEventRegistrations({
    eventId: event?.id,
    enabled: isOpen && !!event?.id,
  });

  const { approveRegistration, checkIn, resendTicket } = useEventMutations();

  const sentinelRef = React.useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  if (!event) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-0 flex flex-col h-full bg-card border-l border-border shadow-28"
        >
          {/* Header */}
          <SheetHeader className="p-size240 border-b border-border/60 bg-muted/10 shrink-0 pr-14">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium rounded-none border-primary/40 text-primary bg-primary/10">
                  {event.type.replace(/_/g, " ")}
                </Badge>
                {event.status === "CANCELLED" && (
                  <Badge variant="destructive" className="text-xs font-medium rounded-none">
                    Cancelled
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-xl font-bold text-foreground line-clamp-1">
                {event.title}
              </SheetTitle>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <CalendarRegular className="w-4 h-4 text-primary" />
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {event.venue && (
                  <span className="flex items-center gap-1.5">
                    <LocationRegular className="w-4 h-4 text-muted-foreground/70" />
                    {event.venue}
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <PeopleRegular className="w-4 h-4 text-primary" />
                  {event.registeredCount || 0} / {event.maxCapacity} Confirmed
                </span>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "attendees" | "details")}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="px-size240 pt-size120 border-b border-border/60 bg-muted/5 flex items-center justify-between">
              <TabsList className="bg-transparent h-10 p-0 gap-2 rounded-none border-0">
                <TabsTrigger
                  value="attendees"
                  className="h-10 px-4 text-sm font-semibold rounded-none border-0 shadow-none data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground after:hidden cursor-pointer"
                >
                  Attendees & Roster
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="h-10 px-4 text-sm font-semibold rounded-none border-0 shadow-none data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground after:hidden cursor-pointer"
                >
                  Schedule & Logistics
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullRosterOpen(true)}
                className="h-8 px-3 text-xs font-medium gap-1.5 rounded-none border-border shadow-1 hidden sm:flex cursor-pointer"
              >
                <FullScreenMaximizeRegular className="w-4 h-4 text-muted-foreground" />
                <span>Full Display</span>
              </Button>
            </div>

            {/* TAB 1: Attendees Roster */}
            <TabsContent value="attendees" className="flex-1 flex flex-col min-h-0 m-0 p-0">
              {/* Search & Filter Toolbar */}
              <div className="p-size160 border-b border-border/60 bg-muted/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size160">
                <div className="relative flex-1 max-w-md">
                  <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search attendee by name, student ID, email..."
                    className="pl-9 h-9 text-xs rounded-none bg-background placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={status === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatus(s as any)}
                      className={`h-8 px-3 text-xs font-medium rounded-none cursor-pointer ${
                        status === s
                          ? "bg-primary text-primary-foreground shadow-1"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s === "ALL"
                        ? "All"
                        : s === "PENDING_REVIEW"
                          ? "Pending"
                          : s === "APPROVED"
                            ? "Approved"
                            : "Rejected"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Roster Table */}
              <div className="flex-1 overflow-auto min-h-0">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted/50 border-b border-border/60 shadow-1">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[280px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Attendee
                      </TableHead>
                      <TableHead className="w-[150px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Student ID
                      </TableHead>
                      <TableHead className="w-[150px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                        Check-In
                      </TableHead>
                      <TableHead className="w-[140px] text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-size240">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i} className="h-16">
                          <TableCell>
                            <Skeleton className="h-4 w-40 mb-1.5" />
                            <Skeleton className="h-3 w-48" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-20" />
                          </TableCell>
                          <TableCell className="text-center">
                            <Skeleton className="h-6 w-16 mx-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-7 w-20 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : isError ? (
                      <TableRow className="hover:bg-transparent cursor-default border-0">
                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-xs">
                          Failed to load event registrations.
                        </TableCell>
                      </TableRow>
                    ) : registrations.length === 0 ? (
                      <TableRow className="hover:bg-transparent cursor-default border-0">
                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground text-xs">
                          No registrations found matching the criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrations.map((reg) => {
                        const statusInfo =
                          REG_STATUS_CONFIG[reg.status as RegistrationStatus] || {
                            label: String(reg.status),
                            className: "border-border text-xs font-medium",
                          };

                        return (
                          <TableRow key={reg.id} className="h-16 hover:bg-muted/30 transition-colors">
                            {/* Attendee */}
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {reg.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                                  {reg.email}
                                </span>
                              </div>
                            </TableCell>

                            {/* Student ID */}
                            <TableCell>
                              <span className="font-mono text-xs text-foreground font-medium bg-muted/40 px-2 py-1 border border-border/50">
                                {reg.studentId || "N/A"}
                              </span>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Badge variant="outline" className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </TableCell>

                            {/* Check-In Toggle */}
                            <TableCell className="text-center">
                              {reg.status === "APPROVED" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={checkIn.isPending}
                                  onClick={() =>
                                    checkIn.mutate({
                                      eventId: event.id,
                                      registrationId: reg.id,
                                    })
                                  }
                                  className={`h-8 px-3 text-xs font-medium rounded-none gap-1.5 cursor-pointer ${
                                    reg.hasAttended
                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                      : "bg-muted text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {reg.hasAttended ? (
                                    <>
                                      <CheckmarkCircleRegular className="w-3.5 h-3.5 text-emerald-600" />
                                      Checked In
                                    </>
                                  ) : (
                                    "Check In"
                                  )}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground/50 italic">—</span>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right pr-size240">
                              <div className="flex items-center justify-end gap-1.5">
                                {reg.status === "PENDING_REVIEW" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={approveRegistration.isPending}
                                    onClick={() =>
                                      approveRegistration.mutate({
                                        eventId: event.id,
                                        registrationId: reg.id,
                                      })
                                    }
                                    className="h-8 px-3 text-xs font-medium text-primary hover:bg-primary/10 rounded-none border-primary/30 cursor-pointer"
                                  >
                                    Approve
                                  </Button>
                                )}

                                {reg.status === "APPROVED" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Resend QR Ticket"
                                    disabled={resendTicket.isPending}
                                    onClick={() =>
                                      resendTicket.mutate({
                                        eventId: event.id,
                                        registrationId: reg.id,
                                      })
                                    }
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none cursor-pointer"
                                  >
                                    <MailRegular className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}

                    {/* Infinite Scroll Sentinel */}
                    <TableRow className="hover:bg-transparent border-0">
                      <TableCell colSpan={5} className="h-6 p-0 text-center text-xs text-muted-foreground">
                        <div ref={sentinelRef} className="h-2 w-full" />
                        {isFetchingNextPage && "Loading more attendees..."}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* TAB 2: Schedule & Logistics */}
            <TabsContent value="details" className="flex-1 overflow-auto p-size320 space-y-size240 m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-size200">
                {/* Priority Start Window */}
                <div className="p-size200 border border-border/60 bg-muted/10 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ClockRegular className="w-4 h-4 text-primary" />
                    Member Priority Access
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {new Date(event.priorityStartDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.priorityStartDate).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* General Start Window */}
                <div className="p-size200 border border-border/60 bg-muted/10 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ClockRegular className="w-4 h-4 text-primary" />
                    General Public Access
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {new Date(event.generalStartDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.generalStartDate).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Event Description */}
              <div className="p-size200 border border-border/60 bg-muted/5 flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Event Description
                </span>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description || "No description provided for this event."}
                </p>
              </div>

              {/* Venue & QR Config */}
              <div className="p-size200 border border-border/60 bg-muted/5 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                  <span className="text-muted-foreground font-medium">Venue Location:</span>
                  <span className="font-semibold text-foreground text-sm">{event.venue || "MSC Innovation Hub"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                  <span className="text-muted-foreground font-medium">Requires QR Ticket:</span>
                  <span className="font-semibold text-foreground text-sm">
                    {event.requiresQrTicket ? "Yes (Ticket Dispatched on Approval)" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground font-medium">Created On:</span>
                  <span className="text-muted-foreground">
                    {new Date(event.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Full Screen Focused Roster Dialog */}
      <FullRosterView
        isOpen={isFullRosterOpen}
        onOpenChange={setIsFullRosterOpen}
        event={event}
      />
    </>
  );
}

export default EventDrawer;
