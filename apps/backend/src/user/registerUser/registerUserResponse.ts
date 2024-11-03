import { z } from 'zod';
import userDtoSchema from '../userDtos/userDtoSchema';

const registerUserResponseSchema = userDtoSchema;

export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export default registerUserResponseSchema;