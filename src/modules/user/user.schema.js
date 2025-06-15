"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginResponseSchema = exports.loginSchema = exports.createUserResponseSchema = exports.createUserSchema = exports.userCore = void 0;
const zod_1 = require("zod");
exports.userCore = {
    email: zod_1.z
        .string({ required_error: 'Email is required', invalid_type_error: 'Email is not valid' })
        .email(),
    name: zod_1.z.string(),
};
exports.createUserSchema = zod_1.z.object(Object.assign(Object.assign({}, exports.userCore), { password: zod_1.z.string({ required_error: 'Password is required' }) }));
exports.createUserResponseSchema = zod_1.z.object(Object.assign({ id: zod_1.z.number() }, exports.userCore));
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required', invalid_type_error: 'Email is not valid' })
        .email(),
    password: zod_1.z.string(),
});
exports.loginResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
