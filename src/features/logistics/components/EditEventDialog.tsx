import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EditRegular,
  LocationRegular,
  PeopleRegular,
  QrCodeRegular,
  CalendarRegular,
  InfoRegular,
  LockClosedRegular,
  ImageRegular,
} from "@fluentui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { EventItem } from "../types";
import { createEventSchema, type CreateEventFormValues } from "../schemas/eventSchemas";
import { useEventMutations } from "../hooks/useEventMutations";

export interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem | null;
}

const editSchema = createEventSchema;

function toDatetimeLocalString(dateString: string | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
}) => {
  const { updateEvent } = useEventMutations();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof editSchema>, unknown, CreateEventFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      type: "PUBLIC",
      venue: "",
      maxCapacity: 100,
      date: "",
      priorityStartDate: "",
      generalStartDate: "",
      registrationOpen: true,
      requiresQrTicket: true,
    },
  });

  useEffect(() => {
    if (event && isOpen) {
      reset({
        title: event.title || "",
        description: event.description || "",
        image: event.image || "",
        type: event.type || "PUBLIC",
        venue: event.venue || "",
        maxCapacity: event.maxCapacity ?? 100,
        date: toDatetimeLocalString(event.date),
        priorityStartDate: toDatetimeLocalString(event.priorityStartDate),
        generalStartDate: toDatetimeLocalString(event.generalStartDate),
        registrationOpen: event.registrationOpen ?? true,
        requiresQrTicket: event.requiresQrTicket ?? true,
      });
    }
  }, [event, isOpen, reset]);

  const onSubmit = async (data: CreateEventFormValues) => {
    if (!event) return;
    try {
      await updateEvent.mutateAsync({
        eventId: event.id,
        data,
      });
      onOpenChange(false);
    } catch {
      // Error notifications are handled by the mutation hook
    }
  };

  const isBusy = isSubmitting || updateEvent.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto rounded-none shadow-28 border border-border p-size320">
        <DialogHeader className="mb-size160">
          <DialogTitle className="flex items-center gap-size80 text-lg font-semibold text-foreground">
            <EditRegular className="size-5 text-primary shrink-0" />
            <span>Edit Event Parameters</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Update event specifications, venue logistics, timeline scheduling, and registration
            thresholds.
          </DialogDescription>
        </DialogHeader>

        {event && (
          <div className="flex items-center justify-between p-size160 bg-muted/30 border border-border/60 text-xs">
            <div className="flex items-center gap-size80">
              <PeopleRegular className="size-4 text-primary" />
              <span className="text-muted-foreground">Current Attendees:</span>
              <strong className="text-foreground">{event.registeredCount} registered</strong>
              <span className="text-muted-foreground font-mono">
                ({event.spotsRemaining} spots remaining)
              </span>
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              ID: {event.id.slice(0, 8)}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-size240">
          {/* Title */}
          <div className="space-y-size60">
            <Label htmlFor="edit-title" className="text-xs font-semibold text-foreground">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              placeholder="e.g. Annual Microsoft Tech Summit 2026"
              disabled={isBusy}
              className="h-10 text-sm rounded-none"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-xs text-destructive">{errors.title.message}</span>
            )}
          </div>

          {/* Event Type & Venue: 2 Column Grid with identical heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-size200 items-start">
            <div className="space-y-size60">
              <Label
                htmlFor="edit-type"
                className="text-xs font-semibold text-foreground flex items-center gap-size40"
              >
                <LockClosedRegular className="size-4 text-muted-foreground" />
                <span>
                  Event Type <span className="text-destructive">*</span>
                </span>
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      if (val) field.onChange(val);
                    }}
                    disabled={isBusy}
                  >
                    <SelectTrigger id="edit-type" className="w-full !h-10 rounded-none text-sm px-3 font-normal border-input bg-background">
                      <SelectValue placeholder="Select event type">
                        {field.value === "PUBLIC" && "Public (Open to All)"}
                        {field.value === "MEMBERS_ONLY" && "Members Only (MSC Members)"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-none shadow-8">
                      <SelectItem value="PUBLIC" className="text-xs">Public (Open to All)</SelectItem>
                      <SelectItem value="MEMBERS_ONLY" className="text-xs">Members Only (MSC Members)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <span className="text-xs text-destructive">{errors.type.message}</span>
              )}
            </div>

            <div className="space-y-size60">
              <Label
                htmlFor="edit-venue"
                className="text-xs font-semibold text-foreground flex items-center gap-size40"
              >
                <LocationRegular className="size-4 text-muted-foreground" />
                <span>
                  Venue / Location <span className="text-destructive">*</span>
                </span>
              </Label>
              <Input
                id="edit-venue"
                placeholder="e.g. QCU San Bartolome Auditorium / Teams"
                disabled={isBusy}
                className="h-10 text-sm rounded-none"
                {...register("venue")}
              />
              {errors.venue && (
                <span className="text-xs text-destructive">{errors.venue.message}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-size60">
            <Label htmlFor="edit-description" className="text-xs font-semibold text-foreground">
              Description
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Provide a comprehensive summary of the event schedule, key speakers, and prerequisites..."
              rows={3}
              disabled={isBusy}
              className="resize-none text-sm leading-relaxed rounded-none"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-xs text-destructive">{errors.description.message}</span>
            )}
          </div>

          {/* Cover Image URL */}
          <div className="space-y-size60">
            <Label
              htmlFor="edit-image"
              className="text-xs font-semibold text-foreground flex items-center gap-size40"
            >
              <ImageRegular className="size-4 text-muted-foreground" />
              <span>Event Banner / Cover Image URL</span>
            </Label>
            <Input
              id="edit-image"
              placeholder="e.g. https://images.unsplash.com/... or hosted asset URL"
              disabled={isBusy}
              className="h-10 text-sm rounded-none"
              {...register("image")}
            />
            {errors.image && (
              <span className="text-xs text-destructive">{errors.image.message}</span>
            )}
          </div>

          {/* Capacity & Registration Controls - Top Aligned Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-size200 p-size160 bg-muted/30 border border-border/60 items-start">
            {/* Column 1: Max Capacity */}
            <div className="space-y-size60">
              <Label
                htmlFor="edit-maxCapacity"
                className="text-xs font-semibold text-foreground flex items-center gap-size40"
              >
                <PeopleRegular className="size-4 text-muted-foreground" />
                <span>
                  Max Capacity <span className="text-destructive">*</span>
                </span>
              </Label>
              <Input
                id="edit-maxCapacity"
                type="number"
                min={event?.registeredCount || 1}
                placeholder="100"
                disabled={isBusy}
                className="h-10 text-sm rounded-none bg-background"
                {...register("maxCapacity", { valueAsNumber: true })}
              />
              {errors.maxCapacity && (
                <span className="text-xs text-destructive">{errors.maxCapacity.message}</span>
              )}
            </div>

            {/* Column 2: Registration Open Switch */}
            <div className="space-y-size60">
              <Label htmlFor="edit-registrationOpen" className="text-xs font-semibold text-foreground block">
                Registration Status
              </Label>
              <div className="h-10 flex items-center justify-between px-3 bg-background border border-input rounded-none">
                <span className="text-xs text-muted-foreground">Accept registrations</span>
                <Controller
                  control={control}
                  name="registrationOpen"
                  render={({ field }) => (
                    <Switch
                      id="edit-registrationOpen"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isBusy}
                    />
                  )}
                />
              </div>
            </div>

            {/* Column 3: Requires QR Ticket Switch */}
            <div className="space-y-size60">
              <Label
                htmlFor="edit-requiresQrTicket"
                className="text-xs font-semibold text-foreground flex items-center gap-size40"
              >
                <QrCodeRegular className="size-4 text-muted-foreground" />
                <span>Entry Ticket Pass</span>
              </Label>
              <div className="h-10 flex items-center justify-between px-3 bg-background border border-input rounded-none">
                <span className="text-xs text-muted-foreground">Requires QR Ticket</span>
                <Controller
                  control={control}
                  name="requiresQrTicket"
                  render={({ field }) => (
                    <Switch
                      id="edit-requiresQrTicket"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isBusy}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Timeline & Schedule Section */}
          <div className="space-y-size120 pt-size120 border-t border-border/60">
            <div className="flex items-center gap-size60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <CalendarRegular className="size-4 text-primary" />
              <span>Event Schedule & Registration Windows</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-size200">
              <div className="space-y-size60">
                <Label htmlFor="edit-priorityStartDate" className="text-xs font-semibold text-foreground">
                  Member Priority Start <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-priorityStartDate"
                  type="datetime-local"
                  disabled={isBusy}
                  className="h-10 text-xs rounded-none bg-background"
                  {...register("priorityStartDate")}
                />
                {errors.priorityStartDate && (
                  <span className="text-xs text-destructive">
                    {errors.priorityStartDate.message}
                  </span>
                )}
              </div>

              <div className="space-y-size60">
                <Label htmlFor="edit-generalStartDate" className="text-xs font-semibold text-foreground">
                  General Public Start <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-generalStartDate"
                  type="datetime-local"
                  disabled={isBusy}
                  className="h-10 text-xs rounded-none bg-background"
                  {...register("generalStartDate")}
                />
                {errors.generalStartDate && (
                  <span className="text-xs text-destructive">
                    {errors.generalStartDate.message}
                  </span>
                )}
              </div>

              <div className="space-y-size60">
                <Label htmlFor="edit-date" className="text-xs font-semibold text-foreground">
                  Event Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-date"
                  type="datetime-local"
                  disabled={isBusy}
                  className="h-10 text-xs rounded-none bg-background"
                  {...register("date")}
                />
                {errors.date && (
                  <span className="text-xs text-destructive">{errors.date.message}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-size60 p-size120 bg-muted/20 border border-border/40 text-xs text-muted-foreground">
              <InfoRegular className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>
                Schedule modifications may alter eligibility windows for pending registrant requests.
              </span>
            </div>
          </div>

          <DialogFooter className="pt-size160 border-t border-border/60 flex items-center justify-end gap-size120">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              className="h-9 px-4 text-xs font-medium rounded-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isBusy}
              className="h-9 px-4 text-xs font-medium rounded-none gap-1.5 bg-primary text-primary-foreground shadow-2 cursor-pointer"
            >
              <EditRegular className="size-4" />
              <span>{updateEvent.isPending ? "Saving..." : "Save Changes"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
