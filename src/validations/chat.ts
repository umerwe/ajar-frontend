import { z } from "zod";

export const messageSchema = z.object({
    text: z.string().min(1, "Message cannot be empty"),
});

export type MessageForm = z.infer<typeof messageSchema>;