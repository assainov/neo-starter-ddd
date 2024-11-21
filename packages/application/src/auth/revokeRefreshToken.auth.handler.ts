import z from 'zod';

export const revokeTokenBodySchema = z.object({
  id: z.string().min(1),
});
export const revokeTokenRequestSchema = z.object({ body: revokeTokenBodySchema });
export const revokeTokenResponseSchema = z.object({
  success: z.boolean(),
});

export type RevokeTokenBody = z.infer<typeof revokeTokenBodySchema>;
export type RevokeTokenResponse = z.infer<typeof revokeTokenResponseSchema>;
