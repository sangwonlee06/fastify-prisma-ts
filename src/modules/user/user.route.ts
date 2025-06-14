import { $ref } from './user.schema';
import { FastifyInstance } from 'fastify';
import { loginHandler, registerUserHandler } from './user.controller';

async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  );

  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler,
  );
}

export default userRoutes;
