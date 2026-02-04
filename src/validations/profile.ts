import { z } from "zod";

export const EditProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9+]+$/, "Phone number must contain only digits")
    .optional()
    .or(z.literal("")),

  dob: z.string().optional(),

  nationality: z
    .string()
    .optional(),
});

export type EditProfileFormValues = z.infer<typeof EditProfileSchema>;
