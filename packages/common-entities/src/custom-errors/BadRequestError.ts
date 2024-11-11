import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class BadRequestError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'bad_request_error';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}