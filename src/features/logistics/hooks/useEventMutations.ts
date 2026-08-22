import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createEvent,
  updateEvent,
  cancelEvent,
  approveRegistration,
  rejectRegistration,
  checkInRegistration,
  resendTicketEmail,
} from "../services/eventApi";
import type { CreateEventFormValues, CancelEventFormValues } from "../schemas/eventSchemas";

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventFormValues) => createEvent(data),
    onSuccess: (data) => {
      toast.success("Event created successfully", {
        description: `${data.title} is now active.`,
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to create event", {
        description: err.message,
      });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Partial<CreateEventFormValues> }) =>
      updateEvent(eventId, data),
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to update event", {
        description: err.message,
      });
    },
  });
}

export function useCancelEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: CancelEventFormValues }) =>
      cancelEvent(eventId, data),
    onSuccess: () => {
      toast.success("Event cancelled successfully", {
        description: "Registered attendees have been notified via email.",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to cancel event", {
        description: err.message,
      });
    },
  });
}

export function useApproveRegistrationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, registrationId }: { eventId: string; registrationId: string }) =>
      approveRegistration(eventId, registrationId),
    onSuccess: () => {
      toast.success("Registration approved", {
        description: "QR ticket dispatched to registrant.",
      });
      queryClient.invalidateQueries({ queryKey: ["events", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to approve registration", {
        description: err.message,
      });
    },
  });
}

export function useRejectRegistrationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, registrationId }: { eventId: string; registrationId: string }) =>
      rejectRegistration(eventId, registrationId),
    onSuccess: () => {
      toast.success("Registration rejected", {
        description: "Status updated and spot released.",
      });
      queryClient.invalidateQueries({ queryKey: ["events", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to reject registration", {
        description: err.message,
      });
    },
  });
}

export function useCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, registrationId }: { eventId: string; registrationId: string }) =>
      checkInRegistration(eventId, registrationId),
    onSuccess: () => {
      toast.success("Attendee checked in successfully");
      queryClient.invalidateQueries({ queryKey: ["events", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to check in attendee", {
        description: err.message,
      });
    },
  });
}

export function useResendTicketMutation() {
  return useMutation({
    mutationFn: ({ eventId, registrationId }: { eventId: string; registrationId: string }) =>
      resendTicketEmail(eventId, registrationId),
    onSuccess: () => {
      toast.success("QR ticket re-dispatched to attendee email");
    },
    onError: (err: Error) => {
      toast.error("Failed to resend ticket", {
        description: err.message,
      });
    },
  });
}

export function useEventMutations() {
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const cancelEventMutation = useCancelEventMutation();
  const approveRegistrationMutation = useApproveRegistrationMutation();
  const rejectRegistrationMutation = useRejectRegistrationMutation();
  const checkInMutation = useCheckInMutation();
  const resendTicketMutation = useResendTicketMutation();

  return {
    createEvent: createEventMutation,
    updateEvent: updateEventMutation,
    cancelEvent: cancelEventMutation,
    approveRegistration: approveRegistrationMutation,
    rejectRegistration: rejectRegistrationMutation,
    checkIn: checkInMutation,
    resendTicket: resendTicketMutation,
  };
}

export default useEventMutations;
