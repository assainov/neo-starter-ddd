import { z } from 'zod';
import userDtoSchema from './_user.dto';
import { UserDI } from './_user.di';

export const searchUsersQuerySchema = z.object({});
export const searchUsersRequestSchema = z.object({ query: searchUsersQuerySchema });
export const searchUsersResponseSchema = userDtoSchema.array();

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
export type SearchUsersResponse = z.infer<typeof searchUsersResponseSchema>;

export const searchUsersHandler = async ({ di }: { di: UserDI}) => {
  const users = await di.db.userRepository.getAll();

  return searchUsersResponseSchema.parse(users);
};