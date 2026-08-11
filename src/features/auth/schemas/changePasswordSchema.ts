import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current password is required" })
      .min(1, { message: "Please enter your current password" }),
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
