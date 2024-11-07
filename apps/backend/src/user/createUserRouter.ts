import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { UserController } from './userController';
import getUserValidator from './getUser/getUserValidator';
import searchUsersValidator from './searchUsers/searchUsersValidator';
import registerUserValidator from './registerUser/registerUserValidator';
import userDtoSchema from './userDtos/userDtoSchema';
import { z } from 'zod';
import { createApiRequestBody, createApiResponse } from '@/swagger/openAPIResponseBuilders';
import getUserParamsSchema from './getUser/getUserParams';
import registerUserBodySchema from './registerUser/registerUserBody';
import loginUserBodySchema from './loginUser/loginUserBody';
import loginUserValidator from './loginUser/loginUserValidator';
import loginUserResponseSchema from './loginUser/loginUserResponse';
import registerUserResponseSchema from './registerUser/registerUserResponse';
import getUserResponseSchema from './getUser/getUserResponse';
import searchUsersResponseSchema from './searchUsers/searchUsersResponse';
import { authenticate } from '@/__server/middleware/authenticate';
import meValidator from './me/meValidator';
import { Container } from '@/container';
import { asClass } from 'awilix';
import { IEncryptionService, ITokenService } from '@neo/domain/user';
import { EncryptionService } from '@neo/security/encryptionService';
import JwtTokenService from '@neo/security/jwtTokenService';

extendZodWithOpenApi(z);

export type UserContainerRegistry = {
  userController: UserController,
  encryptionService: IEncryptionService,
  tokenService: ITokenService
}

export const createUserRouter = ({ container }: { container: Container }) => {
  const userRegistry = new OpenAPIRegistry();
  const userRouter: Router = express.Router();

  const userContainer = container.createScope<UserContainerRegistry>();
  userContainer.register({
    userController: asClass(UserController).scoped(),
    encryptionService: asClass(EncryptionService).scoped(),
    tokenService: asClass(JwtTokenService).scoped(),
  });
  const userController = userContainer.resolve('userController');

  userRegistry.register('UserDto', userDtoSchema);

  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: [ 'Users' ],
    responses: createApiResponse(searchUsersResponseSchema, 'Success'),
  });

  userRouter.get('/', searchUsersValidator, userController.getUsers);

  userRegistry.registerPath({
    method: 'get',
    path: '/users/me',
    tags: [ 'Users' ],
    responses: createApiResponse(userDtoSchema, 'Success'),
  });

  userRouter.get('/me', meValidator, authenticate, userController.me);

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: [ 'Users' ],
    request: { params: getUserParamsSchema },
    responses: createApiResponse(getUserResponseSchema, 'Success'),
  });

  userRouter.get('/:id', getUserValidator, userController.getUser);

  userRegistry.registerPath({
    method: 'post',
    path: '/users/register',
    tags: [ 'Users' ],
    request: {
      body: createApiRequestBody(registerUserBodySchema, 'User details to register')
    },
    responses: createApiResponse(registerUserResponseSchema, 'Success'),
  });

  userRouter.post('/register', registerUserValidator, userController.registerUser);

  userRegistry.registerPath({
    method: 'post',
    path: '/users/login',
    tags: [ 'Users' ],
    request: {
      body: createApiRequestBody(loginUserBodySchema, 'User login details')
    },
    responses: createApiResponse(loginUserResponseSchema, 'Success'),
  });

  userRouter.post('/login', loginUserValidator, userController.loginUser);

  return { userRouter, userRegistry };
};