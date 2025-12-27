import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/snoochies';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pool?: Pool };

const getAdapter = (): PrismaPg => {
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: DATABASE_URL });
  }
  return new PrismaPg(globalForPrisma.pool);
};

export const getDb = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: getAdapter(),
    });
  }
  return globalForPrisma.prisma;
};

export const closeDb = async (): Promise<void> => {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }
  if (globalForPrisma.pool) {
    await globalForPrisma.pool.end();
    globalForPrisma.pool = undefined;
  }
};
