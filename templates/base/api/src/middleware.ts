import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import express from 'express';
import type { Express } from 'express';
import { env } from '@/api/config/env.js';
import { httpLogger } from '@/api/observability/httpLogger.js';
import { logger } from '@/api/observability/logger.js';
import { parseCorsOrigins } from '@/api/utils/parseCorsOrigins.js';

export function setupMiddleware(app: Express): void {
  const corsOrigin = parseCorsOrigins(env.CORS_ORIGINS);

  if (corsOrigin === false) {
    logger.info(
      'CORS disabled; only same-origin requests are allowed. Set CORS_ORIGINS to enable.',
    );
  }

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy:
        env.NODE_ENV === 'production'
          ? undefined
          : {
              useDefaults: true,
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:'],
              },
            },
    }),
  );

  app.use(
    cors({
      origin: corsOrigin,
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
}
