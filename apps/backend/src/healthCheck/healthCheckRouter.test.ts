import useServer from '@/_server/tests/useServer';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, expect, it } from 'vitest';

describe('Health Check API endpoints', () => {
  const getApp = useServer();

  it('GET / - success', async () => {
    const app = getApp();

    const response = await request(app as App).get('/health');
    const result = response.body as { code: string; message: string };

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.code).toEqual('healthy');
    expect(result.message).toEqual('Service is healthy');
  });
});