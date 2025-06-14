import { $ref } from './user.schema';
import { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  loginHandler,
  logoutHandler,
  registerUserHandler,
} from './user.controller';

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

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    getUsersHandler,
  );

  fastify.delete(
    '/logout',
    {
      preHandler: [fastify.authenticate],
    },
    logoutHandler,
  );
}

export default userRoutes;
