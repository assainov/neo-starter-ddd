import z from 'zod';
import { BadRequestError, InternalServerError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';
import { userDtoSchema } from './common.dto';
import { RefreshToken } from '@neo/domain/refresh-token';

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginUserRequestSchema = z.object({ body: loginUserBodySchema });
export const loginUserResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: userDtoSchema
});

export const loginUserHandlerResultSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: userDtoSchema
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;
export type LoginUserHandlerResult = z.infer<typeof loginUserHandlerResultSchema>;

export const loginUserHandler = async ({ di, loginDto }: { loginDto: LoginUserBody; di: IUserDI; }): Promise<LoginUserHandlerResult> => {
  const { email, password } = loginDto;

  const user = await di.db.userRepository.getByEmail(email);

  if (!user) throw new BadRequestError('Invalid email or password');

  const loginResult = await user.login(password, di.encryptionService);

  if (!loginResult.isSuccess) throw new InternalServerError(loginResult.error);

  const generationResult = RefreshToken.createTokens(di.tokenService, user.id);

  if (!generationResult.isSuccess) throw new InternalServerError(generationResult.error);

  await di.db.userRepository.update(user);
  await di.db.tokenRepository.create(generationResult.data.refreshTokenInstance);

  return loginUserHandlerResultSchema.parse({
    accessToken: generationResult.data.accessToken,
    refreshToken: generationResult.data.refreshTokenInstance.token,
    user
  });
};