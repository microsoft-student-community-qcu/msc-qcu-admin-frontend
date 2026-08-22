import * as React from "react";
import { SearchRegular, FilterRegular, AddRegular } from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EventType } from "../types";

interface EventFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedType: EventType | "ALL";
  onSelectType: (type: EventType | "ALL") => void;
  onCreateEvent: () => void;
}

const EVENT_TYPES: { key: EventType | "ALL"; label: string }[] = [
  { key: "ALL", label: "All Events" },
  { key: "PUBLIC", label: "Public" },
  { key: "MEMBERS_ONLY", label: "Members Only" },
];

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedType,
  onSelectType,
  onCreateEvent,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-size160 shrink-0 bg-card p-size160 shadow-4 ring-1 ring-foreground/10 w-full">
      {/* Search Bar */}
      <div className="flex items-center gap-3 relative max-w-sm w-full">
        <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events by title, venue..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-9 h-9 text-xs sm:text-sm rounded-none bg-background placeholder:text-muted-foreground"
        />
      </div>

      {/* Type Filter Buttons & New Event */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <FilterRegular className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
        <div className="flex gap-1">
          {EVENT_TYPES.map((type) => (
            <Button
              key={type.key}
              variant={selectedType === type.key ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectType(type.key)}
              className="h-8 text-xs px-3 rounded-none font-medium whitespace-nowrap cursor-pointer"
            >
              {type.label}
            </Button>
          ))}
        </div>

        <div className="h-5 w-px bg-border/60 mx-1 hidden sm:block" />

        <Button
          onClick={onCreateEvent}
          size="sm"
          className="h-8 px-3 text-xs font-medium rounded-none gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-1 cursor-pointer shrink-0"
        >
          <AddRegular className="w-4 h-4" />
          <span>New Event</span>
        </Button>
      </div>
    </div>
  );
};

export default EventFilterBar;
