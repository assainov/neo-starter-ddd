import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { StatusCodes } from 'http-status-codes';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
  method: 'get',
  path: '/health',
  tags: [ 'Health check' ],
  responses: createApiResponse(z.null(), 'Success'),
});

healthCheckRouter.get('/', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({
    code: 'healthy',
    message: 'Service is healthy'
  });
});