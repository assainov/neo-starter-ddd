import { z } from 'zod';

const userDtoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  registeredAt: z.date(),
  lastLoginAt: z.date(),
  loginsCount: z.number(),
  avatarUrl: z.string().optional().nullable(),
  username: z.string(),
  passwordHash: z.string(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
export default userDtoSchema;