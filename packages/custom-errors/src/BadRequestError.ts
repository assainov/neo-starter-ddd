import { StatusCodes } from 'http-status-codes';
import { _BaseError } from './_BaseError';

export class BadRequestError extends _BaseError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'bad_request';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}