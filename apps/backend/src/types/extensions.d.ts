declare global {
  namespace Express {
    export interface Request {
      container?: import('../container').Container;
    }
    export interface RequestHandler {
      (err: import('../customErrors/_BaseError'), _req: Request, res: Response, next: NextFunction): void;
    }
  }
}