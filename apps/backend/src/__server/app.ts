import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import scopedContainer from './middleware/scopedContainer';
import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
import { Container, Registry } from '../container';
import { healthCheckRouter } from '../healthCheck/healthCheckRouter';
import { EnvConfig } from './envConfig';
import nocache from 'nocache';

import 'express-async-errors';
import { userRouter } from '../user/userRouter';
import { openAPIRouter } from '../swagger/openAPIRouter';

export class App {
  private app!: Application;
  private envConfig: EnvConfig;
  private container: Container;

  public constructor({ envConfig, container }: Registry) {
    this.envConfig = envConfig;
    this.app = express();
    this.container = container;
  }

  public getApp = () => this.app;

  public configure = () => {
    this.app.disable('x-powered-by');

    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this.envConfig.CORS_ORIGIN, credentials: true }));
    this.app.use(helmet());
    this.app.use(rateLimiter);

    // Request logging
    this.app.use(requestLogger());

    this.app.use(nocache());

    // DI
    this.app.use(scopedContainer(this.container));

    // Routes
    this.app.use('/health', healthCheckRouter);
    this.app.use('/users', userRouter);

    // Swagger UI
    this.app.use(openAPIRouter);

    // Error handlers
    this.app.use(errorHandler());

    return this.app;
  };

}