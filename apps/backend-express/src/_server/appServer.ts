import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import responseTime from 'response-time';
import scopedContainer from './middleware/scopedContainer';
import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
import { Registry } from '../container';
import nocache from 'nocache';
import cookieParser from 'cookie-parser';

import 'express-async-errors';
import { BaseServer } from './helpers/baseServer';
import { healthCheckRouter } from '@neo/express-tools/health-check';
import { initializeOpenAPIModule } from '@neo/express-tools/swagger';
import { initializeUserModule } from '@/user/user.module';

export class AppServer extends BaseServer {
  public constructor(props: Registry) {
    super(props);
  }

  public configure() {
    this.app = express();
    this.app.disable('x-powered-by');

    // Middlewares
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this._envConfig.CORS_ORIGIN, credentials: true }));
    this.app.use(helmet());
    this.app.use(rateLimiter);
    this.app.use(responseTime());

    // Request logging
    this.app.use(requestLogger());

    this.app.use(nocache());

    // DI
    this.app.use(scopedContainer(this._container));

    // Routes
    const { userRouter, userRegistry } = initializeUserModule({ container: this._container });
    this.app.use('/health', healthCheckRouter);
    this.app.use('/users', userRouter);

    // Swagger UI
    const { openAPIRouter } = initializeOpenAPIModule(userRegistry);
    this.app.use(openAPIRouter);

    // Error handlers
    this.app.use(errorHandler());
  }
}