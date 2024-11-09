import { z } from 'zod';
import { validateRequest } from '@neo/express-tools/validation';
import userDtoSchema from './_common.user';

export const searchUsersQuerySchema = z.object({});
export const searchUsersResponseSchema = userDtoSchema.array();

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
export type SearchUsersResponse = z.infer<typeof searchUsersResponseSchema>;

export const searchUsersValidator = validateRequest(z.object({ query: searchUsersQuerySchema }));