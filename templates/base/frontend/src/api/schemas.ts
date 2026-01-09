import { z } from 'zod';

export const rootMessageSchema = z.object({
  message: z.string(),
});

export type RootMessageResponse = z.infer<typeof rootMessageSchema>;

export const messageSchema = z.object({
  id: z.number().int().nonnegative(),
  text: z.string(),
  createdAt: z.string(),
});

export const messagesResponseSchema = z.object({
  messages: z.array(messageSchema),
});

export type MessagesResponse = z.infer<typeof messagesResponseSchema>;
