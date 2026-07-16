import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format. Please use a valid email address." }),
  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
