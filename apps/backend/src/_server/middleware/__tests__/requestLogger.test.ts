import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, beforeAll, it, expect } from 'vitest';
import requestLogger from '../requestLogger';
import { App } from 'supertest/types';

describe('Request Logger Middleware', () => {
  const app = express();

  beforeAll(() => {
    app.use(requestLogger());
    app.get('/success', (req, res) => {
      res.status(StatusCodes.OK).send('Success');
    });
    app.get('/redirect', (req, res) => { res.redirect('/success'); });
  });

  describe('Successful requests', () => {
    it('logs successful requests', async () => {
      const response = await request(app as App).get('/success');
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('checks existing request id', async () => {
      const requestId = 'test-request-id';
      const response = await request(app as App).get('/success').set('X-Request-Id', requestId);
      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  describe('Re-directions', () => {
    it('logs re-directions correctly', async () => {
      const response = await request(app as App).get('/redirect');
      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
    });
  });
});
