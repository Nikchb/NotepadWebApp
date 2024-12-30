import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../auth/secretKey.js";
import DIRequest from "./DIRequest.js";
import AuthPayload from "../auth/authPayload.js";
import CustomError from "../models/CustomError.js";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(token, SECRET_KEY) as AuthPayload;

    const diContainer = (req as DIRequest).di;

    diContainer.addScoped<AuthPayload>("AuthPayload", async () => payload);

    next();
  } catch (err) {
    throw new CustomError(401, "Unauthenticated");
  }
};
