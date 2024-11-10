import z from 'zod';
import { userDtoSchema } from './common.dto';
import { BadRequestError, InternalServerError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';

export const userDetailsRequestSchema = z.object({});
export const userDetailsResponseSchema = userDtoSchema;

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>;

export const userDetailsHandler = async ({ di, email }: { di: IUserDI; email?: string }) => {
  if (!email) throw new InternalServerError('Email not found in token payload');

  const user = await di.db.userRepository.getByEmail(email);

  if (!user) throw new BadRequestError('Invalid email or password');

  return userDetailsResponseSchema.parse(user);
};