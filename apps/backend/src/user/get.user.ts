import { validateRequest } from '@neo/tools/validation';
import userDtoSchema from './_common.user';
import z from 'zod';

export const getUserParamsSchema = z.object({ email: z.string().email() });

export const getUserResponseSchema = userDtoSchema.optional();

export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type GetUserResponse = z.infer<typeof getUserResponseSchema>;

export const getUserValidator = validateRequest(z.object({ params: getUserParamsSchema }));