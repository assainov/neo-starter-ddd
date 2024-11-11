import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class ValidationError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;
  public fields?: string[];

  public constructor(message?: string, fields?: string[]) {
    super(message);

    this.code = 'validation_error';
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.fields = fields;
  }
}