import { Request, Response, NextFunction } from "express";
import DIRequest from "./DIRequest.js";
import DIContainerTemplate, { IDIContainer } from "ts-dependency-injection-container";

export default function createDIMiddleware(container: DIContainerTemplate) {
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
  };
}
