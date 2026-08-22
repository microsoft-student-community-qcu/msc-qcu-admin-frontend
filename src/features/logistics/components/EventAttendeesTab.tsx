import React, { useState, useMemo, useRef } from "react";
import {
  SearchRegular,
  PeopleRegular,
  CheckmarkRegular,
  DismissRegular,
  MailRegular,
  FullScreenMaximizeRegular,
  CheckmarkCircleRegular,
  WarningRegular,
  ArrowClockwiseRegular,
  BuildingRegular,
  LockClosedRegular,
} from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { EventItem, EventRegistration, RegistrationStatus } from "../types";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import { useEventMutations } from "../hooks/useEventMutations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export interface EventAttendeesTabProps {
  eventId?: string;
  event?: EventItem;
  onOpenFullRoster?: () => void;
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

export const EventAttendeesTab: React.FC<EventAttendeesTabProps> = ({
  eventId,
  event,
  onOpenFullRoster,
}) => {
  const resolvedEventId = eventId || event?.id || "";
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
    eventId: resolvedEventId,
    initialStatus: registrationStatusParam,
    initialSearch: searchTerm,
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

  const handleApprove = (reg: EventRegistration) => {
    if (!resolvedEventId) return;
    approveRegistration.mutate({
      eventId: resolvedEventId,
      registrationId: reg.id,
    });
  };

  const handleReject = (reg: EventRegistration) => {
    if (!resolvedEventId) return;
    rejectRegistration.mutate({
      eventId: resolvedEventId,
      registrationId: reg.id,
    });
  };

  const handleCheckIn = (reg: EventRegistration) => {
    if (!resolvedEventId) return;
    checkIn.mutate({
      eventId: resolvedEventId,
      registrationId: reg.id,
    });
  };

  const handleResendTicket = (reg: EventRegistration) => {
    if (!resolvedEventId) return;
    resendTicket.mutate({
      eventId: resolvedEventId,
      registrationId: reg.id,
    });
  };

  const requiresQr = event ? event.requiresQrTicket : true;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-card">
      {/* Top Toolbar: Search, Filters, and Expand Full Roster */}
      <div className="p-size160 border-b border-border/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size120 bg-muted/10 shrink-0">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Name, Student ID, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-xs rounded-none bg-background placeholder:text-muted-foreground"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 rounded-none cursor-pointer shrink-0"
            title="Refresh list"
          >
            <ArrowClockwiseRegular className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-size80 justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="flex items-center gap-size40 overflow-x-auto">
            <Button
              variant={activeTab === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ALL")}
              className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
            >
              All
            </Button>
            <Button
              variant={activeTab === "PENDING_REVIEW" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("PENDING_REVIEW")}
              className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
            >
              Pending
            </Button>
            <Button
              variant={activeTab === "APPROVED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("APPROVED")}
              className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
            >
              Approved
            </Button>
            <Button
              variant={activeTab === "ATTENDED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ATTENDED")}
              className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
            >
              Attended
            </Button>
            <Button
              variant={activeTab === "REJECTED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("REJECTED")}
              className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
            >
              Rejected
            </Button>
          </div>

          {/* Expand Full Roster View */}
          {onOpenFullRoster && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenFullRoster}
              className="h-7 text-xs px-2.5 rounded-none font-medium gap-1 shrink-0 cursor-pointer shadow-1"
            >
              <FullScreenMaximizeRegular className="size-3.5" />
              <span className="hidden md:inline">Full Roster</span>
            </Button>
          )}
        </div>
      </div>

      {/* Roster Table */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 border-b">
              <TableRow>
                <TableHead className="w-[240px]">Registrant</TableHead>
                <TableHead className="w-[120px]">Student ID</TableHead>
                <TableHead className="w-[110px]">Affiliation</TableHead>
                <TableHead className="w-[140px]">Registered Date</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-none" />
                        <div className="space-y-1">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-2.5 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-7 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-44 text-center hover:bg-transparent cursor-default border-0 select-none"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <WarningRegular className="size-8 text-destructive mb-2" />
                      <p className="text-sm font-semibold text-foreground">
                        Failed to Load Registrations
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Unable to connect to the logistics backend.
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
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 rounded-none border border-border/50 shrink-0">
                            <AvatarFallback className="rounded-none bg-primary/5 text-primary text-[10px] font-semibold">
                              {reg.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-foreground truncate">
                              {reg.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate font-mono">
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
                            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                          >
                            <LockClosedRegular className="size-2.5" />
                            <span>Member</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                          >
                            <BuildingRegular className="size-2.5" />
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
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none"
                          >
                            Approved
                          </Badge>
                        )}
                        {reg.status === "PENDING_REVIEW" && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none"
                          >
                            Pending Review
                          </Badge>
                        )}
                        {reg.status === "REJECTED" && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none"
                          >
                            Rejected
                          </Badge>
                        )}
                        {reg.status === "CANCELLED" && (
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground border-border text-[10px] font-medium py-0 h-4.5 px-1.5 rounded-none"
                          >
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>

                      {/* Attendance */}
                      <TableCell>
                        {reg.hasAttended ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-[10px] font-semibold py-0 h-4.5 px-1.5 rounded-none flex items-center gap-1 w-fit"
                          >
                            <CheckmarkCircleRegular className="size-3 text-emerald-600" />
                            <span>Checked In</span>
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            Unattended
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Check-In Action */}
                          {reg.status === "APPROVED" && (
                            <Button
                              size="sm"
                              variant={reg.hasAttended ? "outline" : "default"}
                              onClick={() => handleCheckIn(reg)}
                              disabled={isCheckInPending || reg.hasAttended}
                              className="h-6.5 text-[11px] px-2 rounded-none font-medium gap-1 cursor-pointer"
                              title={reg.hasAttended ? "Already checked in" : "Mark as checked in"}
                            >
                              <CheckmarkRegular className="size-3" />
                              <span>{reg.hasAttended ? "Attended" : "Check-In"}</span>
                            </Button>
                          )}

                          {/* Approve / Reject */}
                          {reg.status === "PENDING_REVIEW" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(reg)}
                                disabled={isApprovePending}
                                className="h-6.5 text-[11px] px-2 rounded-none font-medium gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                                title="Approve Registration"
                              >
                                <CheckmarkRegular className="size-3" />
                                <span>Approve</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(reg)}
                                disabled={isRejectPending}
                                className="h-6.5 text-[11px] px-2 rounded-none font-medium gap-1 cursor-pointer"
                                title="Reject Registration"
                              >
                                <DismissRegular className="size-3" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}

                          {/* Resend QR Ticket */}
                          {reg.status === "APPROVED" && requiresQr && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleResendTicket(reg)}
                              disabled={isResendPending}
                              className="h-6.5 w-6.5 p-0 rounded-none cursor-pointer text-muted-foreground hover:text-foreground"
                              title="Resend QR Ticket via email"
                            >
                              <MailRegular className="size-3" />
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
                    className="h-44 text-center hover:bg-transparent cursor-default border-0 select-none"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <PeopleRegular className="size-8 text-muted-foreground/60 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No Registrations Found</p>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                        {searchTerm
                          ? `No registrants match "${searchTerm}".`
                          : "There are currently no attendees registered in this category."}
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
    </div>
  );
};

export default EventAttendeesTab;
