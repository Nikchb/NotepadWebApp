import { Request, Response, NextFunction } from "express";
import DIRequest from "./DIRequest";
import Container from "./container";

export default function createDIMiddleware(container: Container) {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as DIRequest).di = container.createContainer();
    res.on("finish", () => {
      try {
        container.dispose();
      } catch (e) {
        console.error(e);
      }
    });
    next();
  }
}