import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Knex } from 'knex';
import { env } from '@/api/config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSrcRoot = path.resolve(__dirname, '..');

const parsePort = (value: string | number | undefined, fallback: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const buildKnexConfig = (): Knex.Config => {
  const connectionString = env.DATABASE_URL;
  const sslEnabled = env.PGSSL === 'true';

  const connection = connectionString
    ? { connectionString, ssl: sslEnabled ? { rejectUnauthorized: false } : undefined }
    : {
        host: env.PGHOST ?? '127.0.0.1',
        port: parsePort(env.PGPORT, 5432),
        user: env.PGUSER ?? 'postgres',
        password: env.PGPASSWORD ?? 'postgres',
        database: env.PGDATABASE ?? 'snoochies',
        ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
      };

  return {
    client: 'pg',
    connection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(apiSrcRoot, 'db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(apiSrcRoot, 'db/seeds'),
      extension: 'ts',
    },
  } satisfies Knex.Config;
};

export const knexConfig = buildKnexConfig();
