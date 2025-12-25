import { getDb } from '@/api/db/client.js';

interface MessageService {
  listMessages: () => Promise<unknown>;
  createMessage: (text: string) => Promise<unknown>;
}

export const messageService: MessageService = {
  listMessages: async () => {
    const db = getDb();
    return db.message.findMany({ orderBy: { createdAt: 'desc' } });
  },
  createMessage: async (text: string) => {
    const db = getDb();
    return db.message.create({
      data: { text },
    });
  },
};

export const listMessages = messageService.listMessages;
export const createMessage = messageService.createMessage;
