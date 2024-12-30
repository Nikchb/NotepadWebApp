import { Response } from "express";

export type ErrorHandlerFunction = (
  res: Response,
  callback: () => Promise<any>
) => Promise<any>;
