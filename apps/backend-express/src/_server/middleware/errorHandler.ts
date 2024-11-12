import {
  ApplicationError,
  InternalDatabaseError,
  UnauthorizedError,
  ErrorResponse,
  InternalServerError, ValidationError,
  BadRequestError,
  NotFoundError } from '@neo/common-entities';
import { logger } from '@neo/express-tools/logger';
import { type ErrorRequestHandler, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { envConfig } from '../envConfig';

const unknownRoute: RequestHandler<unknown, unknown, unknown, unknown> = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const isKnownServerError = (err: ApplicationError) => err instanceof InternalServerError;
const isUnknownServerError = (err: ApplicationError) => err instanceof Error && !(err instanceof ApplicationError);

const isTestEnvironment = () => process.env.VITEST === 'true' || envConfig.NODE_ENV === 'test';

const addErrorToRequestLog: ErrorRequestHandler = (err: ApplicationError, _req: Request, res: Response, _next: NextFunction) => {

  const response = getErrorResponse(err);

  const isLogged = isKnownServerError(err) || isUnknownServerError(err) && !isTestEnvironment();

  if (isLogged) { logger.error(err); }

  res.status(response.statusCode).json(response);
};

export default () => [ unknownRoute, addErrorToRequestLog ];

function getErrorResponse(err: ApplicationError): ErrorResponse {
  let response: ErrorResponse;

  let trace: typeof err.stack;
  switch (true) {
  case envConfig.NODE_ENV === 'development':
  case envConfig.NODE_ENV === 'staging':
    trace = err.stack;
    break;
  case envConfig.NODE_ENV === 'production':
  case envConfig.NODE_ENV === 'test':
  default:
    trace = undefined;
  }

  switch (true) {
  case err instanceof BadRequestError:
  case err instanceof NotFoundError:
  case err instanceof UnauthorizedError:
  case err instanceof InternalDatabaseError:
    response = new ErrorResponse(err.code, err.message, err.statusCode, [], trace);
    break;
  case err instanceof ValidationError:
    response = new ErrorResponse(err.code, err.message, err.statusCode, err.fields, trace);
    break;
  default:
    response = new ErrorResponse(
      'internal_server_error',
      'Unexpected error happened. Try again later.',
      StatusCodes.INTERNAL_SERVER_ERROR,
      []);
  }

  return response;
}