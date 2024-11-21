import z from 'zod';
import { userDtoSchema } from '../user';

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginUserRequestSchema = z.object({ body: loginUserBodySchema });
export const loginUserResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: userDtoSchema
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;
