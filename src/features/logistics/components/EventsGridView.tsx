import * as React from "react";
import {
  CalendarRegular,
  AddRegular,
} from "@fluentui/react-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "../hooks/useEvents";
import type { EventItem } from "../types";
import { EventGridCard } from "./EventGridCard";
import { EventFilterBar } from "./EventFilterBar";
import { CreateEventDialog } from "./CreateEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { CancelEventDialog } from "./CancelEventDialog";

export function EventsGridView() {
  const {
    events,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
  } = useEvents({ all: true });

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<EventItem | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [cancelingEvent, setCancelingEvent] = React.useState<EventItem | null>(null);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsEditOpen(true);
  };

  const handleCancel = (event: EventItem) => {
    setCancelingEvent(event);
    setIsCancelOpen(true);
  };

  return (
    <div className="flex flex-col gap-size160 w-full relative">
      {/* Top Action Bar (Filters & Search) - Sticky / Stationary */}
      <div className="sticky top-[-32px] -mt-size320 pt-size320 pb-size80 z-10 bg-background/95 backdrop-blur-md -mx-size320 px-size320">
        <EventFilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          selectedType={typeFilter}
          onSelectType={setTypeFilter}
          onCreateEvent={() => setIsCreateOpen(true)}
        />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-size200 w-full">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="rounded-none border-transparent bg-card shadow-4 flex flex-col justify-between h-72"
            >
              <CardContent className="p-size160 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-2 w-full pt-2" />
              </CardContent>
              <div className="border-t border-border/60 p-size120 bg-muted/10 flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-7 w-28" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-size320 text-muted-foreground text-sm space-y-3 bg-card shadow-4 ring-1 ring-foreground/10 h-75 w-full">
          <CalendarRegular className="w-12 h-12 text-destructive/30" />
          <div className="text-center">
            <p className="font-semibold text-foreground">Failed to load events</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your backend connection or refresh.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-none text-xs h-8 cursor-pointer mt-1"
          >
            Try Again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-size320 text-muted-foreground text-sm space-y-3 bg-card shadow-4 ring-1 ring-foreground/10 h-75 w-full">
          <CalendarRegular className="w-12 h-12 text-muted-foreground/30" />
          <div className="text-center">
            <p className="font-semibold text-foreground">No events found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search || typeFilter !== "ALL"
                ? "Try adjusting your search filters or category selection."
                : "Create an event to start managing logistics and attendees."}
            </p>
          </div>
          {search || typeFilter !== "ALL" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
              }}
              className="rounded-none text-xs h-8 cursor-pointer mt-1"
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              onClick={() => setIsCreateOpen(true)}
              size="sm"
              className="rounded-none text-xs h-8 cursor-pointer gap-1.5 mt-1"
            >
              <AddRegular className="w-4 h-4" />
              <span>Create Event</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-size200 w-full">
          {events.map((event) => (
            <EventGridCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Edit Event Dialog */}
      <EditEventDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        event={editingEvent}
      />

      {/* Cancel Event Dialog */}
      <CancelEventDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        event={cancelingEvent}
      />
    </div>
  );
}

export default EventsGridView;
