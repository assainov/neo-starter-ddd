import { validateRequest } from '@neo/express-tools/validation';
import z from 'zod';
import userDtoSchema from './_common.user';

export const userDetailsResponseSchema = userDtoSchema;

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>;

export const userDetailsValidator = validateRequest(z.object({}));