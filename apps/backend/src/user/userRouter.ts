import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { userController } from './userController';
import getUserValidator from './getUser/getUserValidator';
import searchUsersValidator from './searchUsers/searchUsersValidator';
import registerUserValidator from './registerUser/registerUserValidator';
import userDtoSchema from './userDtos/userDtoSchema';
import { z } from 'zod';
import { createApiRequestBody, createApiResponse } from '@/swagger/openAPIResponseBuilders';
import getUserParamsSchema from './getUser/getUserParams';
import registerUserBodySchema from './registerUser/registerUserBody';

extendZodWithOpenApi(z);

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('UserDto', userDtoSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: [ 'Users' ],
  responses: createApiResponse(z.array(userDtoSchema), 'Success'),
});

userRouter.get('/', searchUsersValidator, userController.getUsers);

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: [ 'Users' ],
  request: { params: getUserParamsSchema },
  responses: createApiResponse(userDtoSchema.optional(), 'Success'),
});

userRouter.get('/:id', getUserValidator, userController.getUser);

userRegistry.registerPath({
  method: 'post',
  path: '/users',
  tags: [ 'Users' ],
  request: {
    body: createApiRequestBody(registerUserBodySchema, 'User details to register')
  },
  responses: createApiResponse(userDtoSchema, 'Success'),
});

userRouter.post('/', registerUserValidator, userController.registerUser);
