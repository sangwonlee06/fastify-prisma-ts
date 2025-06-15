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
exports.logoutHandler = exports.getUsersHandler = exports.loginHandler = exports.registerUserHandler = void 0;
const user_service_1 = require("./user.service");
const hash_1 = require("../../utils/hash");
const auth_1 = require("../../utils/auth");
const registerUserHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.createUser)(request.body);
        return reply.status(201).send(user);
    }
    catch (error) {
        console.error(error);
        return reply.status(500).send({
            message: 'Internal Server Error',
            error,
        });
    }
});
exports.registerUserHandler = registerUserHandler;
const loginHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const user = yield (0, auth_1.findUserByEmail)(email);
    if (!user) {
        return reply.status(401).send({
            message: 'Invalid email address. Try again!',
        });
    }
    const isValidPassword = (0, hash_1.verifyPassword)({
        candidatePassword: password,
        salt: user.salt,
        hash: user.password,
    });
    if (!isValidPassword) {
        return reply.status(401).send({
            message: 'Password is incorrect',
        });
    }
    // generate access token
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    };
    const token = request.jwt.sign(payload);
    reply.setCookie('access_token', token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: true,
    });
    return { accessToken: token };
});
exports.loginHandler = loginHandler;
const getUsersHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, user_service_1.getUsers)();
});
exports.getUsersHandler = getUsersHandler;
const logoutHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    reply.clearCookie('access_token');
    return reply.status(201).send({ message: 'Logout successfully' });
});
exports.logoutHandler = logoutHandler;
