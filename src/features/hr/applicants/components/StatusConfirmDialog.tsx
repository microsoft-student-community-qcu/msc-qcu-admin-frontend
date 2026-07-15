import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StatusConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicantEmail: string;
  pendingStatus: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const StatusConfirmDialog: React.FC<StatusConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  applicantName,
  applicantEmail,
  pendingStatus,
  onConfirm,
  onCancel,
}) => {
  const statusLabel = pendingStatus ? (STATUS_LABELS[pendingStatus] ?? pendingStatus) : "";

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none shadow-28 border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Status Mutation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change {applicantName}'s status to{" "}
            <strong>{statusLabel}</strong>? This transaction is monitored and will trigger the
            automated backend mailer to dispatch a branded status email to{" "}
            <strong>{applicantEmail}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none font-medium" onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-none bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Confirm and Dispatch
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusConfirmDialog;
