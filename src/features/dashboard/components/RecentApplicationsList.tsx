import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockRegular } from "@fluentui/react-icons";
import { recentApplications } from "@/mocks/dashboard";

export const RecentApplicationsList: React.FC = () => {
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
        <div className="space-y-4">
          {recentApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                  {app.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{app.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{app.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {(() => {
                  if (app.status === "APPROVED") {
                    return (
                      <Badge
                        variant="default"
                        className="font-normal text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15"
                      >
                        Approved
                      </Badge>
                    );
                  }
                  if (app.status === "REJECTED") {
                    return (
                      <Badge variant="destructive" className="font-normal text-xs">
                        Rejected
                      </Badge>
                    );
                  }
                  if (app.status === "PENDING_REVIEW") {
                    if (app.manual_application) {
                      return (
                        <Badge
                          variant="outline"
                          className="font-normal text-xs bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-emerald-400 border border-amber-500/30 hover:bg-amber-500/15"
                        >
                          Quarantined
                        </Badge>
                      );
                    }
                    return (
                      <Badge variant="secondary" className="font-normal text-xs">
                        Pending Review
                      </Badge>
                    );
                  }
                  if (app.status === "FOR_COMPLIANCE") {
                    return (
                      <Badge
                        variant="outline"
                        className="font-normal text-xs bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/15"
                      >
                        For Compliance
                      </Badge>
                    );
                  }
                  if (app.status === "CANCELLED") {
                    return (
                      <Badge
                        variant="outline"
                        className="font-normal text-xs bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/20 hover:bg-slate-500/15"
                      >
                        Cancelled
                      </Badge>
                    );
                  }
                  return (
                    <Badge variant="outline" className="font-normal text-xs">
                      {app.status}
                    </Badge>
                  );
                })()}
                <span className="text-xs flex items-center text-muted-foreground mt-1 gap-1">
                  <ClockRegular className="w-3.5 h-3.5" />
                  {app.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplicationsList;
