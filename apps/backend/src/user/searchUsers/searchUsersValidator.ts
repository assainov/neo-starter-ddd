import { validateRequest } from '@neo/tools/validation';
import searchUsersQuerySchema from './searchUsersQuery';
import { z } from 'zod';

export default validateRequest(z.object({
  query: searchUsersQuerySchema
}));