import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class UnauthorizedError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'unauthorized_error';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}