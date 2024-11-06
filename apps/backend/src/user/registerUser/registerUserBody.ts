import { z } from 'zod';

const registerUserBodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().min(4).url().optional(),
  username: z.string().min(4).optional()
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
export default registerUserBodySchema;