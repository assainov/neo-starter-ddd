import { validateRequest } from '@neo/express-tools/validation';
import z from 'zod';

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserResponseSchema = z.object({
  accessToken: z.string().min(1).optional(),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;

export const loginUserValidator = validateRequest(z.object({ body: loginUserBodySchema }));