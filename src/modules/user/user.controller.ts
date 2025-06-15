import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, LoginInput } from './user.schema';
import { createUser, getUsers } from './user.service';
import { verifyPassword } from '../../utils/hash';
import { findUserByEmail } from '../../utils/auth';

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) => {
  try {
    const user = await createUser(request.body);
    return reply.status(201).send(user);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: 'Internal Server Error',
      error,
    });
  }
};

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) => {
  const { email, password } = request.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return reply.status(401).send({
      message: 'Invalid email address. Try again!',
    });
  }

  const isValidPassword = verifyPassword({
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
};

export const getUsersHandler = async () => {
  return getUsers();
};

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('access_token');
  return reply.status(201).send({ message: 'Logout successfully' });
};
