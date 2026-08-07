import { z } from "zod";

export const editApplicantSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  middleInitial: z
    .string()
    .regex(/^[A-Za-z]\.?$/, {
      message:
        "Middle initial must be a single letter, optionally followed by a dot (e.g., B or B.)",
    })
    .optional()
    .or(z.literal("")),
  email: z.string().email({ message: "Invalid email address." }),
  studentId: z
    .string()
    .regex(/^\d{2}-\d{4}$/, { message: "Student ID format must be YY-NNNN (e.g., 23-1234)" })
    .optional()
    .or(z.literal("")),
  college: z.string().min(1, { message: "College is required." }),
  program: z.string().min(1, { message: "Program is required." }),
  section: z.string().min(1, { message: "Section is required." }),
  campus: z.enum(["SAN_BARTOLOME_MAIN", "SAN_FRANCISCO", "BATASAN"], {
    errorMap: () => ({ message: "Please select a valid campus." }),
  }),
  department: z.enum(
    [
      "SECRETARIAT_OFFICE",
      "RELATIONS_OFFICE",
      "FINANCE_OFFICE",
      "LOGISTICS_OFFICE",
      "CREATIVES_OFFICE",
      "MANAGEMENT_AND_DEVELOPMENT_OFFICE",
      "STARTUP_DEVELOPERS_OFFICE",
    ],
    {
      errorMap: () => ({ message: "Please select a valid department/office." }),
    },
  ),
  cellphone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "Cellphone number must be 11 digits starting with 09 (e.g., 09123456789)",
    }),
  houseAddress: z.string().min(1, { message: "Address is required." }),
  interests: z.string().optional(),
});

export type EditApplicantFormValues = z.infer<typeof editApplicantSchema>;
