import * as z from 'zod';

export const topUpSchema = z.object({
    amount: z.string().min(1, "Amount is required").refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Please enter a valid amount greater than 0"
    ),
});

export type TopUpFormData = z.infer<typeof topUpSchema>;