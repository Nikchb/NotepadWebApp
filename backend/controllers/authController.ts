import { Request, Response } from "express";
import SignDTO from "../dtos/signDTO.js";
import { IAuthService } from "../services/authService.js";
import { ErrorHandlerFunction } from "../types/ErrorHandlerFunction.js";

export interface IAuthController {
  signIn(req: Request, res: Response): Promise<void>;
  signUp(req: Request, res: Response): Promise<void>;
}

export class AuthController implements IAuthController {
  constructor(
    private authService: IAuthService,
    private errorHandler: ErrorHandlerFunction
  ) {}

  async signIn(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res.status(200).send(await this.authService.signIn(req.body as SignDTO))
    );
  }

  async signUp(req: Request, res: Response) {
    await this.errorHandler(res, async () =>
      res.status(200).send(await this.authService.signUp(req.body as SignDTO))
    );
  }
}
