import z from 'zod';

export const logoutUserResponseSchema = z.object({
  success: z.boolean(),
});

export type LogoutUserResponse = z.infer<typeof logoutUserResponseSchema>;