import { z } from "zod";

export const bookingSchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    specialRequest: z.string().optional(),
}).refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export type BookingFormData = z.infer<typeof bookingSchema>;