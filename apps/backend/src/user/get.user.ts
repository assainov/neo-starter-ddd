import { commonValidations, validateRequest } from '@neo/tools/validation';
import userDtoSchema from './_common.user';
import z from 'zod';

export const getUserParamsSchema = z.object({ id: commonValidations.id });

export const getUserResponseSchema = userDtoSchema.optional();

export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type GetUserResponse = z.infer<typeof getUserResponseSchema>;

export const getUserValidator = validateRequest(z.object({ params: getUserParamsSchema }));