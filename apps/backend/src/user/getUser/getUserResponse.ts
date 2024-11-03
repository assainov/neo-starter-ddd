import { z } from 'zod';
import userDtoSchema from '../userDtos/userDtoSchema';

const getUserResponseSchema = userDtoSchema.optional();

export type GetUserResponse = z.infer<typeof getUserResponseSchema>;
export default getUserResponseSchema;