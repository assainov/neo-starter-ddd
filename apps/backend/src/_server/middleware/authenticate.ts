import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { logger } from '@neo/express-tools/logger';
import { TokenPayload } from '@neo/domain/user';
import { envConfig } from '../envConfig';
import { UnauthorizedError } from '@neo/common-entities';

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
    const token = header.slice(7);
    const payload = jwt.verify(token, envConfig.JWT_SECRET);

    if (!payload) throw new UnauthorizedError('Invalid token');

    req.tokenPayload = payload as TokenPayload;
    next();
  } catch (error) {
    logger.error(error);

    throw new UnauthorizedError('Bad credentials');
  }
};