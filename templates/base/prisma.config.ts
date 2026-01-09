import { defineConfig } from 'prisma/config';

const defaultUrl =
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/snoochies';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasources: {
    db: {
      url: defaultUrl,
    },
  },
});
