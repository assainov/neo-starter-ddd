import { z } from 'zod';
import userDtoSchema from '../userDtos/userDtoSchema';

const meResponseSchema = userDtoSchema.optional();

export type MeResponse = z.infer<typeof meResponseSchema>;
export default meResponseSchema;