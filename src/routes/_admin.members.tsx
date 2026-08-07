import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getApiBaseURL } from "@/utils/env";
import { toast } from "sonner";
import { Applicant } from "@/features/hr/shared/types";
import { useMembers } from "@/features/hr/shared/hooks/useMembers";
import { MemberFilterBar } from "@/features/hr/members/components/MemberFilterBar";
import { MemberDirectory, MemberCardSkeleton } from "@/features/hr/members/components/MemberDirectory";
import { MemberProfileSheet } from "@/features/hr/members/components/MemberProfileSheet";
import { formatOffice } from "@/features/hr/shared/utils/formatters";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const Route = createFileRoute("/_admin/members")({
  beforeLoad: () => {
    try {
      const rawUser = sessionStorage.getItem("currentUser");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.role !== "ADMIN_HR") {
          throw redirect({ to: "/dashboard" });
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("Redirect")) throw e;
    }
  },
  component: MembersRoute,
});

function MembersRoute() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState<string>("ALL");

  const { data: membersData, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMembers({
    search: submittedSearchQuery,
    office: selectedDeptFilter === "ALL" ? undefined : selectedDeptFilter,
  });

  const members = React.useMemo(() => {
    if (!membersData) return [];
    return membersData.pages.flatMap((page) => page.applicants);
  }, [membersData]);

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => fetchNextPage?.(),
    enabled: !!hasNextPage && !isFetchingNextPage,
  });
  
  const [selectedMember, setSelectedMember] = React.useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      // 1. Filter by Department
      if (selectedDeptFilter !== "ALL" && m.department !== selectedDeptFilter) return false;

      // 2. Filter by Search Query
      if (submittedSearchQuery.trim() !== "") {
        const query = submittedSearchQuery.toLowerCase();
        return (
          (m.name?.toLowerCase() || "").includes(query) ||
          (m.studentId?.toLowerCase() || "").includes(query) ||
          (m.id?.toLowerCase() || "").includes(query) ||
          (m.department?.toLowerCase() || "").includes(query) ||
          (m.department?.toLowerCase() || "").replace(/_/g, " ").includes(query) ||
          formatOffice(m.department).toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [members, selectedDeptFilter, submittedSearchQuery]);

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
    <div className="flex flex-col gap-size320 w-full relative">
      {/* Top Action Bar (Filters & Search) - Sticky / Stationary */}
      <div className="sticky top-[-32px] -mt-size320 pt-size320 pb-size160 z-10 bg-background/95 backdrop-blur-md -mx-size320 px-size320">
        <MemberFilterBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchSubmit={setSubmittedSearchQuery}
          selectedDept={selectedDeptFilter}
          onSelectDept={setSelectedDeptFilter}
        />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-size200 w-full">
          {Array.from({ length: 8 }).map((_, index) => (
            <MemberCardSkeleton key={index} />
          ))}
        </div>
      ) : error || !members ? (
        <div className="flex h-[calc(100vh-15rem)] items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-destructive font-medium">Failed to load members</p>
            <p className="text-xs text-muted-foreground mt-1">Please check your backend connection or refresh.</p>
          </div>
        </div>
      ) : (
        <MemberDirectory
          members={filteredMembers}
          onOpenProfile={handleOpenProfile}
          onContactMember={handleContactMember}
        />
      )}

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div ref={sentinelRef} className="h-4 w-full" />
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center mt-size120 pb-size240 text-xs text-muted-foreground animate-pulse">
          Loading more...
        </div>
      )}

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
