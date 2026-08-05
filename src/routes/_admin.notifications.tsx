import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/notifications")({
  component: NotificationsRoute,
});

function NotificationsRoute() {
  return (
    <div className="p-size240 flex flex-col gap-size160 bg-background border border-border shadow-4 h-[calc(100vh-7.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbox & Notifications</h1>
      <p className="text-sm text-muted-foreground">
        Shared dashboard notification logs and inbox feed for general alerts.
      </p>
      {/* Placeholder content */}
      <div className="flex-1 border border-dashed border-border flex items-center justify-center text-muted-foreground italic text-sm">
        No new system notifications.
      </div>
    </div>
  );
}

export default NotificationsRoute;
