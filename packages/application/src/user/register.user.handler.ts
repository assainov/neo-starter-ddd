import z from 'zod';
import { userDtoSchema } from './common.dto';
import { User } from '@neo/domain/user';
import { IUserDI } from './interfaces/IUserDI';
import { InternalServerError } from '@neo/common-entities';

export const registerUserBodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().min(4).url().optional().nullable(),
  username: z.string().min(4).optional()
});
export const registerUserRequestSchema = z.object({ body: registerUserBodySchema });
export const registerUserResponseSchema = userDtoSchema;

export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;

export const registerUserHandler = async ({ di, newUserDto }: { newUserDto: RegisterUserBody; di: IUserDI; }) => {
  const result = await User.register(newUserDto, di.encryptionService);

  if (!result.isSuccess) {
    throw new InternalServerError(result.error);
  }

  const user = await di.db.userRepository.create(result.data);

  return registerUserResponseSchema.parse(user);
};