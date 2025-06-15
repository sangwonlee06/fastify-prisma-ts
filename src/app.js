"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const fastify = (0, fastify_1.default)();
    // Zod compilers for all routes
    fastify.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    fastify.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    // JWT plugin
    fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'some-secret-key',
    });
    // Cookie plugin
    fastify.register(cookie_1.default, {
        secret: process.env.COOKIE_SECRET || 'some-secret-key',
        hook: 'preHandler',
    });
    // Authentication decorator
    fastify.decorate('authenticate', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // verifies token from cookies and sets request.user to UserPayload
            yield request.jwtVerify();
        }
        catch (err) {
            return reply.status(401).send({ message: 'Authentication required' });
        }
    }));
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
        transformStaticCSP: (header) => header,
        exposeRoute: true,
    });
    // Register your Zod-typed routes
    fastify
        .withTypeProvider()
        .register(user_route_1.default, { prefix: '/api/users' })
        .register(product_route_1.default, { prefix: '/api/products' });
    // Generate the Swagger JSON after all routes are registered
    fastify.ready((err) => {
        if (err)
            throw err;
        fastify.swagger();
    });
    // Start server
    try {
        yield fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server listening at http://localhost:3000');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
main();
