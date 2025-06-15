import { db } from './prisma';
import type { User } from '../generated/prisma';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return db.user.findUnique({
    where: { email },
  });
};
