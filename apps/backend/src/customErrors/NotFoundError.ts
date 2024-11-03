import { StatusCodes } from "http-status-codes";
import { _BaseError } from "./_BaseError";

export class NotFoundError extends _BaseError {
  public code: string;
  public statusCode: StatusCodes;

  constructor(message?: string) {
    super(message);

    this.code = 'not_found';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}