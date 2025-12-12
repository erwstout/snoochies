import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { env } from '@/api/config/env.js';
import { httpLogger } from '@/api/observability/httpLogger.js';
import { logger } from '@/api/observability/logger.js';
import { validateBody } from '@/api/utils/validate.js';

const app = express();

const allowedOrigins = (env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Security middleware
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  }),
);
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  }),
);
app.use(httpLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/healthz',
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));

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
  const body = (req as Request & { validatedBody: z.infer<typeof echoSchema> }).validatedBody;
  res.json({ echoed: body.message });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

export { app };
