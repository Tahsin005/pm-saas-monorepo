import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
import { env } from '../env.js';

const adapter = new PrismaNeon({ connectionString: env.databaseUrl });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.nodeEnv !== 'production') {
    globalForPrisma.prisma = db;
}
