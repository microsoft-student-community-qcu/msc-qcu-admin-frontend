import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().trim().min(3, { message: "Event title must be at least 3 characters long." }),
    description: z.string().trim().optional(),
    image: z
      .string()
      .trim()
      .url({ message: "Please enter a valid image URL (e.g. https://...)." })
      .optional()
      .or(z.literal("")),
    type: z.enum(["PUBLIC", "MEMBERS_ONLY"], {
      message: "Please select a valid event type.",
    }),
    venue: z.string().trim().optional(),
    maxCapacity: z.coerce
      .number({ message: "Max capacity must be a valid number." })
      .int({ message: "Max capacity must be a whole integer." })
      .positive({ message: "Max capacity must be greater than 0." }),
    date: z.string().min(1, { message: "Event date and time is required." }),
    priorityStartDate: z
      .string()
      .min(1, { message: "Member priority registration start date is required." }),
    generalStartDate: z
      .string()
      .min(1, { message: "General public registration start date is required." }),
    registrationOpen: z.boolean().default(true),
    requiresQrTicket: z.boolean().default(true),
  })
  .refine((data) => new Date(data.priorityStartDate) <= new Date(data.generalStartDate), {
    message: "Member priority start date must be before or equal to general start date.",
    path: ["generalStartDate"],
  })
  .refine((data) => new Date(data.generalStartDate) <= new Date(data.date), {
    message: "General start date must be before or equal to the event date.",
    path: ["date"],
  });

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type CreateEventInput = CreateEventFormValues;

export const cancelEventSchema = z.object({
  reason: z.string().trim().min(10, {
    message: "Cancellation reason must be at least 10 characters for attendee broadcast.",
  }),
});

export type CancelEventFormValues = z.infer<typeof cancelEventSchema>;
export type CancelEventInput = CancelEventFormValues;
