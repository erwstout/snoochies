/* eslint-env jest */
import type { AddressInfo } from 'node:net';
import { app } from './app.js';

let server: ReturnType<typeof app.listen>;
let baseUrl: string;

describe('API endpoints', () => {
  beforeAll((done) => {
    server = app.listen(0, () => {
      const address = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('GET /healthz returns ok status', async () => {
    const response = await fetch(`${baseUrl}/healthz`);
    const body = (await response.json()) as { status: string; uptime: number };

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });

  test('GET / returns welcome message', async () => {
    const response = await fetch(baseUrl);
    const body = (await response.json()) as { message: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ message: "I'm not even supposed to be here today!" });
  });

  test('POST /echo returns echoed message for valid payload', async () => {
    const response = await fetch(`${baseUrl}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, Snoochies!' }),
    });
    const body = (await response.json()) as { echoed: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ echoed: 'Hello, Snoochies!' });
  });

  test('POST /echo responds with validation error for invalid payload', async () => {
    const response = await fetch(`${baseUrl}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    });
    const body = (await response.json()) as { error: string; details: unknown };

    expect(response.status).toBe(400);
    expect(body).toHaveProperty('error', 'Invalid request body');
    expect(body).toHaveProperty('details');
  });
});
