import React from "react";
import { cn } from "@/lib/utils";
import { SearchRegular, PeopleRegular } from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Applicant } from "@/mocks/applicants";

type FilterTab = "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FOR_COMPLIANCE" | "CANCELLED";

interface ApplicantListProps {
  applicants: Applicant[];
  selectedId: string | null;
  onSelectId: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: FilterTab;
  onActiveTabChange: (tab: FilterTab) => void;
  tabCounts: {
    ALL: number;
    PENDING_REVIEW: number;
    APPROVED: number;
    REJECTED: number;
    FOR_COMPLIANCE: number;
    CANCELLED: number;
  };
}

export const ApplicantList: React.FC<ApplicantListProps> = ({
  applicants,
  selectedId,
  onSelectId,
  searchQuery,
  onSearchQueryChange,
  activeTab,
  onActiveTabChange,
  tabCounts,
}) => {
  return (
    <div className="w-[380px] shrink-0 flex flex-col h-full bg-background border border-border shadow-4">
      {/* Search & Tabs Header */}
      <div className="p-size160 border-b border-border space-y-size120">
        <div className="relative">
          <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9 h-9"
          />
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
            variant={activeTab === "FOR_COMPLIANCE" ? "default" : "ghost"}
            size="sm"
            onClick={() => onActiveTabChange("FOR_COMPLIANCE")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Compliance ({tabCounts.FOR_COMPLIANCE})
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
          {applicants.length > 0 ? (
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
                      {applicant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-size40">
                      <span className="font-semibold text-sm truncate text-foreground">
                        {applicant.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {applicant.id}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground truncate">
                      {applicant.department}
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
                        {applicant.status === "FOR_COMPLIANCE" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                          >
                            For Compliance
                          </Badge>
                        )}
                      </div>

                      <span className="text-[10px] text-muted-foreground font-mono">
                        {applicant.studentId}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-size320 text-center text-muted-foreground text-sm space-y-2">
              <PeopleRegular className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p>No applicants found matching filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ApplicantList;
