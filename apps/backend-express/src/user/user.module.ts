import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { z } from 'zod';
import { Container } from '@/container';
import { setupOpenAPIRegistry } from './user.openapi';
import { createUserContainer } from './user.di';
import createUserController from './user.controller';

extendZodWithOpenApi(z);

export const initializeUserModule = ({ container }: { container: Container }) => {
  const userRouter: Router = express.Router();
  const { cradle: di } = createUserContainer(container);
  const userController = createUserController(di);
  const userRegistry = setupOpenAPIRegistry();

  userController(userRouter);

  return { userRouter, userRegistry };
};