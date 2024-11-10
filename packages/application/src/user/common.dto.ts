import { z } from 'zod';

export const userDtoSchema = z.object({
  id: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  lastLoginAt: z.date(),
  avatarUrl: z.string().optional().nullable(),
  username: z.string(),
});

export type UserDto = z.infer<typeof userDtoSchema>;