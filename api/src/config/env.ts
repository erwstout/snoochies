import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v), 'PORT must be a number')
    .default('3000'),
  DATABASE_URL: z.string().url().optional(),
  PGHOST: z.string().optional(),
  PGPORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v), 'PGPORT must be a number')
    .optional(),
  PGUSER: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  PGDATABASE: z.string().optional(),
  PGSSL: z.string().optional(),
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
