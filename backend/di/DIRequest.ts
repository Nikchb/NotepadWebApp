import { Request } from "express";
import DIContainer from "./DIContainer.js";

interface DIRequest extends Request {
  di: DIContainer;
}

export default DIRequest;