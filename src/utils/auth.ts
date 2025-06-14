import { db } from './prisma';
import type { User } from '../generated/prisma';

export async function findUserByEmail(email: string): Promise<User | null> {
  return await db.user.findUnique({
    where: { email },
  });
}
