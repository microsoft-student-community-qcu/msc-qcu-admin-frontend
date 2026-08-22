import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarningRegular, DismissRegular } from "@fluentui/react-icons";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { EventItem } from "../types";
import { cancelEventSchema, type CancelEventFormValues } from "../schemas/eventSchemas";
import { useEventMutations } from "../hooks/useEventMutations";

export interface CancelEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem | null;
}

export const CancelEventDialog: React.FC<CancelEventDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
}) => {
  const { cancelEvent } = useEventMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CancelEventFormValues>({
    resolver: zodResolver(cancelEventSchema),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ reason: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CancelEventFormValues) => {
    if (!event) return;
    try {
      await cancelEvent.mutateAsync({
        eventId: event.id,
        data,
      });
      reset({ reason: "" });
      onOpenChange(false);
    } catch {
      // Error notifications are handled by the useCancelEventMutation hook
    }
  };

  const isBusy = isSubmitting || cancelEvent.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none shadow-28 border border-border sm:max-w-md p-size240">
        <AlertDialogHeader className="mb-size120">
          <div className="flex items-center gap-size80 text-amber-600 dark:text-amber-500">
            <WarningRegular className="size-5 shrink-0" />
            <AlertDialogTitle className="font-heading text-sm font-semibold text-foreground">
              Cancel Event
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground pt-size40 text-left">
            Cancelling <strong className="text-foreground">{event?.title || "this event"}</strong>{" "}
            is an irreversible administrative operation. This will soft-delete the event and
            broadcast an immediate cancellation email notification to all{" "}
            <strong className="text-foreground">
              {event?.registeredCount ?? 0} registered attendee(s)
            </strong>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-size160">
          <div className="space-y-size60">
            <Label htmlFor="cancel-reason" className="text-xs font-medium">
              Cancellation Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="State a comprehensive justification for the cancellation (minimum 10 characters). This explanation will be dispatched directly to all registered attendees..."
              rows={4}
              disabled={isBusy}
              className="resize-none"
              {...register("reason")}
            />
            {errors.reason && (
              <span className="text-xs text-destructive">{errors.reason.message}</span>
            )}
          </div>

          <AlertDialogFooter className="mt-size240 pt-size160 border-t border-border/60 flex sm:justify-end gap-size80">
            <AlertDialogCancel
              type="button"
              disabled={isBusy}
              onClick={() => onOpenChange(false)}
              className="rounded-none cursor-pointer text-xs"
            >
              Keep Event
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={isBusy}
              className="rounded-none cursor-pointer text-xs gap-size60 font-medium"
            >
              <DismissRegular className="size-4" />
              <span>{isBusy ? "Cancelling Event..." : "Confirm Cancellation"}</span>
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelEventDialog;
