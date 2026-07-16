import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const InboxPanel: React.FC = () => {
  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full lg:col-span-1 min-h-0">
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Recent notifications</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto pb-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Update</span>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Maintenance scheduled for tomorrow at 2 AM.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">New Message</span>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Sarah commented on your recent proposal.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InboxPanel;
