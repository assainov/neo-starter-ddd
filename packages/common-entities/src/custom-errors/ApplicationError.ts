export abstract class ApplicationError extends Error {
  public abstract statusCode: number;
  public abstract code: string;

  public constructor(message?: string) {
    super(message);
  }
}