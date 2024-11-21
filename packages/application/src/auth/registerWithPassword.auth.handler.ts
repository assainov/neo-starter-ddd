import z from 'zod';
import { userDtoSchema } from '../user';

export const registerUserBodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().min(4).url().optional().nullable(),
  username: z.string().min(4).optional()
});
export const registerUserRequestSchema = z.object({ body: registerUserBodySchema });
export const registerUserResponseSchema = userDtoSchema;

export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
