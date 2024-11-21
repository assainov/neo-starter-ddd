import z from 'zod';

export const refreshTokenBodySchema = z.object({});
export const refreshTokenRequestSchema = z.object({ body: refreshTokenBodySchema });
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;