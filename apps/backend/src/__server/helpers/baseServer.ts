import { Application } from 'express';
import { Server } from 'http';
import { Container, Registry } from '../../container';

import 'express-async-errors';
import { Logger } from '@neo/tools/logger';
import { EnvConfig } from '../envConfig';

/**
 * Base server class is a one-time setup for the server.
 * Therefore, it's better to abstract the server setup in a base class.
 */
export abstract class BaseServer {
  public app!: Application;
  protected _httpServer?: Server;
  protected _container: Container;
  protected _logger: Logger;
  protected _envConfig: EnvConfig;

  public constructor({ container, logger, envConfig }: Registry) {
    this._container = container;
    this._logger = logger;
    this._envConfig = envConfig;
  }

  public abstract configure(): void;

  public start() {
    this.configure();
    const { PORT, HOST, NODE_ENV } = this._envConfig;

    this._httpServer = this.app.listen(PORT);

    this._logger.info(`http server (${NODE_ENV}) running at http://${HOST}:${PORT.toString()}`);

    process.on('SIGINT', this.gracefulShutdown);
    process.on('SIGTERM', this.gracefulShutdown);
  }

  protected gracefulShutdown = () => {
    this._logger.info('sigint received, shutting down');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._container.dispose().finally(() => {
      this._logger.info('container disposed');

      this._httpServer?.close(() => {
        this._logger.info('server closed');
        process.exit();
      });

    });

    // Force shutdown after 10 seconds
    setTimeout(() => process.exit(1), 10000).unref();
  };
}