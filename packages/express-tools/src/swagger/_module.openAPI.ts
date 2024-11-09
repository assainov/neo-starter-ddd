import express, { type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

export const initializeOpenAPIModule = (...listOfRegistries: OpenAPIRegistry[]) => {
  const openAPIRouter = express.Router();
  const registry = new OpenAPIRegistry(listOfRegistries);
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openAPIDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  });

  openAPIRouter.get('/swagger.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openAPIDocument);
  });

  openAPIRouter.use('/', swaggerUi.serve, swaggerUi.setup(openAPIDocument));

  return { openAPIRouter, openAPIDocument };
};