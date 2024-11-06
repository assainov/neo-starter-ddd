export class ErrorResponse {
  public constructor(public code: string, public message: string, public trace?: string) {
    this.code = code;
    this.message = message;
    this.trace = trace;
  }
}