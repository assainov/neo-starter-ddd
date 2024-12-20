import { userDtoSchema } from './common.dto';
import z from 'zod';
import { NotFoundError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';

export const getUserParamsSchema = z.object({ id: z.string().min(1) });
export const getUserRequestSchema = z.object({ params: getUserParamsSchema });
export const getUserResponseSchema = userDtoSchema.optional();

export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type GetUserResponse = z.infer<typeof getUserResponseSchema>;

export const getUserHandler = async ({ di, id }: { id: string; di: IUserDI; }) => {
  const user = await di.db.userRepository.getById(id);

  if (!user) throw new NotFoundError('User not found');

  return getUserResponseSchema.parse(user);
};
