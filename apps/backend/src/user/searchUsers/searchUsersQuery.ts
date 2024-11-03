import { z } from 'zod';

const searchUsersQuerySchema = z.object({
});

export type searchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
export default searchUsersQuerySchema;