import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockRegular } from "@fluentui/react-icons";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";
import { formatTimeAgo } from "@/utils/date";

export const RecentApplicationsList: React.FC = () => {
  const { data: applicants, isLoading, error } = useApplicants();

  const sortedApplicants = React.useMemo(() => {
    if (!applicants) return [];
    return [...applicants]
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
      .slice(0, 5);
  }, [applicants]);

  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col lg:col-span-1 lg:row-span-2 h-full min-h-0">
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest membership applications</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto pb-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
          </div>
        ) : error || !applicants ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-xs text-destructive">Failed to load applications</p>
          </div>
        ) : sortedApplicants.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-xs text-muted-foreground">No recent applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedApplicants.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                  {app.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate" title={app.name}>{app.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 truncate" title={app.department}>{app.department}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                {(() => {
                  if (app.status === "APPROVED") {
                    return (
                      <Badge
                        variant="default"
                        className="font-normal text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 whitespace-nowrap"
                      >
                        Approved
                      </Badge>
                    );
                  }
                  if (app.status === "REJECTED") {
                    return (
                      <Badge variant="destructive" className="font-normal text-xs whitespace-nowrap">
                        Rejected
                      </Badge>
                    );
                  }
                  if (app.status === "PENDING_REVIEW") {
                    if (app.manualApplication) {
                      return (
                        <Badge
                          variant="outline"
                          className="font-normal text-xs bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-emerald-400 border border-amber-500/30 hover:bg-amber-500/15 whitespace-nowrap"
                        >
                          Quarantined
                        </Badge>
                      );
                    }
                    return (
                      <Badge
                        variant="outline"
                        className="font-normal text-xs bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/15 whitespace-nowrap"
                      >
                        Pending Review
                      </Badge>
                    );
                  }
                  if (app.status === "FOR_COMPLIANCE") {
                    return (
                      <Badge
                        variant="outline"
                        className="font-normal text-xs bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/15 whitespace-nowrap"
                      >
                        For Compliance
                      </Badge>
                    );
                  }
                  if (app.status === "CANCELLED") {
                    return (
                      <Badge
                        variant="outline"
                        className="font-normal text-xs bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/20 hover:bg-slate-500/15 whitespace-nowrap"
                      >
                        Cancelled
                      </Badge>
                    );
                  }
                  return (
                    <Badge variant="outline" className="font-normal text-xs whitespace-nowrap">
                      {app.status}
                    </Badge>
                  );
                })()}
                <span className="text-xs flex items-center text-muted-foreground mt-1 gap-1">
                  <ClockRegular className="w-3.5 h-3.5" />
                  {formatTimeAgo(app.submissionDate)}
                </span>
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentApplicationsList;
