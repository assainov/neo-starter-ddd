import { ValidationError } from "@/customErrors/ValidationError";
import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const errorMessage = `${(err as ZodError).errors.map((e) => `'${e.path}': ${e.message}`).join(", ")}`;
    throw new ValidationError(errorMessage);
  }
};