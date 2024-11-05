import { validateRequest } from '@/common/validation/validateRequest';
import searchUsersQuerySchema from './searchUsersQuery';
import { z } from 'zod';

export default validateRequest(z.object({
  query: searchUsersQuerySchema
}));