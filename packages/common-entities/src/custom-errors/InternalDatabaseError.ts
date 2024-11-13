import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

/**
 * This error class is used to map and format a specific error of the ORM client.
 */
export class InternalDatabaseError extends ApplicationError {
  public code: string;
  public statusCode: StatusCodes;

  public constructor(message?: string) {
    super(message);

    this.code = 'database_error';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}