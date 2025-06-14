import { PrismaClient } from '../generated/prisma';
// import { PrismaClient } from '@prisma/client';
// This generates the error: "@prisma/client did not initialize yet."

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
