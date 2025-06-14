import Fastify from 'fastify';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

const fastify = Fastify();

async function main() {
  for (const schema of userSchemas) {
    // should add these schemas before you register your routes
    fastify.addSchema(schema);
  }

  fastify.register(userRoutes, { prefix: 'api/users' }); // routes register

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening at http://localhost:3000');
  } catch (error) {
    console.error(error);
    process.exit(1); // exit as failure
  }
}

main();
