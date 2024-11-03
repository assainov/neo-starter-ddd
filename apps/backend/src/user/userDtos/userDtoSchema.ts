import { commonValidations } from '@/validation/commonValidations';
import { z } from 'zod';

const userDtoSchema = z.object({
  id: commonValidations.id,
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
export default userDtoSchema;