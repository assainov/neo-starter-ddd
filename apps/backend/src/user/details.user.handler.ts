import z from 'zod';
import userDtoSchema from './common.dto';
import { UserDI } from './setup/user.di';
import { BadRequestError, InternalServerError } from '@neo/common-entities';

export const userDetailsRequestSchema = z.object({});
export const userDetailsResponseSchema = userDtoSchema;

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>;

export const userDetailsHandler = async ({ di, email }: { di: UserDI; email?: string }) => {
  if (!email) throw new InternalServerError('Email not found in token payload');

  const user = await di.db.userRepository.getByEmail(email);

  if (!user) throw new BadRequestError('Invalid email or password');

  return userDetailsResponseSchema.parse(user);
};