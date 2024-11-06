import { validateRequest } from '@neo/tools/validation';
import loginUserBodySchema from './loginUserBody';
import { z } from 'zod';

export default validateRequest(z.object({ body: loginUserBodySchema }));