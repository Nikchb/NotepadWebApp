import { Request, Response, NextFunction } from "express";
import DIRequest from "./DIRequest.js";
import DIContainer from "./DIContainer.js";

export default function createDIMiddleware(container: DIContainer) {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as DIRequest).di = container.createContainer();
    res.on("finish", () => {
      try {
        (req as DIRequest).di.dispose();
      } catch (e) {
        console.error(e);
      }
    });
    next();
  }
}