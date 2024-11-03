import { StatusCodes } from "http-status-codes";
import { _BaseError } from "./_BaseError";

export class InternalServerError extends _BaseError {
  public code: string;
  public statusCode: StatusCodes;

  constructor(message?: string) {
    super(message);

    this.code = 'internal_server_error';
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}