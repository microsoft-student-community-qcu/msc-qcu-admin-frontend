import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";
import { ClockRegular, ArrowRightRegular } from "@fluentui/react-icons";
import { formatTimeAgo } from "@/utils/date";
import { useNavigate } from "@tanstack/react-router";
import { formatOffice } from "@/features/hr/shared/utils/formatters";

export const PendingReviewQueue: React.FC = () => {
  const { data: applicants, isLoading, error } = useApplicants({ status: "PENDING_REVIEW", limit: 5 });
  const navigate = useNavigate();

  const pendingList = React.useMemo(() => {
    if (!applicants) return [];
    return [...applicants]
      .sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()) // oldest first
      .slice(0, 5);
  }, [applicants]);

  const handleReviewAll = () => {
    navigate({ to: "/applications" });
  };

  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between pb-size80">
        <div>
          <CardTitle>Pending Review Queue</CardTitle>
          <CardDescription>Intake pipeline items requiring immediate attention</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReviewAll}
          className="text-xs font-semibold h-8 rounded-none cursor-pointer flex items-center gap-1.5"
        >
          <span>View All</span>
          <ArrowRightRegular className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pb-4 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
          </div>
        ) : error || !applicants ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-xs text-destructive">Failed to load pending queue</p>
          </div>
        ) : pendingList.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-xs text-muted-foreground">No pending items in queue</p>
          </div>
        ) : (
          <div className="flex flex-col gap-size120">
            {pendingList.map((app) => (
              <div
                key={app.id}
                onClick={() => navigate({ to: "/applications", search: { id: app.id } })}
                className="flex items-center justify-between p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="h-9 w-9 rounded-none shrink-0 border border-border/50">
                    <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xs font-semibold">
                      {app.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none truncate text-foreground" title={app.name}>
                      {app.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate" title={formatOffice(app.department)}>
                      {formatOffice(app.department)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                  <Badge
                    variant="outline"
                    className="font-normal text-xs bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/15 whitespace-nowrap"
                  >
                    Pending Review
                  </Badge>
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

export default PendingReviewQueue;
