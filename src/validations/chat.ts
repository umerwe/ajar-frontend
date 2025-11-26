import { z } from "zod";

export const messageSchema = z.object({
    text: z.string(),
});

export type MessageForm = z.infer<typeof messageSchema>;