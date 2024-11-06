import { validateRequest } from '@neo/tools/validation';
import getUserParamsSchema from './getUserParams';
import { z } from 'zod';

export default validateRequest(z.object({
  params: getUserParamsSchema
}));