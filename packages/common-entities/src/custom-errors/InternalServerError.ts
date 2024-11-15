import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class InternalServerError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'internal_server_error';
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}