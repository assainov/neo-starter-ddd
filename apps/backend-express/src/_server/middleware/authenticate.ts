import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { logger } from '@neo/express-tools/logger';
import { envConfig } from '../envConfig';
import { UnauthorizedError } from '@neo/common-entities';
import { accessCookieName } from '@/auth/auth.config';
import { AccessTokenPayload } from '@neo/security/authService';

/**
 * Middleware to authenticate a user based on the Authorization header.
 * 
 * app.get('/protected-route', authenticate, (req, res) => {
 *   res.send('This is a protected route');
 * });
 */
export const authenticate: RequestHandler<unknown, unknown, unknown, unknown> = (req, res, next) => {
  const accessToken = req.cookies[accessCookieName];

  try {

    const payload = jwt.verify(accessToken, envConfig.ACCESS_TOKEN_SECRET);

    if (!payload) throw new UnauthorizedError('Invalid token');

    req.tokenPayload = payload as AccessTokenPayload;
    next();
  } catch (error) {
    logger.error(error);

    throw new UnauthorizedError('Bad credentials');
  }
};