import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { mockApplicants, Applicant } from "@/mocks/applicants";
import { MemberFilterBar } from "@/features/hr/members/components/MemberFilterBar";
import { MemberDirectory } from "@/features/hr/members/components/MemberDirectory";
import { MemberProfileSheet } from "@/features/hr/members/components/MemberProfileSheet";

export const Route = createFileRoute("/_admin/members")({
  component: MembersRoute,
});

function MembersRoute() {
  // Only display APPROVED applicants as active members
  const [members] = React.useState<Applicant[]>(() =>
    mockApplicants.filter((app) => app.status === "APPROVED"),
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState<string>("ALL");
  const [selectedMember, setSelectedMember] = React.useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
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

  return (
    <div className="flex flex-col gap-size320 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
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
