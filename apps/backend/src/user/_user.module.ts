import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { z } from 'zod';
import { Container } from '@/container';
import { createUserContainer } from './_user.di';
import { setupOpenAPIRegistry } from './_user.openapi';

extendZodWithOpenApi(z);

export const initializeUserModule = ({ container }: { container: Container }) => {
  const userRouter: Router = express.Router();
  const userContainer = createUserContainer(container);
  const userController = userContainer.resolve('userController');
  const userRegistry = setupOpenAPIRegistry();

  userController(userRouter);

  return { userRouter, userRegistry };
};