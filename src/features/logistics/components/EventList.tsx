import React, { useState } from "react";
import {
  SearchRegular,
  FilterRegular,
  AddRegular,
  CalendarRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import type { EventItem, EventType } from "../types";
import { EventCard } from "./EventCard";
import { CreateEventDialog } from "./CreateEventDialog";

export interface EventListProps {
  events: EventItem[];
  selectedEventId?: string | null;
  selectedId?: string | null;
  onSelectEventId?: (id: string) => void;
  onSelectId?: (id: string) => void;
  search?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchQueryChange?: (query: string) => void;
  typeFilter: EventType | "ALL";
  onTypeFilterChange: (type: EventType | "ALL") => void;
  onCreateEvent?: () => void;
  isLoading: boolean;
  error?: boolean;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  selectedEventId,
  selectedId,
  onSelectEventId,
  onSelectId,
  search,
  searchQuery,
  onSearchChange,
  onSearchQueryChange,
  typeFilter,
  onTypeFilterChange,
  onCreateEvent,
  isLoading,
  error,
}) => {
  const [isInternalCreateOpen, setIsInternalCreateOpen] = useState(false);

  const effectiveSelectedId =
    selectedEventId !== undefined ? selectedEventId : (selectedId ?? null);
  const handleSelect = (id: string) => {
    if (onSelectEventId) onSelectEventId(id);
    else if (onSelectId) onSelectId(id);
  };

  const effectiveSearch = search !== undefined ? search : (searchQuery ?? "");
  const handleSearchChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    if (onSearchQueryChange) onSearchQueryChange(val);
  };

  const handleCreateClick = () => {
    if (onCreateEvent) {
      onCreateEvent();
    } else {
      setIsInternalCreateOpen(true);
    }
  };

  return (
    <div className="w-80 md:w-96 shrink-0 flex flex-col h-full bg-card shadow-4 ring-1 ring-foreground/10">
      {/* Search, Filter & New Event Header */}
      <div className="p-size160 border-b border-border space-y-size120">
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={effectiveSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={typeFilter !== "ALL" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9 shrink-0 cursor-pointer"
                title="Filter by event type"
              >
                <FilterRegular className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by Event Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={typeFilter === "ALL"}
                  onCheckedChange={() => onTypeFilterChange("ALL")}
                >
                  All Events
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={typeFilter === "PUBLIC"}
                  onCheckedChange={() => onTypeFilterChange("PUBLIC")}
                >
                  Public
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={typeFilter === "MEMBERS_ONLY"}
                  onCheckedChange={() => onTypeFilterChange("MEMBERS_ONLY")}
                >
                  Members Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={handleCreateClick}
            className="h-9 px-3 text-xs gap-1 rounded-none font-medium shrink-0 cursor-pointer"
          >
            <AddRegular className="w-4 h-4" />
            <span>New Event</span>
          </Button>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-size40">
          <Button
            variant={typeFilter === "ALL" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTypeFilterChange("ALL")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            All
          </Button>
          <Button
            variant={typeFilter === "PUBLIC" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTypeFilterChange("PUBLIC")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Public
          </Button>
          <Button
            variant={typeFilter === "MEMBERS_ONLY" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTypeFilterChange("MEMBERS_ONLY")}
            className="h-7 text-xs px-2.5 rounded-none font-medium cursor-pointer"
          >
            Members
          </Button>
        </div>
      </div>

      {/* Scrollable Event List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="divide-y divide-border/60">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-size160 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-3 w-40" />
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-size320 flex flex-col items-center justify-center text-center py-20 hover:bg-transparent cursor-default border-0 select-none">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <WarningRegular className="w-5 h-5 text-destructive" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Failed to Load Events</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                Could not connect to the backend server. Please verify your connection.
              </p>
            </div>
          ) : events.length > 0 ? (
            events.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                isSelected={evt.id === effectiveSelectedId}
                onSelect={() => handleSelect(evt.id)}
              />
            ))
          ) : (
            <div className="p-size320 flex flex-col items-center justify-center text-center py-20 hover:bg-transparent cursor-default border-0 select-none">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarRegular className="w-5 h-5 text-muted-foreground/60" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">No Events Found</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                {effectiveSearch
                  ? `No search results for "${effectiveSearch}"`
                  : typeFilter !== "ALL"
                    ? `There are no events in the ${typeFilter.toLowerCase().replace(/_/g, " ")} category.`
                    : "Create an event to start managing logistics and attendees."}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Fallback Internal Create Event Dialog */}
      {!onCreateEvent && (
        <CreateEventDialog isOpen={isInternalCreateOpen} onOpenChange={setIsInternalCreateOpen} />
      )}
    </div>
  );
};

export default EventList;
