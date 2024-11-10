import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  searchUsersResponseSchema,
  userDtoSchema,
  getUserParamsSchema,
  getUserResponseSchema,
  registerUserBodySchema,
  loginUserBodySchema,
  loginUserResponseSchema,
  registerUserResponseSchema,
} from '@neo/application/user';
import { createApiRequestBody, createApiResponse } from '@neo/express-tools/swagger';

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
    path: '/users/me',
    tags: [ 'Users' ],
    responses: createApiResponse(userDtoSchema, 'Success'),
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: [ 'Users' ],
    request: { params: getUserParamsSchema },
    responses: createApiResponse(getUserResponseSchema, 'Success'),
  });

  userRegistry.registerPath({
    method: 'post',
    path: '/users/register',
    tags: [ 'Users' ],
    request: {
      body: createApiRequestBody(registerUserBodySchema, 'User details to register')
    },
    responses: createApiResponse(registerUserResponseSchema, 'Success'),
  });

  userRegistry.registerPath({
    method: 'post',
    path: '/users/login',
    tags: [ 'Users' ],
    request: {
      body: createApiRequestBody(loginUserBodySchema, 'User login details')
    },
    responses: createApiResponse(loginUserResponseSchema, 'Success'),
  });

  return userRegistry;
};