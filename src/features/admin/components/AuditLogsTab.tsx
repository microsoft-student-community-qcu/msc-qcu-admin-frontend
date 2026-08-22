import React, { useState } from "react";
import {
  WarningRegular,
  ArrowClockwiseRegular,
  CodeRegular,
  CopyRegular,
  CheckmarkRegular,
  EyeRegular,
  DismissRegular,
  DocumentBulletListRegular,
  HistoryRegular,
  KeyRegular,
} from "@fluentui/react-icons";

import { useAuditLogs } from "../hooks/useAuditLogs";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { AuditLog, AuditAction } from "../types/adminTypes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const ACTION_DISPLAY_NAMES: Record<AuditAction, string> = {
  ROLE_CHANGE: "Role Change",
  SETTING_UPDATE: "Setting Update",
  SYSTEM_MAINTENANCE: "System Maintenance",
};

const ACTION_BADGE_CLASSES: Record<AuditAction, string> = {
  ROLE_CHANGE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  SETTING_UPDATE: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  SYSTEM_MAINTENANCE: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const AVAILABLE_ACTIONS: AuditAction[] = ["ROLE_CHANGE", "SETTING_UPDATE", "SYSTEM_MAINTENANCE"];

export const AuditLogsTab: React.FC = () => {
  const {
    logs,
    total,
    action,
    setAction,
    actorId,
    setActorId,
    from,
    setFrom,
    to,
    setTo,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    resetFilters,
  } = useAuditLogs({ initialPageSize: 20 });

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => fetchNextPage?.(),
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(identifier);
    setTimeout(() => {
      setCopiedHash(null);
    }, 2000);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const truncateHash = (hashStr?: string | null) => {
    if (!hashStr) return "N/A";
    if (hashStr.length <= 16) return hashStr;
    return `${hashStr.slice(0, 8)}...${hashStr.slice(-6)}`;
  };

  return (
    <div className="h-full flex flex-col bg-card shadow-4 ring-1 ring-foreground/10 overflow-hidden w-full">
      {/* Filter Toolbar */}
      <div className="p-size160 border-b border-border/60 space-y-size120 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size120">
          <div className="text-xs text-muted-foreground">
            Filter administrative action logs by action, actor, or date range.
          </div>

          <div className="flex items-center gap-size80 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 text-xs gap-size60 rounded-none cursor-pointer"
            >
              <ArrowClockwiseRegular
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-size120 pt-size80 border-t border-border/60">
          {/* Action Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">
              Action Type
            </label>
            <Select
              value={action || "ALL"}
              onValueChange={(val) => {
                if (val) setAction(val as AuditAction | "ALL");
              }}
            >
              <SelectTrigger className="w-full h-8 text-xs rounded-none">
                <SelectValue placeholder="All Actions">
                  {action === "ALL" || !action
                    ? "All Actions"
                    : ACTION_DISPLAY_NAMES[action as AuditAction] || action}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Actions
                </SelectItem>
                {AVAILABLE_ACTIONS.map((act) => (
                  <SelectItem key={act} value={act} className="text-xs">
                    {ACTION_DISPLAY_NAMES[act]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actor ID */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">Actor ID</label>
            <Input
              type="text"
              placeholder="Filter by user UUID..."
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
              className="h-8 text-xs rounded-none"
            />
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">From Date</label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-8 text-xs rounded-none"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">To Date</label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-8 text-xs rounded-none"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table with Infinite Scroll */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Timestamp
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action
              </TableHead>
              <TableHead className="w-[130px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actor
              </TableHead>
              <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Entity
              </TableHead>
              <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hash
              </TableHead>
              <TableHead className="w-[100px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-3.5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={6} className="h-72 sm:h-80 text-center text-destructive p-0 border-0">
                  <div className="flex flex-col items-center justify-center gap-size80 h-full w-full select-none">
                    <WarningRegular className="w-8 h-8" />
                    <p className="text-xs font-medium">Failed to retrieve audit log history.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="text-xs rounded-none cursor-pointer mt-size40"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={6} className="h-72 sm:h-80 text-center text-muted-foreground p-0 border-0">
                  <div className="flex flex-col items-center justify-center gap-size80 h-full w-full select-none">
                    <HistoryRegular className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-sm font-semibold text-foreground">No audit logs found</p>
                    <p className="text-xs text-muted-foreground">
                      No security audit events match the selected criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  {/* Timestamp */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </TableCell>

                  {/* Action Badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium py-0 h-5 px-2 rounded-none border ${
                        ACTION_BADGE_CLASSES[log.action] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ACTION_DISPLAY_NAMES[log.action] || log.action}
                    </Badge>
                  </TableCell>

                  {/* Actor ID */}
                  <TableCell className="font-mono text-xs text-foreground">
                    {log.actorId ? (
                      <span title={log.actorId}>{truncateHash(log.actorId)}</span>
                    ) : (
                      <span className="text-muted-foreground italic">System</span>
                    )}
                  </TableCell>

                  {/* Target Entity */}
                  <TableCell className="text-xs">
                    <div className="font-semibold text-foreground">{log.entityType}</div>
                    {log.entityId && (
                      <div
                        className="text-xs font-mono text-muted-foreground truncate"
                        title={log.entityId}
                      >
                        {log.entityId}
                      </div>
                    )}
                  </TableCell>

                  {/* Hash */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-size40">
                      <KeyRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span title={log.hash}>{truncateHash(log.hash)}</span>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="h-7 text-xs px-2.5 rounded-none font-medium gap-size40 cursor-pointer"
                    >
                      <EyeRegular className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Infinite Scroll Sentinel */}
        {hasNextPage && <div ref={sentinelRef} className="h-4 w-full" />}

        {isFetchingNextPage && (
          <div className="p-size120 flex justify-center text-xs text-muted-foreground animate-pulse">
            Loading more audit entries...
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="shrink-0 flex items-center justify-between p-size120 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
        <div>
          Showing <span className="font-medium text-foreground">{logs.length}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> entries
        </div>
        {hasNextPage && (
          <span className="text-[11px] text-muted-foreground">
            Scroll down to load more
          </span>
        )}
      </div>

      {/* Log Details Inspection Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-size80 text-base font-bold">
              <DocumentBulletListRegular className="w-5 h-5 text-primary" />
              Audit Log Record Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Event metadata and record payload.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-size160 py-size80 max-h-[60vh] overflow-y-auto pr-1">
              {/* Summary Metadata Grid */}
              <div className="grid grid-cols-2 gap-size120 p-size120 bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold">
                    Event Action
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs mt-1 py-0 h-4.5 px-1.5 rounded-none border ${
                      ACTION_BADGE_CLASSES[selectedLog.action] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ACTION_DISPLAY_NAMES[selectedLog.action] || selectedLog.action}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs font-semibold">
                    Timestamp
                  </span>
                  <span className="font-mono text-xs text-foreground block mt-1">
                    {formatDateTime(selectedLog.createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs font-semibold">
                    Actor ID
                  </span>
                  <span className="font-mono text-xs text-foreground block mt-1 break-all">
                    {selectedLog.actorId || "System / Automated"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs font-semibold">
                    IP Address
                  </span>
                  <span className="font-mono text-xs text-foreground block mt-1">
                    {selectedLog.ipAddress || "Internal (N/A)"}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-muted-foreground block text-xs font-semibold">
                    Target Entity
                  </span>
                  <span className="font-mono text-xs text-foreground block mt-1">
                    {selectedLog.entityType}{" "}
                    {selectedLog.entityId ? `(${selectedLog.entityId})` : ""}
                  </span>
                </div>
              </div>

              {/* Hash Details */}
              <div className="space-y-size80 p-size120 bg-muted/40 border border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1 text-xs">
                    <KeyRegular className="w-3.5 h-3.5 text-primary" />
                    Record Hashes
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Record Hash
                    </span>
                    <div className="flex items-center justify-between gap-2 p-1.5 bg-background border border-border/60 font-mono text-xs text-foreground break-all">
                      <span>{selectedLog.hash}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(selectedLog.hash, "hash")}
                        className="h-6 w-6 shrink-0 cursor-pointer"
                        title="Copy Hash"
                      >
                        {copiedHash === "hash" ? (
                          <CheckmarkRegular className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <CopyRegular className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Previous Hash
                    </span>
                    <div className="flex items-center justify-between gap-2 p-1.5 bg-background border border-border/60 font-mono text-xs text-foreground break-all">
                      <span>{selectedLog.prevHash || "(Genesis Record)"}</span>
                      {selectedLog.prevHash && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleCopy(selectedLog.prevHash!, "prevHash")}
                          className="h-6 w-6 shrink-0 cursor-pointer"
                          title="Copy Previous Hash"
                        >
                          {copiedHash === "prevHash" ? (
                            <CheckmarkRegular className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <CopyRegular className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payload Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <CodeRegular className="w-3.5 h-3.5 text-primary" />
                    Payload Details (JSON)
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy(JSON.stringify(selectedLog.details, null, 2), "payload")
                    }
                    className="h-6 text-xs px-1.5 text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                  >
                    {copiedHash === "payload" ? (
                      <>
                        <CheckmarkRegular className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyRegular className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </Button>
                </div>

                <pre className="p-size120 bg-muted/70 text-foreground font-mono text-xs overflow-x-auto border border-border/60 rounded-none max-h-48 leading-relaxed">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedLog(null)}
              className="text-xs rounded-none cursor-pointer"
            >
              <DismissRegular className="w-3.5 h-3.5 mr-1" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogsTab;
