import { validateRequest } from '@/validation/validateRequest';
import getUserParamsSchema from './getUserParams';
import { z } from 'zod';

export default validateRequest(z.object({
  params: getUserParamsSchema
}));