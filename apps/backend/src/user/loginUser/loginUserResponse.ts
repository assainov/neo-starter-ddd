import { z } from 'zod';

const loginUserResponseSchema = z.object({
  accessToken: z.string().min(1).optional(),
});

export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;
export default loginUserResponseSchema;