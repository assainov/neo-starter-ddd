import { validateRequest } from '@neo/tools/validation';
import z from 'zod';
import userDtoSchema from './_common.user';

export const registerUserBodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().min(4).url().optional(),
  username: z.string().min(4).optional()
});

export const registerUserResponseSchema = userDtoSchema;

export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;

export const registerUserValidator = validateRequest(z.object({ body: registerUserBodySchema }));