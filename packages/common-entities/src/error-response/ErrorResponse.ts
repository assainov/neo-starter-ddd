export class ErrorResponse {
  #statusCode: number;
  public constructor(public code: string, public message: string, statusCode: number, public fields?: string[], public trace?: string) {
    this.#statusCode = statusCode;
  }

  public get statusCode(): number {
    return this.#statusCode;
  }
}