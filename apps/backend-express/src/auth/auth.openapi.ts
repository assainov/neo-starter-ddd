import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  registerUserBodySchema,
  loginUserBodySchema,
  loginUserResponseSchema,
  registerUserResponseSchema,
} from '@neo/application/auth';
import { userDtoSchema } from '@neo/application/user';
import { createApiRequestBody, createApiResponse } from '@neo/express-tools/swagger';

export const setupOpenAPIRegistry = () => {
  const authRegistry = new OpenAPIRegistry();
  authRegistry.register('UserDto', userDtoSchema);

  authRegistry.registerPath({
    method: 'get',
    path: '/auth/my-profile',
    tags: [ 'Authentication' ],
    responses: createApiResponse(userDtoSchema, 'Success'),
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: [ 'Authentication' ],
    request: {
      body: createApiRequestBody(registerUserBodySchema, 'User details to register')
    },
    responses: createApiResponse(registerUserResponseSchema, 'Success'),
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: [ 'Authentication' ],
    request: {
      body: createApiRequestBody(loginUserBodySchema, 'User login details')
    },
    responses: createApiResponse(loginUserResponseSchema, 'Success'),
  });

  return authRegistry;
};