import { _BaseError } from '@/common/customErrors/_BaseError';
import { InternalServerError } from '@/common/customErrors/InternalServerError';
import { ErrorResponse } from '@/common/ErrorResponse';
import { logger } from '@neo/tools/logger';
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { InsufficientScopeError, InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { StatusCodes } from 'http-status-codes';

const unknownRoute: RequestHandler<unknown, unknown, unknown, unknown> = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const isServerError = (err: Error) => err instanceof InternalServerError || (err instanceof Error && !(err instanceof _BaseError));
const isTestEnvironment = () => process.env.VITEST === 'true';

const addErrorToRequestLog: ErrorRequestHandler = (err: _BaseError, _req: Request, res: Response, _next: NextFunction) => {
  let message = err.message;
  // Auth:
  if (err instanceof InsufficientScopeError) {
    message = 'Permission denied';
  }

  if (err instanceof InvalidTokenError) {
    message = 'Bad credentials';
  }

  if (err instanceof UnauthorizedError) {
    message = 'Requires authentication';
  }

  err.message = message;

  const isTracingEnabled = isServerError(err) && !isTestEnvironment();

  if (isTracingEnabled) { logger.error(err); }

  const trace = isTracingEnabled ? err.stack : undefined;

  res.status(err.statusCode).json(new ErrorResponse(
    err.code,
    err.message,
    trace
  ));
};

export default () => [ unknownRoute, addErrorToRequestLog ];
