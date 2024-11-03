import { z } from 'zod';

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
export default registerUserBodySchema;