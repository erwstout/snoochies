import type { ZodSchema } from 'zod';
import { getApiBase } from '../utils/getApiBase';

async function parseJson<T>(response: Response, schema: ZodSchema<T>): Promise<T> {
  const data: unknown = await response.json();
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error('Invalid response shape');
  }

  return parsed.data;
}

export async function fetchJson<T>(path: string, schema: ZodSchema<T>): Promise<T> {
  const base = getApiBase();
  const url = new URL(path, base).toString();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return parseJson(response, schema);
}
