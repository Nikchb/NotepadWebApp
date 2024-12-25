import { Request } from "express";
import Container from "./container";

interface DIRequest extends Request {
  di: Container;
}

export default DIRequest;