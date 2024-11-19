import z from 'zod';
import { userDtoSchema } from './common.dto';
import { BadRequestError, InternalServerError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';

export const userDetailsRequestSchema = z.object({});
export const userDetailsResponseSchema = userDtoSchema;

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>;

export const userDetailsHandler = async ({ di, userId }: { di: IUserDI; userId?: string }) => {
  if (!userId) throw new InternalServerError('userId not found in token payload');

  const user = await di.db.userRepository.getById(userId);

  if (!user) throw new BadRequestError('Invalid email or password');

  return userDetailsResponseSchema.parse(user);
};