import { z } from 'zod';
import { userDtoSchema } from './common.dto';
import { IUserDI } from './interfaces/IUserDI';

export const searchUsersQuerySchema = z.object({});
export const searchUsersRequestSchema = z.object({ query: searchUsersQuerySchema });
export const searchUsersResponseSchema = userDtoSchema.array();

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
export type SearchUsersResponse = z.infer<typeof searchUsersResponseSchema>;

export const searchUsersHandler = async ({ di }: { di: IUserDI}) => {
  const users = await di.db.userRepository.getAll();

  return searchUsersResponseSchema.parse(users);
};