import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const DATABASE_UNAVAILABLE_MESSAGE =
  'Persistent data features are disabled for this deployment until DATABASE_URL is configured.';

export class DatabaseConfigurationError extends Error {
  constructor(message = DATABASE_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = 'DatabaseConfigurationError';
  }
}

export function isDatabaseConfigured(): boolean {
  return typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0;
}

export function assertDatabaseConfigured(): void {
  if (!isDatabaseConfigured()) {
    throw new DatabaseConfigurationError();
  }
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });
}

export function getPrismaClient(): PrismaClient {
  assertDatabaseConfigured();

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];

    if (typeof value === 'function') {
      return value.bind(client);
    }

    return value;
  }
});
