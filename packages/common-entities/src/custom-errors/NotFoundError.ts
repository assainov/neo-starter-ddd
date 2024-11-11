import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class NotFoundError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'not_found_error';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}