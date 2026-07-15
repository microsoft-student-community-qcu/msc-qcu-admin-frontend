import React from "react";
import { SearchRegular, FilterRegular } from "@fluentui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MemberFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedDept: string;
  onSelectDept: (dept: string) => void;
}

const DEPARTMENTS = [
  "ALL",
  "Engineering / Development",
  "Design & Creatives",
  "Marketing & Communications",
  "Operations & Logistics",
  "Research & Curriculum",
  "General Member",
];

export const MemberFilterBar: React.FC<MemberFilterBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedDept,
  onSelectDept,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-size160 shrink-0 bg-background border border-border p-size160 shadow-2 w-full">
      {/* Search Bar */}
      <div className="flex items-center gap-3 relative max-w-sm w-full">
        <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search team directory..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <FilterRegular className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
        <div className="flex gap-1">
          {DEPARTMENTS.map((dept) => (
            <Button
              key={dept}
              variant={selectedDept === dept ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectDept(dept)}
              className="h-8 text-xs px-3 rounded-none font-medium whitespace-nowrap cursor-pointer"
            >
              {dept === "ALL" ? "All Departments" : dept}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberFilterBar;
