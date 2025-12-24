import express from 'express';
import { z } from 'zod';
import type { Request, Response } from 'express';
import { validateBody } from '@/api/utils/validate.js';
import { getValidatedBody } from '@/api/utils/getValidatedBody.js';
import { setupMiddleware } from '@/api/middleware.js';
import { errorHandler } from '@/api/utils/errorHandler.js';

const app = express();
app.set('trust proxy', true);

setupMiddleware(app);

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: "I'm not even supposed to be here today!" });
});

const echoSchema = z.object({
  message: z.string().min(1),
});

app.post('/echo', validateBody(echoSchema), (req: Request, res: Response) => {
  const body = getValidatedBody<typeof echoSchema>(req);
  res.json({ echoed: body.message });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export { app };
