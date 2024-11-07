import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import scopedContainer from './middleware/scopedContainer';
import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
import { Registry } from '../container';
import { healthCheckRouter } from '../healthCheck/healthCheckRouter';
import nocache from 'nocache';

import 'express-async-errors';
import { userRouter } from '../user/userRouter';
import { openAPIRouter } from '../swagger/openAPIRouter';
import { BaseServer } from './helpers/baseServer';

export class AppServer extends BaseServer {
  public constructor(props: Registry) {
    super(props);
  }

  public configure() {
    this.app = express();
    this.app.disable('x-powered-by');

    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this._envConfig.CORS_ORIGIN, credentials: true }));
    this.app.use(helmet());
    this.app.use(rateLimiter);

    // Request logging
    this.app.use(requestLogger());

    this.app.use(nocache());

    // DI
    this.app.use(scopedContainer(this._container));

    // Routes
    this.app.use('/health', healthCheckRouter);
    this.app.use('/users', userRouter);

    // Swagger UI
    this.app.use(openAPIRouter);

    // Error handlers
    this.app.use(errorHandler());
  }
}