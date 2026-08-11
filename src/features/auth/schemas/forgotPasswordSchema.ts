import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
