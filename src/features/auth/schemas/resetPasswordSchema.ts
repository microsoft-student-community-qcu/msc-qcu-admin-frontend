import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
