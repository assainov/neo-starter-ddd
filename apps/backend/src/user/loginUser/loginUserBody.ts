import { z } from 'zod';

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
export default loginUserBodySchema;