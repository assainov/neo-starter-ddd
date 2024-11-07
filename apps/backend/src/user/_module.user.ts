import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { z } from 'zod';
import { authenticate } from '@/_server/middleware/authenticate';
import { Container } from '@/container';
import { UserController } from './_controller.user';
import { createUserContainer } from './_container.user';
import { setupOpenAPIRegistry } from './_openapi.user';
import { searchUsersValidator } from './search.user';
import { userDetailsValidator } from './details.user';
import { getUserValidator } from './get.user';
import { registerUserValidator } from './register.user';
import { loginUserValidator } from './login.user';

extendZodWithOpenApi(z);

const registerRoutes = (userRouter: Router, userController: UserController) => {
  const { search, details, get, register, login } = userController;

  userRouter.get('/', searchUsersValidator, search);
  userRouter.get('/me', userDetailsValidator, authenticate, details);
  userRouter.get('/:id', getUserValidator, get);
  userRouter.post('/register', registerUserValidator, register);
  userRouter.post('/login', loginUserValidator, login);
};

export const initializeUserModule = ({ container }: { container: Container }) => {
  const userRouter: Router = express.Router();
  const userContainer = createUserContainer(container);
  const userController = userContainer.resolve('userController');
  const userRegistry = setupOpenAPIRegistry();

  registerRoutes(userRouter, userController);

  return { userRouter, userRegistry };
};