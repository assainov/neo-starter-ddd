import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { generateOpenAPIDocument } from '../openAPIDocumentGenerator';
import { beforeAll, describe, expect, it } from 'vitest';
import { Application } from 'express';
import container from '@/container';
import { App } from 'supertest/types';

describe('OpenAPI Router', () => {
  describe('Swagger JSON route', () => {
    let app: Application;

    beforeAll(() => {
      app = container.resolve('app').configure();

      // clean up function, called once after all tests run
      return async () => {
        await container.dispose();
      };
    });

    it('should return Swagger JSON content', async () => {
      const expectedResponse = generateOpenAPIDocument();

      // Act
      const response = await request(app as App).get('/swagger.json');

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.type).toBe('application/json');
      expect(response.body).toEqual(expectedResponse);
    });

    it('should serve the Swagger UI', async () => {
      // Act
      const response = await request(app as App).get('/');

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('swagger-ui');
    });
  });
});
