import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getUsersHandler,
  loginHandler,
  logoutHandler,
  registerUserHandler,
} from './user.controller';
import {
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
} from './user.schema';

const userRoutes = async (fastify: FastifyInstance) => {
  const fp = fastify.withTypeProvider<ZodTypeProvider>();

  fp.post(
    '/',
    {
      schema: {
        body: createUserSchema,
        response: { 201: createUserResponseSchema },
      },
    },
    registerUserHandler,
  );

  fp.post(
    '/login',
    {
      schema: {
        body: loginSchema,
        response: { 201: loginResponseSchema },
      },
    },
    loginHandler,
  );

  fp.get('/', { preHandler: [fastify.authenticate] }, getUsersHandler);

  fp.delete('/logout', { preHandler: [fastify.authenticate] }, logoutHandler);
};

export default userRoutes;
