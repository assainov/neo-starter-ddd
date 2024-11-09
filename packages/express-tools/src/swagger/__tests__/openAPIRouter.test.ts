import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import express from 'express';

import { describe, expect, it } from 'vitest';
import { App } from 'supertest/types';
import { initializeOpenAPIModule } from '../_module.openAPI';

describe('OpenAPI Router', () => {
  describe('Swagger JSON route', () => {
    it('should return Swagger JSON content', async () => {
      // Arrange
      const app = express();
      const module = initializeOpenAPIModule();
      app.use(module.openAPIRouter);

      const expectedResponse = module.openAPIDocument;

      // Act
      const response = await request(app as App).get('/swagger.json');

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.type).toBe('application/json');
      expect(response.body).toEqual(expectedResponse);
    });

    it('should serve the Swagger UI', async () => {
      // Arrange
      const app = express();
      const module = initializeOpenAPIModule();
      app.use(module.openAPIRouter);

      // Act
      const response = await request(app as App).get('/');

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('swagger-ui');
    });
  });
});