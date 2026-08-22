import { z } from "zod";
import { ALL_ROLES } from "@/types/roles";

export const updateUserRoleSchema = z.object({
  role: z.enum(ALL_ROLES, {
    message: "Please select a valid user role",
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const updateSettingsSchema = z
  .object({
    events_registration_open: z
      .boolean({ message: "Registration setting must be a boolean" })
      .optional(),
    merch_shop_open: z.boolean({ message: "Merch shop setting must be a boolean" }).optional(),
    maintenance_mode: z.boolean({ message: "Maintenance mode must be a boolean" }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one setting must be provided for update",
  });

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
