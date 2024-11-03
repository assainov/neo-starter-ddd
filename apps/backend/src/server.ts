import { App } from './app';
import { EnvConfig } from './envConfig';
import { Server as HttpServer } from 'http';
import { Logger } from './logger';
import { Container, Registry } from './container';

/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
export class Server {
  private app: App;
  private envConfig: EnvConfig;
  private logger: Logger;
  private server?: HttpServer;
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

    this.logger.info(`server (${NODE_ENV}) running on port http://${HOST}:${PORT.toString()}`);

    process.on('SIGINT', this.gracefulShutdown);
    process.on('SIGTERM', this.gracefulShutdown);

    return app;
  };
}
