import { commonValidations } from '@/common/validation/commonValidations';
import { z } from 'zod';

const getUserParamsSchema = z.object({
  id: commonValidations.id,
});

export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export default getUserParamsSchema;