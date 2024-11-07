import container from '@/container';
import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { App } from 'supertest/types';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Health Check API endpoints', () => {
  let app: Application;

  beforeAll(() => {
    const appServer = container.resolve('appServer');
    appServer.configure();
    app = appServer.app;

    // clean up function, called once after all tests run
    return async () => {
      await container.dispose();
    };
  });

  it('GET / - success', async () => {
    const response = await request(app as App).get('/health');
    const result = response.body as { code: string; message: string };

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.code).toEqual('healthy');
    expect(result.message).toEqual('Service is healthy');
  });
});