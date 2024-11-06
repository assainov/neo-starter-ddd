import { validateRequest } from '@neo/tools/validation';
import registerUserBodySchema from './registerUserBody';
import { z } from 'zod';

export default validateRequest(z.object({ body: registerUserBodySchema }));