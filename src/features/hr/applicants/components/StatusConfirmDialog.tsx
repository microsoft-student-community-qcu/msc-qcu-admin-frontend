import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StatusConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicantEmail: string;
  pendingStatus: string | null;
  onConfirm: (message?: string) => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  RESUBMIT: "Resubmit",
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
  const [message, setMessage] = useState("");
  const statusLabel = pendingStatus ? (STATUS_LABELS[pendingStatus] ?? pendingStatus) : "";
  
  // Need to provide instructions for student if status is RESUBMIT or optionally if REJECTED
  const requiresMessage = pendingStatus === "RESUBMIT";
  const allowsMessage = pendingStatus === "RESUBMIT" || pendingStatus === "REJECTED" || pendingStatus === "CANCELLED";
  
  const isConfirmDisabled = requiresMessage && message.trim().length === 0;

  useEffect(() => {
    if (isOpen) {
      setMessage(""); // Reset on open
    }
  }, [isOpen]);

  const handleConfirm = (e: React.MouseEvent) => {
    if (isConfirmDisabled) {
      e.preventDefault();
      return;
    }
    onConfirm(message.trim() || undefined);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none shadow-28 border border-border sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Status Mutation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change {applicantName}'s status to{" "}
            <strong>{statusLabel}</strong>? This transaction is monitored and will trigger the
            automated backend mailer to dispatch a branded status email to{" "}
            <strong>{applicantEmail}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {allowsMessage && (
          <div className="py-4 space-y-2">
            <Label htmlFor="status-message">
              Notification Message {requiresMessage && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="status-message"
              placeholder={
                requiresMessage 
                  ? "Enter instructions for what the applicant needs to resubmit..." 
                  : "Enter an optional message for the applicant..."
              }
              className="resize-none h-24 rounded-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {requiresMessage && (
              <p className="text-xs text-muted-foreground">
                This message will be included in the email sent to the applicant.
              </p>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none font-medium" onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
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
