import { getDb } from '@/api/db/client.js';

interface MessageService {
  listMessages: () => Promise<unknown>;
  createMessage: (text: string) => Promise<unknown>;
}

export const messageService: MessageService = {
  listMessages: async () => {
    const db = getDb();
    const messages = await db.message.findMany({ orderBy: { createdAt: 'desc' } });
    return messages;
  },
  createMessage: async (text: string) => {
    const db = getDb();
    const created = await db.message.create({
      data: { text },
    });
    return created;
  },
};

export const listMessages = messageService.listMessages;
export const createMessage = messageService.createMessage;
