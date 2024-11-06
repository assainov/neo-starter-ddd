import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => (req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const errorMessage = (err as ZodError).errors.map((e) => `'${e.path.join(' ')}': ${e.message}`).join(', ');
    throw new ValidationError(errorMessage);
  }
};