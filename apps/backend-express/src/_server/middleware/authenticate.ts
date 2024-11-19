import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { logger } from '@neo/express-tools/logger';
import { envConfig } from '../envConfig';
import { UnauthorizedError } from '@neo/common-entities';
import { AccessTokenPayload } from '@neo/domain/refresh-token';

const PART_AFTER_BEARER = 7;

/**
 * Middleware to authenticate a user based on the Authorization header.
 * 
 * app.get('/protected-route', authenticate, (req, res) => {
 *   res.send('This is a protected route');
 * });
 */
export const authenticate: RequestHandler<unknown, unknown, unknown, unknown> = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) {
    throw new UnauthorizedError('Authorization failed');
  }

  if (!header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid authorization header');
  }

  try {
    const accessToken = header.slice(PART_AFTER_BEARER);

    const payload = jwt.verify(accessToken, envConfig.ACCESS_TOKEN_SECRET);

    if (!payload) throw new UnauthorizedError('Invalid token');

    req.tokenPayload = payload as AccessTokenPayload;
    next();
  } catch (error) {
    logger.error(error);

    throw new UnauthorizedError('Bad credentials');
  }
};