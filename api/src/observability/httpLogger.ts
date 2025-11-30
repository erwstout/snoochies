import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import pinoHttp, { type HttpLogger, type Options } from 'pino-http';
import { logger } from '@/api/observability/logger.js';

const options: Options = {
  logger,
  genReqId: (req: IncomingMessage, res: ServerResponse): string => {
    const existing = req.headers['x-request-id'];
    if (typeof existing === 'string') return existing;
    if (Array.isArray(existing) && existing.length > 0) return existing[0];
    const id = randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  customSuccessMessage: (_req: IncomingMessage, res: ServerResponse) =>
    `${res.statusCode} ${res.statusMessage ?? ''}`.trim(),
  customErrorMessage: (_req: IncomingMessage, res: ServerResponse, err: Error) => {
    return `request errored: ${err.message ?? 'unknown error'} (${res.statusCode})`;
  },
};
export const httpLogger = pinoHttp(options) as HttpLogger<IncomingMessage, ServerResponse>;
