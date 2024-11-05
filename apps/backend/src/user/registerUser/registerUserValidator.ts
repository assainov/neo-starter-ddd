import { validateRequest } from '@/common/validation/validateRequest';
import registerUserBodySchema from './registerUserBody';
import { z } from 'zod';

export default validateRequest(z.object({
  body: registerUserBodySchema
}));