import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';

async function main() {
  const fastify = Fastify();

  // Zod compilers for all routes
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // JWT plugin
  fastify.register(fjwt, {
    secret: process.env.JWT_SECRET || 'some-secret-key',
  });

  // Cookie plugin
  fastify.register(fCookie, {
    secret: process.env.COOKIE_SECRET || 'some-secret-key',
    hook: 'preHandler',
  });

  // Authentication decorator
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' });
    }
    const decoded = request.jwt.verify(token);
    request.user = decoded;
  });

  // Attach jwt helper to request
  fastify.addHook('preHandler', (req, res, next) => {
    req.jwt = fastify.jwt;
    return next();
  });

  // Register Swagger
  fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Fastify Prisma REST API',
        description: 'A REST API built with Fastify, Prisma and TypeScript',
        version: '1.0.0',
        contact: {
          name: 'Sangwon Lee',
          url: 'https://github.com/sangwonlee06/fastify-prisma-ts',
          email: 'sangwonlee0622@outlook.com',
        },
      },
      externalDocs: {
        url: 'https://fastify.dev/docs/latest/',
        description: 'The official documentation for Fastify',
      },
      host: '0.0.0.0:3000',
      basePath: '/',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    exposeRoute: true,
  });

  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'none', deepLinking: true },
    staticCSP: false,
    transformStaticCSP: (header: any) => header,
    exposeRoute: true,
  });

  // Register your Zod-typed routes
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(userRoutes, { prefix: '/api/users' })
    .register(productRoutes, { prefix: '/api/products' });

  // Generate the Swagger JSON after all routes are registered
  fastify.ready((err) => {
    if (err) throw err;
    fastify.swagger();
  });

  // Start server
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening at http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
