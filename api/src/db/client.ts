import { knex, type Knex } from 'knex';
import { knexConfig } from '@/api/db/config.js';

let client: Knex | null = null;

export const getDb = (): Knex => {
  client ??= knex(knexConfig);
  return client;
};

export const closeDb = async (): Promise<void> => {
  if (!client) return;
  await client.destroy();
  client = null;
};
