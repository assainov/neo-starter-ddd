import { App } from './app';
import { EnvConfig } from './envConfig';
import { Server } from 'http';
import { Container, Registry } from '../container';
import { Logger } from '@neo/tools/logger';

/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
export class HttpServer {
  private app: App;
  private envConfig: EnvConfig;
  private logger: Logger;
  private server?: Server;
  private container: Container;

  public constructor({ app, envConfig, logger, container }: Registry) {
    this.app = app;
    this.envConfig = envConfig;
    this.logger = logger;
    this.container = container;
  }

  private forcefulShudownFallback = () => setTimeout(() => process.exit(1), 10000).unref();
  private gracefulShutdown = () => {
    this.logger.info('sigint received, shutting down');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.container.dispose().finally(() => {
      this.logger.info('container disposed');

      this.server?.close(() => {
        this.logger.info('server closed');
        process.exit();
      });

    });

    this.forcefulShudownFallback();
  };

  public start = () => {
    const app = this.app.configure();
    const { PORT, HOST, NODE_ENV } = this.envConfig;

    this.server = app.listen(PORT);

    this.logger.info(`http server (${NODE_ENV}) running at http://${HOST}:${PORT.toString()}`);

    process.on('SIGINT', this.gracefulShutdown);
    process.on('SIGTERM', this.gracefulShutdown);

    return app;
  };
}
