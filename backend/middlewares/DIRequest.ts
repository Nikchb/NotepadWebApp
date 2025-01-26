import { Request } from "express";
import { IDIContainer } from "ts-dependency-injection-container";

interface DIRequest extends Request {
  di: IDIContainer;
}

export default DIRequest;
