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
import { Checkbox } from "@/components/ui/checkbox";

interface StatusConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicantEmail: string;
  pendingStatus: string | null;
  onConfirm: (message?: string, resubmitFields?: string[]) => void;
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
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const statusLabel = pendingStatus ? (STATUS_LABELS[pendingStatus] ?? pendingStatus) : "";
  
  // Need to provide instructions for student if status is RESUBMIT or optionally if REJECTED
  const requiresMessage = pendingStatus === "RESUBMIT";
  const allowsMessage = pendingStatus === "RESUBMIT" || pendingStatus === "REJECTED" || pendingStatus === "CANCELLED";
  
  // Disable confirm if message is empty OR (if status is RESUBMIT and no fields are selected)
  const isConfirmDisabled = 
    (requiresMessage && message.trim().length === 0) || 
    (requiresMessage && selectedFields.length === 0);

  useEffect(() => {
    if (isOpen) {
      setMessage(""); // Reset on open
      setSelectedFields([]); // Reset on open
    }
  }, [isOpen]);

  const handleConfirm = (e: React.MouseEvent) => {
    if (isConfirmDisabled) {
      e.preventDefault();
      return;
    }
    onConfirm(
      message.trim() || undefined,
      pendingStatus === "RESUBMIT" ? selectedFields : undefined
    );
  };

  const handleToggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
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
              <div className="pt-2 space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fields to Unlock for Resubmission *
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-personalInfo"
                      checked={selectedFields.includes("personalInfo")}
                      onCheckedChange={() => handleToggleField("personalInfo")}
                    />
                    <label htmlFor="field-personalInfo" className="text-sm font-medium leading-none select-none cursor-pointer">
                      Personal Information
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-certificateOfRegistration"
                      checked={selectedFields.includes("certificateOfRegistration")}
                      onCheckedChange={() => handleToggleField("certificateOfRegistration")}
                    />
                    <label htmlFor="field-certificateOfRegistration" className="text-sm font-medium leading-none select-none cursor-pointer">
                      Certificate of Registration (File)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-curriculumVitae"
                      checked={selectedFields.includes("curriculumVitae")}
                      onCheckedChange={() => handleToggleField("curriculumVitae")}
                    />
                    <label htmlFor="field-curriculumVitae" className="text-sm font-medium leading-none select-none cursor-pointer">
                      Curriculum Vitae (File)
                    </label>
                  </div>
                </div>
              </div>
            )}
            {requiresMessage && (
              <p className="text-xs text-muted-foreground pt-1">
                The applicant will only be able to edit the unlocked items.
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
