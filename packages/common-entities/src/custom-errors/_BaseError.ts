export abstract class _BaseError extends Error {
  public abstract statusCode: number;
  public abstract code: string;
}