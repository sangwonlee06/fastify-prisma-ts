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
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
const userRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    const fp = fastify.withTypeProvider();
    fp.post('/', {
        schema: {
            body: user_schema_1.createUserSchema,
            response: { 201: user_schema_1.createUserResponseSchema },
        },
    }, user_controller_1.registerUserHandler);
    fp.post('/login', {
        schema: {
            body: user_schema_1.loginSchema,
            response: { 201: user_schema_1.loginResponseSchema },
        },
    }, user_controller_1.loginHandler);
    fp.get('/', { preHandler: [fastify.authenticate] }, user_controller_1.getUsersHandler);
    fp.delete('/logout', { preHandler: [fastify.authenticate] }, user_controller_1.logoutHandler);
});
exports.default = userRoutes;
