import z from 'zod';
import { BadRequestError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginUserRequestSchema = z.object({ body: loginUserBodySchema });
export const loginUserResponseSchema = z.object({
  accessToken: z.string().min(1).optional(),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;

export const loginUserHandler = async ({ di, loginDto }: { loginDto: LoginUserBody; di: IUserDI; }) => {
  const { email, password } = loginDto;

  const user = await di.db.userRepository.getByEmail(email);

  if (!user) throw new BadRequestError('Invalid email or password');

  const { error, accessToken } = await user.login(password, di.encryptionService, di.tokenService);

  if (error) throw new BadRequestError(error);

  await di.db.userRepository.update(user);

  return loginUserResponseSchema.parse({ accessToken });
};