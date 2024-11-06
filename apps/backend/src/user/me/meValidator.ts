import { validateRequest } from '@neo/tools/validation';
import { z } from 'zod';

export default validateRequest(z.object({}));