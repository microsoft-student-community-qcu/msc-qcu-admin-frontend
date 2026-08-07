import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getApiBaseURL } from "@/utils/env";
import { toast } from "sonner";
import { Applicant } from "@/features/hr/shared/types";
import { usePaginatedApplicants } from "@/features/hr/shared/hooks/usePaginatedApplicants";
import { useUpdateApplicantStatus } from "@/features/hr/shared/hooks/useUpdateApplicantStatus";
import { useApproveManualId } from "@/features/hr/shared/hooks/useApproveManualId";
import { useApplicantCounts } from "@/features/hr/shared/hooks/useApplicantCounts";
import { useApplicant } from "@/features/hr/shared/hooks/useApplicant";
import { formatOffice } from "@/features/hr/shared/utils/formatters";
// Extracted Feature Components
import { ApplicantList } from "@/features/hr/applicants/components/ApplicantList";
import { ApplicantDetails } from "@/features/hr/applicants/components/ApplicantDetails";
import { StatusConfirmDialog } from "@/features/hr/applicants/components/StatusConfirmDialog";
import { ImageZoomDialog } from "@/features/hr/applicants/components/ImageZoomDialog";
import { useFilterStore } from "@/store/useFilterStore";

export const Route = createFileRoute("/_admin/applications")({
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
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || undefined,
    };
  },
  component: ApplicationsRoute,
});

type FilterTab =
  "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "RESUBMIT" | "CANCELLED" | "FOR_INTERVIEW";

