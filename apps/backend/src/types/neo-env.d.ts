declare namespace Express {
  export interface Request {
    container?: import('./src/container').Container;
  }
  export interface RequestHandler {
    (err: import('./src/customErrors/_BaseError'), _req: Request, res: Response, next: NextFunction): void;
  }
}