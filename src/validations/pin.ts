import { z } from "zod";

export const pinSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});
export type PinFormValues = z.infer<typeof pinSchema>
