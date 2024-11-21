import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  searchUsersResponseSchema,
  userDtoSchema,
  getUserParamsSchema,
  getUserResponseSchema,
} from '@neo/application/user';
import { createApiResponse } from '@neo/express-tools/swagger';

export const setupOpenAPIRegistry = () => {
  const userRegistry = new OpenAPIRegistry();
  userRegistry.register('UserDto', userDtoSchema);

  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: [ 'Users' ],
    responses: createApiResponse(searchUsersResponseSchema, 'Success'),
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: [ 'Users' ],
    request: { params: getUserParamsSchema },
    responses: createApiResponse(getUserResponseSchema, 'Success'),
  });

  return userRegistry;
};