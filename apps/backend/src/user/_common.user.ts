import { commonValidations } from '@neo/express-tools/validation';
import { z } from 'zod';

const userDtoSchema = z.object({
  id: commonValidations.id,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  lastLoginAt: z.date(),
  avatarUrl: z.string().optional().nullable(),
  username: z.string(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
export default userDtoSchema;