import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const getDb = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
};

export const closeDb = async (): Promise<void> => {
  if (!globalForPrisma.prisma) return;
  await globalForPrisma.prisma.$disconnect();
  globalForPrisma.prisma = undefined;
};
