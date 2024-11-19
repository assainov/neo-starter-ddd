import z from 'zod';
import { IUserDI } from './interfaces/IUserDI';
import { UnauthorizedError } from '@neo/common-entities';

export const logoutUserResponseSchema = z.object({
  success: z.boolean(),
});

export const logoutUserHandlerResultSchema = logoutUserResponseSchema;

export type LogoutUserResponse = z.infer<typeof logoutUserResponseSchema>;
export type LogoutUserHandlerResult = z.infer<typeof logoutUserHandlerResultSchema>;

export const logoutUserHandler = async ({ di, refreshToken }: { refreshToken: string; di: IUserDI; }): Promise<LogoutUserHandlerResult> => {
  const { id } = await di.tokenService.verifyRefreshToken(refreshToken);

  const storedRefreshToken = await di.db.tokenRepository.getById(id);

  if (!storedRefreshToken) {
    di.logger.error('Refresh token supplied, but not found in the database');
    throw new UnauthorizedError('Invalid refresh token');
  }

  try {
    await di.db.tokenRepository.delete(id);
  } catch (error) {
    di.logger.error('Error deleting refresh token', error);
    // let the user continue logging out
  }

  return logoutUserHandlerResultSchema.parse({ success: true });
};