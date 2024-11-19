declare namespace Express {
  export interface Request {
    container?: import('@/container').Container;
    tokenPayload?: import('@neo/domain/refresh-token').AccessTokenPayload
  }
  export interface RequestHandler {
    (err: import('@neo/common-entities').ApplicationError, _req: Request, res: Response, next: NextFunction): void;
  }
}

declare module 'response-time';