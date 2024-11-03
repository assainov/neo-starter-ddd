import pino from 'pino';
import { envConfig } from './envConfig';

const prettifyDevLogs = (envConfig.isProduction ? {} : {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'UTC:yyyy-mm-dd HH:MM:ss',
      colorize: true,
    }
  }
});

const pinoLogger = pino({
  level: envConfig.MIN_LOG_LEVEL,
  ...prettifyDevLogs
});

// A wrapper to accept multiple arguments for logger
const logger = {
  trace: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.trace(arg);
    });
  },
  debug: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.debug(arg);
    });
  },
  info: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.info(arg);
    });
  },
  warn: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.warn(arg);
    });
  },
  error: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.error(arg);
    });
  },
  fatal: (...args: unknown[]): void => {
    args.map(arg => {
      pinoLogger.fatal(arg);
    });
  },
};

export type Logger = typeof logger;
export const _pinoLogger = pinoLogger;
export default logger;