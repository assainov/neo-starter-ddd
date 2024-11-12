import { Application } from 'express';
import { Server } from 'http';
import { Container, Registry } from '../../container';

import 'express-async-errors';
import { Logger } from '@neo/express-tools/logger';
import { EnvConfig } from '../envConfig';
import { Database } from '@neo/persistence/prisma';

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
  protected _database: Database;

  public constructor({ container, logger, envConfig, db }: Registry) {
    this._container = container;
    this._logger = logger;
    this._envConfig = envConfig;
    this._database = db;
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

      this._database.disconnect().then(() => {
        this._logger.info('database disconnected');

        this._httpServer?.close(() => {
          this._logger.info('server closed');
          process.exit();
        });

      }).catch((err: unknown) => {
        this._logger.error('Failed disconnecting the database', err);
      });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => process.exit(1), 10000).unref();
  };
}