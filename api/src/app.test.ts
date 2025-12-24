/* eslint-env jest */
import type { Request, RequestHandler, Response } from 'express';
import { echoHandler, echoSchema, healthzHandler, rootHandler } from './app.js';
import { validateBody } from './utils/validate.js';

interface MockResponseShape extends Partial<Response> {
  statusCode: number;
  body?: unknown;
}

const createMockRes = (): MockResponseShape => ({
  statusCode: 200,
  body: undefined,
  status(code: number) {
    this.statusCode = code;
    return this as unknown as Response;
  },
  json(payload: unknown) {
    this.body = payload;
    return this as unknown as Response;
  },
  send(payload: unknown) {
    this.body = payload;
    return this as unknown as Response;
  },
});

const runHandler = async (
  handler: RequestHandler,
  req: Partial<Request>,
  res: MockResponseShape,
): Promise<boolean> => {
  let nextCalled = false;
  await new Promise<void>((resolve, reject) => {
    const maybePromise = handler(req as Request, res as Response, (err?: unknown) => {
      nextCalled = true;
      if (err) {
        reject(err instanceof Error ? err : new Error(typeof err === 'string' ? err : 'Error'));
      } else {
        resolve();
      }
    });
    if (
      !nextCalled &&
      maybePromise &&
      typeof (maybePromise as Promise<unknown>).then === 'function'
    ) {
      (maybePromise as Promise<unknown>).then(
        () => resolve(),
        (err: unknown) => reject(err instanceof Error ? err : new Error('Error')),
      );
    } else if (!nextCalled) {
      resolve();
    }
  });
  return nextCalled;
};

describe('API endpoints', () => {
  test('GET /healthz returns ok status', async () => {
    const res = createMockRes();
    await runHandler(healthzHandler, {}, res);
    const body = res.body as { status: string; uptime: number };

    expect(res.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });

  test('GET / returns welcome message', async () => {
    const res = createMockRes();
    await runHandler(rootHandler, {}, res);
    const body = res.body as { message: string };

    expect(res.statusCode).toBe(200);
    expect(body).toEqual({ message: "I'm not even supposed to be here today!" });
  });

  test('POST /echo returns echoed message for valid payload', async () => {
    const res = createMockRes();
    const req = { body: { message: 'Hello, Snoochies!' } };
    const nextCalled = await runHandler(validateBody(echoSchema), req, res);
    if (nextCalled) {
      await runHandler(echoHandler, req, res);
    }
    const body = res.body as { echoed: string };

    expect(res.statusCode).toBe(200);
    expect(body).toEqual({ echoed: 'Hello, Snoochies!' });
  });

  test('POST /echo responds with validation error for invalid payload', async () => {
    const res = createMockRes();
    const req = { body: { message: '' } };
    await runHandler(validateBody(echoSchema), req, res);
    const body = res.body as { error: string; details: unknown };

    expect(res.statusCode).toBe(400);
    expect(body).toHaveProperty('error', 'Invalid request body');
    expect(body).toHaveProperty('details');
  });
});
