import { Request, Response, NextFunction } from "express";

type ErrorHandlerFunction = (
  e: any,
  req: Request,
  res: Response
) => Promise<void>;

export default function createErrorHandlerMiddleware(
  errorHandler: ErrorHandlerFunction
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (e: any) {
      await errorHandler(e, req, res);
    }
  };
}
