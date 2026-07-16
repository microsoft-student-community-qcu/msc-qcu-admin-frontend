import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Applicant } from "@/features/hr/shared/types";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";
import { useUpdateApplicantStatus } from "@/features/hr/shared/hooks/useUpdateApplicantStatus";

// Extracted Feature Components
import { ApplicantList } from "@/features/hr/applicants/components/ApplicantList";
import { ApplicantDetails } from "@/features/hr/applicants/components/ApplicantDetails";
import { StatusConfirmDialog } from "@/features/hr/applicants/components/StatusConfirmDialog";
import { ImageZoomDialog } from "@/features/hr/applicants/components/ImageZoomDialog";

export const Route = createFileRoute("/_admin/applications")({
  component: ApplicationsRoute,
});

type FilterTab = "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FOR_COMPLIANCE" | "CANCELLED";

function ApplicationsRoute() {
  const { data: applicants, isLoading, error } = useApplicants();
  const updateStatusMutation = useUpdateApplicantStatus();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<FilterTab>("ALL");

  const isPendingSmtp = updateStatusMutation.isPending;

  // Status Mutation Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState<Applicant["status"] | null>(null);

  // ID Image Zoom State
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomImageSrc, setZoomImageSrc] = React.useState<string>("");
  const [zoomTitle, setZoomTitle] = React.useState<string>("");

  React.useEffect(() => {
    if (applicants && applicants.length > 0 && !selectedId) {
      setSelectedId(applicants[0].id);
    }
  }, [applicants, selectedId]);

  const selectedApplicant = React.useMemo(() => {
    if (!applicants) return null;
    return applicants.find((app) => app.id === selectedId) || null;
  }, [applicants, selectedId]);

  // Count metrics for tabs
  const tabCounts = React.useMemo(() => {
    if (!applicants) {
      return {
        ALL: 0,
        PENDING_REVIEW: 0,
        APPROVED: 0,
        REJECTED: 0,
        FOR_COMPLIANCE: 0,
        CANCELLED: 0,
      };
    }
    return {
      ALL: applicants.length,
      PENDING_REVIEW: applicants.filter((app) => app.status === "PENDING_REVIEW").length,
      APPROVED: applicants.filter((app) => app.status === "APPROVED").length,
      REJECTED: applicants.filter((app) => app.status === "REJECTED").length,
      FOR_COMPLIANCE: applicants.filter((app) => app.status === "FOR_COMPLIANCE").length,
      CANCELLED: applicants.filter((app) => app.status === "CANCELLED").length,
    };
  }, [applicants]);

  // Filtered applicants
  const filteredApplicants = React.useMemo(() => {
    if (!applicants) return [];
    return applicants.filter((app) => {
      // 1. Filter by Tab
      if (activeTab === "PENDING_REVIEW" && app.status !== "PENDING_REVIEW") return false;
      if (activeTab === "APPROVED" && app.status !== "APPROVED") return false;
      if (activeTab === "REJECTED" && app.status !== "REJECTED") return false;
      if (activeTab === "FOR_COMPLIANCE" && app.status !== "FOR_COMPLIANCE") return false;
      if (activeTab === "CANCELLED" && app.status !== "CANCELLED") return false;

      // 2. Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(query) ||
          app.studentId.toLowerCase().includes(query) ||
          app.id.toLowerCase().includes(query) ||
          app.department.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [applicants, activeTab, searchQuery]);

  // Auto-select first item in filtered list if current selected is not in the filtered list
  React.useEffect(() => {
    if (filteredApplicants.length > 0) {
      const isStillInList = filteredApplicants.some((app) => app.id === selectedId);
      if (!isStillInList) {
        setSelectedId(filteredApplicants[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredApplicants, selectedId]);

  const triggerStatusChange = (status: Applicant["status"]) => {
    if (selectedApplicant?.status === status) return;
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedId || !pendingStatus) return;

    setIsConfirmOpen(false);

    try {
      await updateStatusMutation.mutateAsync({ applicantId: selectedId, status: pendingStatus });
      toast.success(`Applicant status updated to ${pendingStatus}.`, {
        description: `Backend status updated and email dispatched successfully.`,
      });
    } catch (err) {
      console.warn("Failed to update status on backend.", err);
      toast.error(`Failed to update status on backend.`);
    } finally {
      setPendingStatus(null);
    }
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
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        tabCounts={tabCounts}
        isLoading={isLoading}
        error={!!error}
      />

      {/* RIGHT COLUMN: Detail View */}
      <ApplicantDetails
        applicant={selectedApplicant}
        isPendingSmtp={isPendingSmtp}
        onStatusChange={triggerStatusChange}
        onZoomImage={handleZoomImage}
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
