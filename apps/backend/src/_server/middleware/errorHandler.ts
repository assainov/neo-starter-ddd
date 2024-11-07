import { _BaseError, ErrorResponse, InternalServerError } from '@neo/common-entities';
import { logger } from '@neo/tools/logger';
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { envConfig } from '../envConfig';

const unknownRoute: RequestHandler<unknown, unknown, unknown, unknown> = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const isServerError = (err: Error) => err instanceof InternalServerError || (err instanceof Error && !(err instanceof _BaseError));
const isTestEnvironment = () => process.env.VITEST === 'true';

const addErrorToRequestLog: ErrorRequestHandler = (err: _BaseError, _req: Request, res: Response, _next: NextFunction) => {
  const isTracingEnabled = !envConfig.isProduction || isServerError(err) && !isTestEnvironment();

  if (isTracingEnabled) { logger.error(err); }

  const trace = isTracingEnabled ? err.stack : undefined;

  res.status(err.statusCode).json(new ErrorResponse(
    err.code,
    err.message,
    trace
  ));
};

export default () => [ unknownRoute, addErrorToRequestLog ];
