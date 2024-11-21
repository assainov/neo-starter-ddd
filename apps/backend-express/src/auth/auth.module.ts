import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { z } from 'zod';
import { Container } from '@/container';
import { setupOpenAPIRegistry } from './auth.openapi';
import createAuthController from './auth.controller';
import { createAuthContainer } from './auth.di';

extendZodWithOpenApi(z);

export const initializeAuthModule = ({ container }: { container: Container }) => {
  const authRouter: Router = express.Router();
  const { cradle: di } = createAuthContainer(container);
  const authController = createAuthController(di);
  const authRegistry = setupOpenAPIRegistry();

  authController(authRouter);

  return { authRouter, authRegistry };
};