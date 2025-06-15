import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';

const fastify = Fastify();

// set Zod compilers once for all routes
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

async function main() {
  fastify.register(fjwt, {
    secret: process.env.JWT_SECRET || 'some-secret-key',
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;
    if (!token) return reply.status(401).send({ message: 'Authentication required' });
    const decoded = request.jwt.verify(token);
    request.user = decoded;
  });

  fastify.addHook('preHandler', (req, res, next) => {
    req.jwt = fastify.jwt;
    return next();
  });

  fastify.register(fCookie, {
    secret: process.env.COOKIE_SECRET || 'some-secret-key',
    hook: 'preHandler',
  });

  // register routes with the Zod type provider
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(userRoutes, { prefix: '/api/users' })
    .register(productRoutes, { prefix: '/api/products' });

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening at http://localhost:3000');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
