import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, expect, it } from 'vitest';
import { healthCheckRouter } from './healthCheckRouter';

describe('Health Check API endpoints', () => {

  it('GET / - success', async () => {
    const app = express();
    app.use(healthCheckRouter);

    const response = await request(app as App).get('/health');
    const result = response.body as { code: string; message: string };

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.code).toEqual('healthy');
    expect(result.message).toEqual('Service is healthy');
  });
});