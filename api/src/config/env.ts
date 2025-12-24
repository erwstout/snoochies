import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const portBase = z.preprocess((val) => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'string' && val.trim() === '') return undefined;
  return val;
}, z.coerce.number().int().min(1).max(65535));

const coercePort = (defaultValue?: number) =>
  defaultValue !== undefined ? portBase.default(defaultValue) : portBase;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: coercePort(3000),
  DATABASE_URL: z.string().url().optional(),
  VITE_API_URL: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.format());
  process.exit(1);
}

export type AppEnv = typeof parsed.data;
export const env = parsed.data;
