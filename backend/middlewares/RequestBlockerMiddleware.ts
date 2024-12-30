import { Request, Response, NextFunction } from "express";

type RequestBlockerFunction = (req: Request) => Promise<void>;

export default function createRequestBlockerMiddleware(
  requestBlocker: RequestBlockerFunction
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await requestBlocker(req);
    next();
  };
}
