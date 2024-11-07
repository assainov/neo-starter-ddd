import jwt from 'jsonwebtoken';
import { InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { RequestHandler } from 'express';
import { logger } from '@neo/tools/logger';
import { TokenPayload } from '@neo/domain/user';
import { envConfig } from '../envConfig';

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
    throw new InvalidTokenError('Invalid authorization header');
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, envConfig.JWT_SECRET);

    if (!payload) throw new InvalidTokenError('Invalid token');

    req.tokenPayload = payload as TokenPayload;
    next();
  } catch (error) {
    logger.error(error);

    throw new InvalidTokenError('Bad credentials');
  }
};