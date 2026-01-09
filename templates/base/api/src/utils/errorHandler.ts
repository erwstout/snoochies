import type { Request, Response } from 'express';
import { logger } from '@/api/observability/logger.js';

function getStatusCode(err: unknown): number {
  const errorObj = err as { status?: number; statusCode?: number };

  if (typeof errorObj.status === 'number') {
    return errorObj.status;
  }

  if (typeof errorObj.statusCode === 'number') {
    return errorObj.statusCode;
  }

  return 500;
}

export function errorHandler(err: unknown, _req: Request, res: Response): void {
  const status = getStatusCode(err);
  const isServerError = status >= 500;
  const message = isServerError
    ? 'Internal server error'
    : ((err as { message?: string }).message ?? 'Bad request');

  const log = isServerError ? logger.error.bind(logger) : logger.warn.bind(logger);
  log({ err }, 'Unhandled error');
  res.status(status).json({ error: message });
}
