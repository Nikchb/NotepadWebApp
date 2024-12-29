import { Request } from "express";
import DIContainer from "ts-dependency-injection-container";

interface DIRequest extends Request {
  di: DIContainer;
}

export default DIRequest;
