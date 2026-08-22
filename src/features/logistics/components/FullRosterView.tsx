import React, { useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  SearchRegular,
  PeopleRegular,
  PeopleCheckmarkRegular,
  CheckmarkRegular,
  DismissRegular,
  MailRegular,
  QrCodeRegular,
  CheckmarkCircleRegular,
  WarningRegular,
  ArrowClockwiseRegular,
  BuildingRegular,
  LockClosedRegular,
} from "@fluentui/react-icons";
import type { EventItem, EventRegistration, RegistrationStatus } from "../types";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import { useEventMutations } from "../hooks/useEventMutations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export interface FullRosterViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem;
}

type TabFilter = "ALL" | "PENDING_REVIEW" | "APPROVED" | "ATTENDED" | "REJECTED";

function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export const FullRosterView: React.FC<FullRosterViewProps> = ({ isOpen, onOpenChange, event }) => {
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const registrationStatusParam: RegistrationStatus | "ALL" =
    activeTab === "ATTENDED" ? "ALL" : activeTab;

  const {
    registrations,
    total,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useEventRegistrations({
    eventId: event.id,
    initialStatus: registrationStatusParam,
    initialSearch: searchTerm,
    pageSize: 50,
    enabled: isOpen && !!event?.id,
  });

  const { approveRegistration, rejectRegistration, checkIn, resendTicket } = useEventMutations();

  const sentinelRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const filteredRegistrations = useMemo(() => {
    if (activeTab === "ATTENDED") {
      return registrations.filter((r) => r.hasAttended);
    }
    return registrations;
  }, [registrations, activeTab]);

  const attendancePercent =
    event.registeredCount > 0 ? Math.round((event.attendedCount / event.registeredCount) * 100) : 0;

  const handleApprove = (reg: EventRegistration) => {
    approveRegistration.mutate({
      eventId: event.id,
      registrationId: reg.id,
    });
  };

  const handleReject = (reg: EventRegistration) => {
    rejectRegistration.mutate({
      eventId: event.id,
      registrationId: reg.id,
    });
  };

  const handleCheckIn = (reg: EventRegistration) => {
    checkIn.mutate({
      eventId: event.id,
      registrationId: reg.id,
    });
  };

  const handleResendTicket = (reg: EventRegistration) => {
    resendTicket.mutate({
      eventId: event.id,
      registrationId: reg.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl sm:max-w-6xl h-[90vh] flex flex-col p-size240 rounded-none shadow-28 border border-border">
        {/* Header Section */}
        <DialogHeader className="shrink-0 pb-size120 border-b border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-size120">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-size80 text-foreground">
                <PeopleRegular className="size-5 text-primary shrink-0" />
                <span>Full Attendee Roster: {event.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Real-time check-in reception board and complete attendee registry for big-screen
                monitoring.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-size160 shrink-0 bg-muted/40 p-size80 border border-border/60">
              <div className="text-center px-size80">
                <div className="text-xs text-muted-foreground">Registered</div>
                <div className="text-base font-bold font-mono text-foreground">
                  {event.registeredCount} / {event.maxCapacity}
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center px-size80">
                <div className="text-xs text-muted-foreground">Checked In</div>
                <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {event.attendedCount}
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center px-size80">
                <div className="text-xs text-muted-foreground">Turnout Rate</div>
                <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                  {attendancePercent}%
                </div>
              </div>
            </div>
          </div>

          <div className="pt-size80">
            <Progress value={attendancePercent} className="h-1.5 w-full bg-muted" />
          </div>
        </DialogHeader>

        {/* Filter & Search Toolbar */}
        <div className="shrink-0 py-size120 flex flex-col sm:flex-row items-center justify-between gap-size120 border-b border-border/60">
          <div className="relative w-full sm:w-80">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Name, Student ID, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-size40 w-full sm:w-auto">
            <Button
              variant={activeTab === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ALL")}
              className="h-8 text-xs px-3 rounded-none font-medium cursor-pointer"
            >
              All
            </Button>
            <Button
              variant={activeTab === "PENDING_REVIEW" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("PENDING_REVIEW")}
              className="h-8 text-xs px-3 rounded-none font-medium cursor-pointer"
            >
              Pending Review
            </Button>
            <Button
              variant={activeTab === "APPROVED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("APPROVED")}
              className="h-8 text-xs px-3 rounded-none font-medium cursor-pointer"
            >
              Approved
            </Button>
            <Button
              variant={activeTab === "ATTENDED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ATTENDED")}
              className="h-8 text-xs px-3 rounded-none font-medium cursor-pointer"
            >
              Attended ({event.attendedCount})
            </Button>
            <Button
              variant={activeTab === "REJECTED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("REJECTED")}
              className="h-8 text-xs px-3 rounded-none font-medium cursor-pointer"
            >
              Rejected
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-8 w-8 rounded-none cursor-pointer"
              title="Refresh"
            >
              <ArrowClockwiseRegular className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Roster Table Container */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-sm border-b">
                <TableRow>
                  <TableHead className="w-[260px]">Registrant</TableHead>
                  <TableHead className="w-[140px]">Student ID</TableHead>
                  <TableHead className="w-[120px]">Affiliation</TableHead>
                  <TableHead className="w-[160px]">Registered Date</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[130px]">Check-In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-none" />
                          <div className="space-y-1">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center pointer-events-none select-none"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <WarningRegular className="size-8 text-destructive mb-2" />
                        <p className="text-sm font-semibold text-foreground">
                          Failed to load attendee roster
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Unable to retrieve registrations from the server.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => {
                    const isCheckInPending =
                      checkIn.isPending && checkIn.variables?.registrationId === reg.id;
                    const isApprovePending =
                      approveRegistration.isPending &&
                      approveRegistration.variables?.registrationId === reg.id;
                    const isRejectPending =
                      rejectRegistration.isPending &&
                      rejectRegistration.variables?.registrationId === reg.id;
                    const isResendPending =
                      resendTicket.isPending && resendTicket.variables?.registrationId === reg.id;

                    return (
                      <TableRow key={reg.id} className="hover:bg-muted/40 transition-colors">
                        {/* Registrant */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-none border border-border/50 shrink-0">
                              <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xs font-semibold">
                                {reg.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-foreground truncate">
                                {reg.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground truncate">
                                {reg.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Student ID */}
                        <TableCell>
                          <span className="font-mono text-xs text-foreground">
                            {reg.studentId || "N/A"}
                          </span>
                        </TableCell>

                        {/* Affiliation */}
                        <TableCell>
                          {reg.isMember ? (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                            >
                              <LockClosedRegular className="size-3" />
                              <span>Member</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                            >
                              <BuildingRegular className="size-3" />
                              <span>Student</span>
                            </Badge>
                          )}
                        </TableCell>

                        {/* Registered Date */}
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {formatDateTime(reg.createdAt)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {reg.status === "APPROVED" && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Approved
                            </Badge>
                          )}
                          {reg.status === "PENDING_REVIEW" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Pending Review
                            </Badge>
                          )}
                          {reg.status === "REJECTED" && (
                            <Badge
                              variant="outline"
                              className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Rejected
                            </Badge>
                          )}
                          {reg.status === "CANCELLED" && (
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground border-border text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Cancelled
                            </Badge>
                          )}
                        </TableCell>

                        {/* Check-In Status */}
                        <TableCell>
                          {reg.hasAttended ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-[10px] font-semibold py-0 h-5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                            >
                              <CheckmarkCircleRegular className="size-3 text-emerald-600" />
                              <span>Checked In</span>
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              Not Checked In
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Check-in Toggle Button */}
                            {reg.status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant={reg.hasAttended ? "outline" : "default"}
                                onClick={() => handleCheckIn(reg)}
                                disabled={isCheckInPending || reg.hasAttended}
                                className="h-7 text-xs px-2 rounded-none font-medium gap-1 cursor-pointer"
                                title={
                                  reg.hasAttended ? "Already checked in" : "Mark as checked in"
                                }
                              >
                                <PeopleCheckmarkRegular className="size-3.5" />
                                <span>{reg.hasAttended ? "Attended" : "Check-In"}</span>
                              </Button>
                            )}

                            {/* Approve / Reject for Pending */}
                            {reg.status === "PENDING_REVIEW" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApprove(reg)}
                                  disabled={isApprovePending}
                                  className="h-7 text-xs px-2 rounded-none font-medium gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                                  title="Approve Registration"
                                >
                                  <CheckmarkRegular className="size-3.5" />
                                  <span>Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(reg)}
                                  disabled={isRejectPending}
                                  className="h-7 text-xs px-2 rounded-none font-medium gap-1 cursor-pointer"
                                  title="Reject Registration"
                                >
                                  <DismissRegular className="size-3.5" />
                                  <span>Reject</span>
                                </Button>
                              </>
                            )}

                            {/* Resend QR Ticket */}
                            {reg.status === "APPROVED" && event.requiresQrTicket && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleResendTicket(reg)}
                                disabled={isResendPending}
                                className="h-7 w-7 p-0 rounded-none cursor-pointer text-muted-foreground hover:text-foreground"
                                title="Resend QR Ticket via email"
                              >
                                <MailRegular className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center pointer-events-none select-none"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <PeopleRegular className="size-8 text-muted-foreground/60 mb-2" />
                        <p className="text-sm font-semibold text-foreground">No Attendees Found</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                          {searchTerm
                            ? `No registrants match "${searchTerm}".`
                            : "There are currently no attendees in this view."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Infinite Scroll Sentinel */}
                {hasNextPage && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0 border-0">
                      <div ref={sentinelRef} className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullRosterView;
