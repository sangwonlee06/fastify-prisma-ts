import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createProductHandler, getProductsHandler } from './product.controller';
import {
  createProductSchema,
  productResponseSchema,
  productsResponseSchema,
} from './product.schema';

const productRoutes = async (fastify: FastifyInstance) => {
  const fp = fastify.withTypeProvider<ZodTypeProvider>();

  fp.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: createProductSchema,
        response: {
          201: productResponseSchema,
        },
      },
    },
    createProductHandler,
  );

  fp.get(
    '/',
    {
      schema: {
        response: {
          201: productsResponseSchema,
        },
      },
    },
    getProductsHandler,
  );
};

export default productRoutes;
