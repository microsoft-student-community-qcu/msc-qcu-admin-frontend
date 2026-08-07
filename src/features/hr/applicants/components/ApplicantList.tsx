import React from "react";
import { cn } from "@/lib/utils";
import { SearchRegular, PeopleRegular, WarningRegular, FilterRegular } from "@fluentui/react-icons";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Applicant } from "@/features/hr/shared/types";
import { formatOffice } from "@/features/hr/shared/utils/formatters";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const OFFICES = [
  "SECRETARIAT_OFFICE",
  "RELATIONS_OFFICE",
  "FINANCE_OFFICE",
  "LOGISTICS_OFFICE",
  "CREATIVES_OFFICE",
  "MANAGEMENT_AND_DEVELOPMENT_OFFICE",
  "STARTUP_DEVELOPERS_OFFICE",
];

type FilterTab =
  "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "RESUBMIT" | "CANCELLED" | "FOR_INTERVIEW";

interface ApplicantListProps {
  applicants: Applicant[];
  selectedId: string | null;
  onSelectId: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  activeTab: FilterTab;
  onActiveTabChange: (tab: FilterTab) => void;
  tabCounts: {
    ALL: number;
    PENDING_REVIEW: number;
    APPROVED: number;
    REJECTED: number;
    RESUBMIT: number;
    CANCELLED: number;
    FOR_INTERVIEW: number;
  };
  isLoading?: boolean;
  error?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  selectedOffices: string[];
  onSelectedOfficesChange: (offices: string[]) => void;
}

export const ApplicantList: React.FC<ApplicantListProps> = ({
  applicants,
  selectedId,
  onSelectId,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  activeTab,
  onActiveTabChange,
  tabCounts,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  selectedOffices,
  onSelectedOfficesChange,
}) => {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => fetchNextPage?.(),
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  return (
    <div className="w-[380px] shrink-0 flex flex-col h-full bg-card shadow-4 ring-1 ring-foreground/10">
      {/* Search & Tabs Header */}
      <div className="p-size160 border-b border-border space-y-size120">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                onSearchQueryChange(val);
                if (val.trim() === "" && onSearchSubmit) {
                  onSearchSubmit("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && onSearchSubmit) {
                  onSearchSubmit(searchQuery);
                }
              }}
              className="pl-9 h-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={selectedOffices.length > 0 ? "default" : "outline"}
                size="icon"
                className="h-9 w-9 shrink-0 cursor-pointer"
              >
                <FilterRegular className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by Office</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {OFFICES.map((office) => {
                  const isChecked = selectedOffices.includes(office);
                  return (
                    <DropdownMenuCheckboxItem
                      key={office}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onSelectedOfficesChange([...selectedOffices, office]);
                        } else {
                          onSelectedOfficesChange(selectedOffices.filter((o) => o !== office));
                        }
                      }}
                    >
                      {formatOffice(office)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Inline Tab Filters */}
        <div className="flex flex-wrap gap-size40">
          <Button
            variant={activeTab === "ALL" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("ALL")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            All ({tabCounts.ALL})
          </Button>
          <Button
            variant={activeTab === "PENDING_REVIEW" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("PENDING_REVIEW")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Pending ({tabCounts.PENDING_REVIEW})
          </Button>
          <Button
            variant={activeTab === "APPROVED" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("APPROVED")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Approved ({tabCounts.APPROVED})
          </Button>
          <Button
            variant={activeTab === "REJECTED" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("REJECTED")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Rejected ({tabCounts.REJECTED})
          </Button>
          <Button
            variant={activeTab === "RESUBMIT" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("RESUBMIT")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Resubmit ({tabCounts.RESUBMIT})
          </Button>
          <Button
            variant={activeTab === "FOR_INTERVIEW" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("FOR_INTERVIEW")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            For Interview ({tabCounts.FOR_INTERVIEW})
          </Button>
          <Button
            variant={activeTab === "CANCELLED" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("CANCELLED")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Cancelled ({tabCounts.CANCELLED})
          </Button>
        </div>
      </div>

      {/* Scrollable List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="divide-y divide-border/60">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-size160 flex items-start gap-size120">
                <Skeleton className="w-9 h-9 shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-size320 flex flex-col items-center justify-center text-center py-20">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <WarningRegular className="w-5 h-5 text-destructive" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Failed to Load</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                Could not connect to the backend server. Please verify your connection.
              </p>
            </div>
          ) : applicants.length > 0 ? (
            applicants.map((applicant) => {
              const isSelected = applicant.id === selectedId;

              return (
                <button
                  key={applicant.id}
                  onClick={() => onSelectId(applicant.id)}
                  className={cn(
                    "w-full text-left p-size160 flex items-start gap-size120 transition-colors border-l-2 cursor-pointer relative",
                    isSelected
                      ? "bg-accent border-l-primary"
                      : "hover:bg-muted/40 border-l-transparent bg-transparent",
                  )}
                >
                  <Avatar className="h-9 w-9 rounded-none shrink-0 border border-border/50">
                    <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xs font-semibold">
                      {applicant.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-size40">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-sm truncate text-foreground">
                          {applicant.name || "Unknown Applicant"}
                        </span>
                      </div>
                      <span
                        className="text-[10px] text-muted-foreground shrink-0 font-mono"
                        title={applicant.id || "no-id"}
                      >
                        {applicant.id ? applicant.id.slice(0, 8) : "N/A"}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground truncate">
                      {formatOffice(applicant.department)}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-size80">
                        {applicant.status === "PENDING_REVIEW" && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            Pending Review
                          </Badge>
                        )}
                        {applicant.manualApplication && applicant.status === "PENDING_REVIEW" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none flex items-center gap-1"
                            title="Manual ID Verification Required"
                          >
                            <WarningRegular className="w-3 h-3" />
                            Manual ID
                          </Badge>
                        )}
                        {applicant.status === "APPROVED" && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            Approved
                          </Badge>
                        )}
                        {applicant.status === "REJECTED" && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            Rejected
                          </Badge>
                        )}
                        {applicant.status === "CANCELLED" && (
                          <Badge
                            variant="outline"
                            className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            Cancelled
                          </Badge>
                        )}
                        {applicant.status === "RESUBMIT" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            Resubmit
                          </Badge>
                        )}
                        {applicant.status === "FOR_INTERVIEW" && (
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            For Interview
                          </Badge>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-muted-foreground font-mono">
                        {applicant.studentId}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-size320 flex flex-col items-center justify-center text-center py-20">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <PeopleRegular className="w-5 h-5 text-muted-foreground/60" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">No Applicants</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                {searchQuery
                  ? `No search results for "${searchQuery}"`
                  : `There are currently no applicants in the ${activeTab.toLowerCase().replace("_", " ")} pipeline.`}
              </p>
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          {hasNextPage && <div ref={sentinelRef} className="h-4 w-full" />}

          {isFetchingNextPage && (
            <div className="p-size120 flex justify-center text-xs text-muted-foreground animate-pulse">
              Loading more...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ApplicantList;
