import { db } from '../../utils/prisma';
import { CreateUserInput } from './user.schema';
import { hashPassword } from '../../utils/hash';

export const createUser = async (input: CreateUserInput) => {
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);

  const user = await db.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
};

export const getUsers = async () => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
