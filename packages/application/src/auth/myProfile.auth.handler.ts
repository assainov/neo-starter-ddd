import z from 'zod';
import { userDtoSchema } from '../user';

export const userDetailsRequestSchema = z.object({});
export const userDetailsResponseSchema = userDtoSchema;

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>;
