import { Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret = process.env.AUTH_SECRET ?? "secterKey";
