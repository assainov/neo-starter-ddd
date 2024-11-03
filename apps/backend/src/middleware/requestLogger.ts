import { randomUUID, UUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { LevelWithSilent } from 'pino';
import { type CustomAttributeKeys, type Options, pinoHttp } from 'pino-http';
import { envConfig } from '@/envConfig';

enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}

type PinoCustomProps = {
  request: Request;
  response: Response;
  error: Error;
  responseBody: unknown;
};

const requestLogger = (options?: Options): RequestHandler[] => {
  const pinoOptions: Options = {
    enabled: envConfig.isProduction,
    customProps: customProps as unknown as Options['customProps'],
    redact: [],
    genReqId,
    customLogLevel,
    customSuccessMessage,
    customReceivedMessage: (req) => `request received: ${req.method ?? 'UNKNOWN'} ${req.url ?? 'UNKNOWN'}`,
    customErrorMessage: (_req, res) => `request errored with status code: ${res.statusCode.toString()}`,
    customAttributeKeys,
    ...options,
  };
  return [ responseBodyMiddleware, pinoHttp(pinoOptions) ];
};

const customAttributeKeys: CustomAttributeKeys = {
  req: 'request',
  res: 'response',
  err: 'error',
  responseTime: 'timeTaken',
};

const customProps = (req: Request, res: Response): PinoCustomProps => ({
  request: req,
  response: res,
  error: res.locals.err as Error,
  responseBody: res.locals.responseBody,
});

const responseBodyMiddleware: RequestHandler = (_req, res, next) => {
  if (!envConfig.isProduction) {
    const originalSend = res.send;
    res.send = (content) => {
      res.locals.responseBody = content as string;
      res.send = originalSend;
      return originalSend.call(res, content);
    };
  }
  next();
};

const customLogLevel = (_req: IncomingMessage, res: ServerResponse, err?: Error): LevelWithSilent => {
  if (err || res.statusCode >= 500) return LogLevel.Error;
  if (res.statusCode >= 400) return LogLevel.Warn;
  if (res.statusCode >= 300) return LogLevel.Silent;
  return LogLevel.Info;
};

const customSuccessMessage = (req: IncomingMessage, res: ServerResponse) => {
  if (res.statusCode === 404) return getReasonPhrase(StatusCodes.NOT_FOUND);
  return `${req.method ?? 'UNKNOWN'} completed`;
};

const genReqId = (req: IncomingMessage, res: ServerResponse) => {
  const existingID = (req.id as UUID | undefined) ?? req.headers['x-request-id'];
  if (existingID) return existingID;
  const id = randomUUID();
  res.setHeader('X-Request-Id', id);
  return id;
};

export default requestLogger;
