import z from 'zod';
import { InternalServerError, UnauthorizedError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';
import { TokenGenerationType } from '@neo/domain/refresh-token';

export const refreshTokenBodySchema = z.object({});
export const refreshTokenRequestSchema = z.object({ body: refreshTokenBodySchema });
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export const refreshTokenHandlerResultSchema = refreshTokenResponseSchema;

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type RefreshTokenHandlerResult = z.infer<typeof refreshTokenHandlerResultSchema>;

export const refreshTokenHandler = async ({ di, refreshToken }: { refreshToken: string; di: IUserDI; }): Promise<RefreshTokenHandlerResult> => {
  const { id } = await di.tokenService.verifyRefreshToken(refreshToken);

  const storedRefreshToken = await di.db.tokenRepository.getById(id);

  if (!storedRefreshToken) {
    di.logger.error('Refresh token supplied, but not found in the database');
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedRefreshToken.expiresAt.getTime() < Date.now()) {
    throw new UnauthorizedError('Refresh token expired');
  }

  if (storedRefreshToken.revokedAt) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const result = storedRefreshToken.generateAccessToken(di.tokenService, TokenGenerationType.RefreshToken);

  if (!result.isSuccess) throw new InternalServerError(result.error);

  await di.db.tokenRepository.update(storedRefreshToken);

  return refreshTokenHandlerResultSchema.parse({
    accessToken: result.data,
  });
};