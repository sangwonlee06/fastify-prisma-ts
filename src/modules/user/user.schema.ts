import { z } from 'zod';

export const userCore = {
  email: z
    .string({ required_error: 'Email is required', invalid_type_error: 'Email is not valid' })
    .email(),
  name: z.string(),
};

export const createUserSchema = z.object({
  ...userCore,
  password: z.string({ required_error: 'Password is required' }),
});

export const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required', invalid_type_error: 'Email is not valid' })
    .email(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
