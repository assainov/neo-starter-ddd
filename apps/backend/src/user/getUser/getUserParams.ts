import { z } from 'zod';

const getUserParamsSchema = z.object({
  email: z.string().email(),
});

export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export default getUserParamsSchema;