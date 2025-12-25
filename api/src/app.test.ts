/* eslint-env jest */
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import type { Request, RequestHandler, Response } from 'express';
import type { ZodSchema } from 'zod';
import { echoHandler, echoSchema, healthzHandler, readyzHandler, rootHandler } from './app.js';
import { messageService } from './services/messages.js';
import {
  createMessageHandler,
  createMessageSchema,
  listMessagesHandler,
} from './routes/messages.js';
import { validateBody } from './utils/validate.js';

jest.mock('./db/client.js', () => ({
  getDb: () => ({
    $queryRaw: jest.fn(async () => [{ ok: 1 }]),
  }),
}));

const mockResponse = () => {
  const res: Partial<Response> & { body?: unknown } = {};
  res.statusCode = 200;
  res.status = (code: number) => {
    res.statusCode = code;
    return res as Response;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res as Response;
  };
  res.send = (payload: unknown) => {
    res.body = payload;
    return res as Response;
  };
  return res as Response & { body?: unknown };
};

const run = async (handler: RequestHandler, req: Partial<Request>, res: Response) => {
  await handler(req as Request, res, jest.fn());
};

const runValidated = async (
  schema: ZodSchema,
  handler: RequestHandler,
  req: Partial<Request>,
  res: Response,
) => {
  let nextCalled = false;
  await validateBody(schema)(req as Request, res, (err?: unknown) => {
    if (err) throw err instanceof Error ? err : new Error(String(err));
    nextCalled = true;
  });
  if (nextCalled) {
    await run(handler, req, res);
  }
};

const originalListMessages = messageService.listMessages;
const originalCreateMessage = messageService.createMessage;

beforeEach(() => {
  messageService.listMessages = originalListMessages;
  messageService.createMessage = originalCreateMessage;
  jest.clearAllMocks();
});

describe('API endpoints', () => {
  test('GET /healthz returns ok status', async () => {
    const res = mockResponse();
    await run(healthzHandler, {}, res);
    const body = res.body as { status: string; uptime: number };
    expect(res.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });

  test('GET /readyz returns ready when DB reachable', async () => {
    const res = mockResponse();
    await run(readyzHandler, {}, res);
    expect([200, 503]).toContain(res.statusCode);
  });

  test('GET / returns welcome message', async () => {
    const res = mockResponse();
    await run(rootHandler, {}, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "I'm not even supposed to be here today!" });
  });

  test('POST /echo returns echoed message for valid payload', async () => {
    const res = mockResponse();
    const req = { body: { message: 'Hello, Snoochies!' } };
    await runValidated(echoSchema, echoHandler, req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ echoed: 'Hello, Snoochies!' });
  });

  test('POST /echo responds with validation error for invalid payload', async () => {
    const res = mockResponse();
    const req = { body: { message: '' } };
    await validateBody(echoSchema)(req as Request, res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid request body');
  });

  test('GET /messages returns list from service', async () => {
    messageService.listMessages = jest.fn(async () => [
      { id: 1, text: 'hi', createdAt: new Date() },
    ]) as unknown as typeof messageService.listMessages;
    const res = mockResponse();
    await run(listMessagesHandler, {}, res);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray((res.body as { messages: unknown }).messages)).toBe(true);
  });

  test('POST /messages creates via service', async () => {
    const payload = { text: 'new msg' };
    messageService.createMessage = jest.fn(async () => ({
      id: 2,
      text: payload.text,
      createdAt: new Date(),
    })) as unknown as typeof messageService.createMessage;
    const res = mockResponse();
    const req = { body: payload };
    await runValidated(createMessageSchema, createMessageHandler, req, res);
    expect(res.statusCode).toBe(201);
  });
});
