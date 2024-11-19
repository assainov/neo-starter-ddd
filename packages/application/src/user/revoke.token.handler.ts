import z from 'zod';
import { BadRequestError } from '@neo/common-entities';
import { IUserDI } from './interfaces/IUserDI';

export const revokeTokenBodySchema = z.object({
  id: z.string().min(1),
});
export const revokeTokenRequestSchema = z.object({ body: revokeTokenBodySchema });
export const revokeTokenResponseSchema = z.object({
  success: z.boolean(),
});

export const revokeTokenHandlerResultSchema = revokeTokenResponseSchema;

export type RevokeTokenBody = z.infer<typeof revokeTokenBodySchema>;
export type RevokeTokenResponse = z.infer<typeof revokeTokenResponseSchema>;
export type RevokeTokenHandlerResult = z.infer<typeof revokeTokenHandlerResultSchema>;

export const revokeTokenHandler = async ({ di, id }: { id: string; di: IUserDI; }): Promise<RevokeTokenHandlerResult> => {
  const token = await di.db.tokenRepository.getById(id);

  if (!token) {
    throw new BadRequestError('Refresh token to revoke was not found in the database');
  }

  token.revoke();

  await di.db.tokenRepository.update(token);

  return revokeTokenHandlerResultSchema.parse({
    success: true
  });
};