import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Applicant } from "@/features/hr/shared/types";
import { useMembers } from "@/features/hr/shared/hooks/useMembers";
import { MemberFilterBar } from "@/features/hr/members/components/MemberFilterBar";
import { MemberDirectory } from "@/features/hr/members/components/MemberDirectory";
import { MemberProfileSheet } from "@/features/hr/members/components/MemberProfileSheet";

export const Route = createFileRoute("/_admin/members")({
  component: MembersRoute,
});

function MembersRoute() {
  const { data: members, isLoading, error } = useMembers();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState<string>("ALL");
  const [selectedMember, setSelectedMember] = React.useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      // 1. Filter by Department
      if (selectedDeptFilter !== "ALL" && m.department !== selectedDeptFilter) return false;

      // 2. Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(query) ||
          m.studentId.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.department.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [members, selectedDeptFilter, searchQuery]);

  const handleOpenProfile = (member: Applicant) => {
    setSelectedMember(member);
    setIsSheetOpen(true);
  };

  const handleContactMember = (member: Applicant) => {
    toast.success(`Message draft prepared for ${member.name}`, {
      description: `Opening local mail client for ${member.email}...`,
    });
    window.location.href = `mailto:${member.email}?subject=QCU%20MSC%20Community%20Update`;
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-7.5rem)] items-center justify-center">
        <span className="text-sm text-muted-foreground animate-pulse">Loading members...</span>
      </div>
    );
  }

  if (error || !members) {
    return (
      <div className="flex h-[calc(100vh-7.5rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive font-medium">Failed to load members</p>
          <p className="text-xs text-muted-foreground mt-1">Please check your backend connection or refresh.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-size320 w-full">
      {/* Top Action Bar (Filters & Search) */}
      <MemberFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedDept={selectedDeptFilter}
        onSelectDept={setSelectedDeptFilter}
      />

      {/* Main Grid View */}
      <MemberDirectory
        members={filteredMembers}
        onOpenProfile={handleOpenProfile}
        onContactMember={handleContactMember}
      />

      {/* Slide-out Sheet Profile Drawer */}
      <MemberProfileSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        member={selectedMember}
        onContact={handleContactMember}
      />
    </div>
  );
}

export default MembersRoute;
