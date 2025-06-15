import { db } from '../../utils/prisma';
import { CreateProductInput } from './product.schema';

export const createProduct = async (data: CreateProductInput & { ownerId: number }) => {
  return db.product.create({
    data,
  });
};

export const getProducts = async () => {
  return db.product.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
