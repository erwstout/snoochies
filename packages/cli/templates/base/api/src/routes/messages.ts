import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { validateBody } from '@/api/utils/validate.js';
import { getValidatedBody } from '@/api/utils/getValidatedBody.js';
import { messageService } from '@/api/services/messages.js';

const router = Router();

const createMessageSchema = z.object({
  text: z.string().min(1),
});

const listMessagesHandler: RequestHandler = async (_req, res, next) => {
  try {
    const messages = await messageService.listMessages();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

router.get('/', listMessagesHandler);

const createMessageHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = getValidatedBody<typeof createMessageSchema>(req);
    const message = await messageService.createMessage(body.text);
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

router.post('/', validateBody(createMessageSchema), createMessageHandler);

export { router as messageRouter, createMessageSchema, createMessageHandler, listMessagesHandler };
