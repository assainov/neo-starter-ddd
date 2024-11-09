import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { describe, expect, it } from 'vitest';
import container from '@/container';
import { App } from 'supertest/types';
import { initializeOpenAPIModule } from '../_module.openAPI';
import { initializeUserModule } from '@/user/_module.user';
import useServer from '@/_server/tests/useServer';

describe('OpenAPI Router', () => {
  describe('Swagger JSON route', () => {
    const getApp = useServer();

    it('should return Swagger JSON content', async () => {
      // Arrange
      const app = getApp();
      const { userRegistry } = initializeUserModule({ container });

      const module = initializeOpenAPIModule(userRegistry);
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
      const app = getApp();

      // Act
      const response = await request(app as App).get('/');

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('swagger-ui');
    });
  });
});
