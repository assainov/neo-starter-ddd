import { _BaseError, ErrorResponse, InternalServerError, ValidationError } from '@neo/common-entities';
import { logger } from '@neo/tools/logger';
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { envConfig } from '../envConfig';
import { PrismaClientKnownRequestError } from '@neo/persistence/prisma';
import { ZodError } from 'zod';
import { InvalidTokenError, UnauthorizedError as JwtUnauthorized } from 'express-oauth2-jwt-bearer';

const unknownRoute: RequestHandler<unknown, unknown, unknown, unknown> = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const isServerError = (err: Error) => err instanceof InternalServerError || (err instanceof Error && !(err instanceof _BaseError));
const isTestEnvironment = () => process.env.VITEST === 'true';

const getPrismaError = (err: PrismaClientKnownRequestError) => {
  switch (err.code) {
  case 'P2002':
    // handling duplicate key errors
    return new ValidationError(`Duplicate field value: ${err.meta?.target as string}`);
  case 'P2014':
    // handling invalid id errors
    return new ValidationError(`Invalid ID: ${err.meta?.target as string}`);
  case 'P2003':
    // handling invalid data errors
    return new InternalServerError(`Invalid input data: ${err.meta?.target as string}`);
  default:
    // handling all other errors
    return new InternalServerError(`Something went wrong: ${err.message}`);
  }
};

const getZodError = (err: ZodError) => {
  const errorMessage = (err).errors.map((e) => `'${e.path.join(' ')}': ${e.message}`).join(', ');
  return new ValidationError(errorMessage);
};

const addErrorToRequestLog: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const isKnownError = err instanceof _BaseError;
  const isPrismaError = err instanceof PrismaClientKnownRequestError;
  const isZodError = err instanceof ZodError;
  const isAuthError = err instanceof JwtUnauthorized || err instanceof InvalidTokenError;

  let error = err as _BaseError;
  if (isPrismaError) {
    error = getPrismaError(err);
  } else if (isZodError) {
    error = getZodError(err);
  } else if (isAuthError) {
    error = { ...err, code: 'unauthorized' };
  } else if (!isKnownError) {
    error = new InternalServerError(err.message);
  }

  const isTracingEnabled = !envConfig.isProduction || isServerError(error) && !isTestEnvironment();

  if (isTracingEnabled) { logger.error(error); }
  const trace = isTracingEnabled ? error.stack : undefined;

  res.status(error.statusCode).json(new ErrorResponse(
    error.code,
    error.message,
    trace
  ));
};

export default () => [ unknownRoute, addErrorToRequestLog ];