function ApplicationsRoute() {
  const { id } = Route.useSearch();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const {
    applicantsSearch: searchQuery,
    setApplicantsSearch: setSearchQuery,
    applicantsSubmittedSearch: submittedSearchQuery,
    setApplicantsSubmittedSearch: setSubmittedSearchQuery,
    applicantsTab: activeTabRaw,
    setApplicantsTab: setActiveTabRaw,
    applicantsOffices: selectedOffices,
    setApplicantsOffices: setSelectedOffices,
  } = useFilterStore();
  const activeTab = activeTabRaw as FilterTab;
  const setActiveTab = (tab: FilterTab) => setActiveTabRaw(tab);

  const {
    data: applicantsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePaginatedApplicants({
    status: activeTab === "ALL" ? undefined : (activeTab as Applicant["status"]),
    search: submittedSearchQuery,
    office: selectedOffices.length > 0 ? selectedOffices.join(",") : undefined,
  });
  const { data: urlApplicant } = useApplicant(id);
  const { data: countsData } = useApplicantCounts();
  const updateStatusMutation = useUpdateApplicantStatus();
  const approveManualIdMutation = useApproveManualId();

  const applicants = React.useMemo(() => {
    if (!applicantsData) return [];
    const list = applicantsData.pages.flatMap((page) => page.applicants);
    if (urlApplicant && !list.some((app) => app.id === urlApplicant.id)) {
      return [urlApplicant, ...list];
    }
    return list;
  }, [applicantsData, urlApplicant]);

  // Sync selectedId with URL search param `id` if present
  React.useEffect(() => {
    if (id) {
      setSelectedId(id);
    }
  }, [id]);

  const isPendingSmtp = updateStatusMutation.isPending || approveManualIdMutation.isPending;

  // Status Mutation Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState<Applicant["status"] | null>(null);

  // ID Image Zoom State
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomImageSrc, setZoomImageSrc] = React.useState<string>("");
  const [zoomTitle, setZoomTitle] = React.useState<string>("");

  React.useEffect(() => {
    if (isLoading) return;
    if (applicants && applicants.length > 0 && !selectedId && !id) {
      setSelectedId(applicants[0].id);
    }
  }, [applicants, selectedId, id, isLoading]);

  const selectedApplicant = React.useMemo(() => {
    if (!applicants) return null;
    return applicants.find((app) => app.id === selectedId) || null;
  }, [applicants, selectedId]);

  // Count metrics for tabs
  const tabCounts = React.useMemo(() => {
    if (countsData) {
      return countsData;
    }
    // Fallback if not loaded
    return {
      ALL: 0,
      PENDING_REVIEW: 0,
      APPROVED: 0,
      REJECTED: 0,
      RESUBMIT: 0,
      CANCELLED: 0,
      FOR_INTERVIEW: 0,
    };
  }, [countsData]);

  // Filtered applicants
  const filteredApplicants = React.useMemo(() => {
    if (!applicants) return [];

    return applicants.filter((app) => {
      // 1. Filter by Tab
      if (activeTab === "PENDING_REVIEW" && app.status !== "PENDING_REVIEW") return false;
      if (activeTab === "APPROVED" && app.status !== "APPROVED") return false;
      if (activeTab === "REJECTED" && app.status !== "REJECTED") return false;
      if (activeTab === "RESUBMIT" && app.status !== "RESUBMIT") return false;
      if (activeTab === "CANCELLED" && app.status !== "CANCELLED") return false;
      if (activeTab === "FOR_INTERVIEW" && app.status !== "FOR_INTERVIEW") return false;

      // 2. Filter by Selected Offices
      if (selectedOffices.length > 0 && !selectedOffices.includes(app.department)) return false;

      // 3. Filter by Search Query
      if (submittedSearchQuery.trim() !== "") {
        const query = submittedSearchQuery.toLowerCase();
        return (
          (app.name?.toLowerCase() || "").includes(query) ||
          (app.studentId?.toLowerCase() || "").includes(query) ||
          (app.id?.toLowerCase() || "").includes(query) ||
          (app.department?.toLowerCase() || "").includes(query) ||
          (app.department?.toLowerCase() || "").replace(/_/g, " ").includes(query) ||
          formatOffice(app.department).toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [applicants, activeTab, selectedOffices, submittedSearchQuery]);

  // Auto-select first item in filtered list if current selected is not in the filtered list
  React.useEffect(() => {
    if (isLoading) return;

    if (filteredApplicants.length > 0) {
      const isStillInList = filteredApplicants.some((app) => app.id === selectedId);
      if (selectedId && !isStillInList) {
        setSelectedId(filteredApplicants[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredApplicants, selectedId, isLoading]);

  const triggerStatusChange = (status: Applicant["status"]) => {
    if (selectedApplicant?.status === status) return;
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = (message?: string, resubmitFields?: string[]) => {
    if (!selectedId || !pendingStatus) return;

    setIsConfirmOpen(false);

    const statusText =
      {
        PENDING_REVIEW: "Pending Review",
        APPROVED: "Approved",
        REJECTED: "Rejected",
        CANCELLED: "Cancelled",
        RESUBMIT: "Resubmit",
        FOR_INTERVIEW: "For Interview",
      }[pendingStatus] ?? pendingStatus;

    // Optimistically show success toast
    toast.success(`Applicant status updated to ${statusText}.`, {
      description: `Backend status updated and email dispatched successfully.`,
    });

    updateStatusMutation.mutate(
      {
        applicantId: selectedId,
        status: pendingStatus,
        message,
        resubmitFields,
      },
      {
        onError: (err) => {
          toast.error(`Failed to update status.`, {
            description: err.message || "An error occurred while updating status.",
          });
        },
      },
    );

    setPendingStatus(null);
  };

  const handleManualIdAction = (action: "approve" | "reject") => {
    if (!selectedId || !selectedApplicant) return;

    if (action === "approve" && !selectedApplicant.studentId) {
      toast.error("Cannot approve without a student ID.");
      return;
    }

    const actionText = action === "approve" ? "approved" : "rejected";
    toast.success(`Manual ID verification ${actionText} successfully.`);

    approveManualIdMutation.mutate({
      applicantId: selectedId,
      action,
      studentId: action === "approve" ? selectedApplicant.studentId : undefined,
    });
  };

  const handleZoomImage = (src: string, title: string) => {
    setZoomImageSrc(src);
    setZoomTitle(title);
    setIsZoomOpen(true);
  };

  return (
    <div className="flex gap-size240 h-[calc(100vh-7.5rem)]">
      {/* LEFT COLUMN: Master List */}
      <ApplicantList
        applicants={filteredApplicants}
        selectedId={selectedId}
        onSelectId={setSelectedId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={setSubmittedSearchQuery}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        tabCounts={tabCounts}
        isLoading={
          isLoading || (isFetching && !isFetchingNextPage && filteredApplicants.length === 0)
        }
        error={!!error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        selectedOffices={selectedOffices}
        onSelectedOfficesChange={setSelectedOffices}
      />

      {/* RIGHT COLUMN: Detail View */}
      <ApplicantDetails
        applicant={selectedApplicant}
        isPendingSmtp={isPendingSmtp}
        onStatusChange={triggerStatusChange}
        onZoomImage={handleZoomImage}
        onManualIdAction={handleManualIdAction}
        isLoading={isLoading}
        error={!!error}
      />

      {/* MODAL: Zoomed Image Overlay */}
      <ImageZoomDialog
        isOpen={isZoomOpen}
        onOpenChange={setIsZoomOpen}
        imageSrc={zoomImageSrc}
        title={zoomTitle}
      />

      {/* CONFIRMATION DIALOG: Status Mutation and Email Dispatch */}
      <StatusConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        applicantName={selectedApplicant?.name || ""}
        applicantEmail={selectedApplicant?.email || ""}
        pendingStatus={pendingStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
}
